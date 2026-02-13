import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) { }

  async create(instructorUserId: string, createCourseDto: CreateCourseDto) {
    // Check if user has an instructor profile
    let instructor = await this.prisma.instructorProfile.findUnique({
      where: { user_id: instructorUserId },
    });

    // If no instructor profile exists, check if user is admin and create one
    if (!instructor) {
      const user = await this.prisma.user.findUnique({
        where: { id: instructorUserId },
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      // If user is admin, auto-create instructor profile
      if (user.role === 'ADMIN') {
        instructor = await this.prisma.instructorProfile.create({
          data: {
            user_id: instructorUserId,
            headline: 'Administrator',
            description: 'Platform Administrator',
          },
        });
      } else {
        throw new BadRequestException('User is not an instructor');
      }
    }

    const {
      modules,
      category_id,
      tag_ids,
      prerequisite_course_ids,
      ...courseData
    } = createCourseDto;

    return this.prisma.course.create({
      data: {
        ...courseData,
        slug: courseData.slug || courseData.title.toLowerCase().replace(/ /g, '-') + '-' + Date.now(),
        instructor_id: instructor.id,
        category_id: category_id || null,
        prerequisites: prerequisite_course_ids
          ? {
            create: prerequisite_course_ids.map((id) => ({
              prerequisite_course_id: id,
            })),
          }
          : undefined,
        modules: modules
          ? {
            create: modules.map((module) => ({
              title: module.title,
              position: module.position || 0,
              lessons: module.lessons
                ? {
                  create: module.lessons.map((lesson) => ({
                    title: lesson.title,
                    content: lesson.content,
                    video_url: lesson.video_url,
                    duration_seconds: lesson.duration_seconds || 0,
                    is_preview: lesson.is_preview || false,
                    position: lesson.position || 0,
                  })),
                }
                : undefined,
            })),
          }
          : undefined,
        tags:
          tag_ids && tag_ids.length > 0
            ? {
              create: tag_ids.map((tag_id) => ({
                tag_id: tag_id,
              })),
            }
            : undefined,
      },
      include: {
        modules: {
          include: { lessons: true },
        },
        category: true,
        tags: {
          include: { tag: true },
        },
      },
    });
  }

  async findAll(adminRequest: boolean = false) {
    const whereClause: any = adminRequest ? {} : { status: 'published' };

    const courses = await this.prisma.course.findMany({
      where: whereClause,
      include: {
        instructor: { include: { user: true } },
        _count: {
          select: {
            enrollments: true,
            reviews: true,
          },
        },
        modules: {
          include: {
            _count: {
              select: { lessons: true },
            },
          },
        },
        reviews: {
          select: { rating: true },
        },
        payments: adminRequest,
      },
      orderBy: { created_at: 'desc' },
    });

    return (courses as any[]).map((course) => ({
      id: course.id,
      title: course.title,
      thumbnail: course.thumbnail_url,
      status: course.status,
      students: course._count.enrollments,
      rating:
        course.reviews.reduce((acc, r) => acc + r.rating, 0) /
        (course.reviews.length || 1),
      lessons: course.modules.reduce((acc, m) => acc + m._count.lessons, 0),
      price: course.price,
      lastUpdated: course.updated_at,
      instructor: course.instructor.user.name,
      level: course.level,
      revenue: course.payments
        ? course.payments.reduce((sum, p) => sum + p.amount, 0)
        : 0,
    }));
  }

  async findMyCourses(userId: string) {
    const instructor = await this.prisma.instructorProfile.findUnique({
      where: { user_id: userId },
    });

    if (!instructor) {
      return [];
    }

    const courses = await this.prisma.course.findMany({
      where: { instructor_id: instructor.id },
      include: {
        _count: {
          select: {
            enrollments: true,
            reviews: true,
          },
        },
        modules: {
          include: {
            _count: {
              select: { lessons: true },
            },
          },
        },
        reviews: {
          select: { rating: true },
        },
      },
      orderBy: { updated_at: 'desc' },
    });

    return (courses as any[]).map((course) => ({
      id: course.id,
      title: course.title,
      thumbnail: course.thumbnail_url,
      status: course.status,
      students: course._count.enrollments,
      rating:
        course.reviews.reduce((acc, r) => acc + r.rating, 0) /
        (course.reviews.length || 1),
      lessons: course.modules.reduce((acc, m) => acc + m._count.lessons, 0),
      price: course.price,
      revenue: 0, // Calculate revenue if needed
      lastUpdated: course.updated_at,
    }));
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        instructor: { include: { user: true } },
        modules: {
          include: {
            lessons: true,
          },
          orderBy: { position: 'asc' },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  async update(
    id: string,
    updateCourseDto: UpdateCourseDto,
    userId: string,
    userRole?: string,
  ) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: { instructor: true },
    });

    if (!course) throw new NotFoundException('Course not found');

    // Verify ownership (skip for Admin)
    if (course.instructor.user_id !== userId && userRole !== 'ADMIN') {
      throw new BadRequestException('You do not own this course'); // Or ForbiddenException
    }

    const { modules, prerequisite_course_ids, tag_ids, ...courseData } =
      updateCourseDto;

    return this.prisma.$transaction(async (prisma: any) => {
      // 1. Update course details
      const updatedCourse = await prisma.course.update({
        where: { id },
        data: {
          ...courseData,
          // Handle Tags Update
          tags: tag_ids
            ? {
              deleteMany: {}, // Clear existing tags
              create: tag_ids.map((tag_id) => ({ tag_id })), // Add new tags
            }
            : undefined,
          // Handle Prerequisites Update
          prerequisites: prerequisite_course_ids
            ? {
              deleteMany: {}, // Clear existing
              create: prerequisite_course_ids.map((id) => ({
                prerequisite_course_id: id,
              })),
            }
            : undefined,
        },
      });

      // 2. Handle modules and lessons if provided
      if (modules) {
        // Get existing modules
        const existingModules = await prisma.module.findMany({
          where: { course_id: id },
          include: { lessons: true },
        });

        const existingModuleIds = existingModules.map((m) => m.id);
        const incomingModuleIds = modules.filter((m) => m.id).map((m) => m.id);

        // Delete removed modules
        const modulesToDelete = existingModuleIds.filter(
          (id) => !incomingModuleIds.includes(id),
        );
        if (modulesToDelete.length > 0) {
          await prisma.module.deleteMany({
            where: { id: { in: modulesToDelete } },
          });
        }

        // Process each incoming module
        for (const [index, moduleDto] of modules.entries()) {
          const moduleData = {
            title: moduleDto.title,
            position: index, // Use array index as position
          };

          let moduleId = moduleDto.id;

          if (moduleId && existingModuleIds.includes(moduleId)) {
            // Update existing module
            await prisma.module.update({
              where: { id: moduleId },
              data: moduleData,
            });
          } else {
            // Create new module
            const newModule = await prisma.module.create({
              data: {
                ...moduleData,
                course: { connect: { id } },
              },
            });
            moduleId = newModule.id;
          }

          // Handle lessons for this module
          if (moduleDto.lessons) {
            const existingLessons =
              existingModules.find((m) => m.id === moduleId)?.lessons || [];
            const existingLessonIds = existingLessons.map((l) => l.id);
            const incomingLessonIds = moduleDto.lessons
              .filter((l) => l.id)
              .map((l) => l.id);

            // Delete removed lessons
            const lessonsToDelete = existingLessonIds.filter(
              (id) => !incomingLessonIds.includes(id),
            );
            if (lessonsToDelete.length > 0) {
              await prisma.lesson.deleteMany({
                where: { id: { in: lessonsToDelete } },
              });
            }

            // Upsert lessons
            for (const [lIndex, lessonDto] of moduleDto.lessons.entries()) {
              const lessonData = {
                title: lessonDto.title,
                content: lessonDto.content,
                video_url: lessonDto.video_url,
                duration_seconds: lessonDto.duration_seconds || 0,
                is_preview: lessonDto.is_preview || false,
                position: lIndex,
              };

              if (lessonDto.id && existingLessonIds.includes(lessonDto.id)) {
                await prisma.lesson.update({
                  where: { id: lessonDto.id },
                  data: lessonData,
                });
              } else {
                await prisma.lesson.create({
                  data: {
                    ...lessonData,
                    module: { connect: { id: moduleId } },
                  },
                });
              }
            }
          }
        }
      }

      return updatedCourse;
    });
  }

  async remove(id: string, userId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: { instructor: true },
    });

    if (!course) throw new NotFoundException('Course not found');

    // Verify ownership
    if (course.instructor.user_id !== userId) {
      throw new BadRequestException('You do not own this course');
    }

    return this.prisma.course.delete({
      where: { id },
    });
  }

  // ========== APPROVAL WORKFLOW METHODS ==========

  async submitForApproval(courseId: string, userId: string) {
    // Verify ownership
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: { instructor: true },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.instructor.user_id !== userId) {
      throw new ForbiddenException('You do not own this course');
    }

    if (course.status !== 'DRAFT') {
      throw new BadRequestException(
        'Only draft courses can be submitted for approval',
      );
    }

    return (this.prisma as any).course.update({
      where: { id: courseId },
      data: {
        status: 'PENDING_APPROVAL',
        submitted_for_approval_at: new Date(),
      },
      include: {
        instructor: { include: { user: true } },
        category: true,
      },
    });
  }

  async approveCourse(courseId: string, adminUserId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.status !== 'PENDING_APPROVAL') {
      throw new BadRequestException('Only pending courses can be approved');
    }

    return (this.prisma as any).course.update({
      where: { id: courseId },
      data: {
        status: 'PUBLISHED',
        approved_by: adminUserId,
        approved_at: new Date(),
        rejection_reason: null,
      },
      include: {
        instructor: { include: { user: true } },
        approver: true,
        category: true,
      },
    });
  }

  async rejectCourse(courseId: string, adminUserId: string, reason: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.status !== 'PENDING_APPROVAL') {
      throw new BadRequestException('Only pending courses can be rejected');
    }

    return (this.prisma as any).course.update({
      where: { id: courseId },
      data: {
        status: 'REJECTED',
        rejection_reason: reason,
        approved_by: adminUserId,
        approved_at: new Date(),
      },
      include: {
        instructor: { include: { user: true } },
        approver: true,
      },
    });
  }

  async publishCourse(courseId: string, adminUserId: string) {
    // Admin can directly publish any course
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return (this.prisma as any).course.update({
      where: { id: courseId },
      data: {
        status: 'PUBLISHED',
        approved_by: adminUserId,
        approved_at: new Date(),
      },
      include: {
        instructor: { include: { user: true } },
        approver: true,
        category: true,
      },
    });
  }

  async getPendingApproval() {
    return (this.prisma as any).course.findMany({
      where: { status: 'PENDING_APPROVAL' },
      include: {
        instructor: { include: { user: true } },
        category: true,
        _count: {
          select: {
            enrollments: true,
            reviews: true,
          },
        },
      },
      orderBy: { submitted_for_approval_at: 'asc' },
    });
  }
}
