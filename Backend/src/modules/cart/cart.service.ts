import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CartService {
    constructor(private prisma: PrismaService) { }

    async addToCart(userId: string, courseId: string) {
        // Check if course exists and is published
        const course = await this.prisma.course.findUnique({
            where: { id: courseId },
        });

        if (!course) {
            throw new NotFoundException('Course not found');
        }

        if (course.status !== 'PUBLISHED') {
            throw new BadRequestException('Only published courses can be added to cart');
        }

        // Check if user is already enrolled
        const existingEnrollment = await this.prisma.enrollment.findFirst({
            where: {
                student_id: userId,
                course_id: courseId,
            },
        });

        if (existingEnrollment) {
            throw new BadRequestException('You are already enrolled in this course');
        }

        // Check if already in cart
        const existingCartItem = await this.prisma.cartItem.findFirst({
            where: {
                user_id: userId,
                course_id: courseId,
            },
        });

        if (existingCartItem) {
            return existingCartItem; // Already in cart
        }

        // Add to cart
        return this.prisma.cartItem.create({
            data: {
                user_id: userId,
                course_id: courseId,
            },
            include: {
                course: {
                    include: {
                        instructor: {
                            include: {
                                user: true,
                            },
                        },
                    },
                },
            },
        });
    }

    async getCart(userId: string) {
        const cartItems = await this.prisma.cartItem.findMany({
            where: { user_id: userId },
            include: {
                course: {
                    include: {
                        instructor: {
                            include: {
                                user: true,
                            },
                        },
                        category: true,
                    },
                },
            },
            orderBy: { created_at: 'desc' },
        });

        const total = cartItems.reduce((sum, item) => sum + (item.course.price || 0), 0);

        return {
            items: cartItems,
            total,
            itemCount: cartItems.length,
        };
    }

    async removeFromCart(userId: string, courseId: string) {
        const cartItem = await this.prisma.cartItem.findFirst({
            where: {
                user_id: userId,
                course_id: courseId,
            },
        });

        if (!cartItem) {
            throw new NotFoundException('Item not found in cart');
        }

        await this.prisma.cartItem.delete({
            where: { id: cartItem.id },
        });

        return { message: 'Item removed from cart' };
    }

    async clearCart(userId: string) {
        await this.prisma.cartItem.deleteMany({
            where: { user_id: userId },
        });

        return { message: 'Cart cleared' };
    }

    async getCartItemCount(userId: string) {
        const count = await this.prisma.cartItem.count({
            where: { user_id: userId },
        });

        return { count };
    }
}
