import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create admin user
    const admin = await prisma.user.upsert({
        where: { email: 'admin@lms.com' },
        update: {},
        create: {
            email: 'admin@lms.com',
            name: 'Admin User',
            password_hash: hashedPassword,
            role: 'ADMIN',
            bio: 'System Administrator',
        },
    });

    console.log('✅ Admin user created:', {
        email: admin.email,
        name: admin.name,
        role: admin.role,
    });

    // Create instructor user
    const instructorUser = await prisma.user.upsert({
        where: { email: 'instructor@lms.com' },
        update: {},
        create: {
            email: 'instructor@lms.com',
            name: 'John Instructor',
            password_hash: hashedPassword,
            role: 'INSTRUCTOR',
            bio: 'Experienced instructor',
        },
    });

    // Create instructor profile
    const instructorProfile = await prisma.instructorProfile.upsert({
        where: { user_id: instructorUser.id },
        update: {},
        create: {
            user_id: instructorUser.id,
            headline: 'Senior Software Engineer & Educator',
            description: 'Passionate about teaching and technology',
            verified: true,
            rating: 4.8,
        },
    });

    console.log('✅ Instructor created:', {
        email: instructorUser.email,
        name: instructorUser.name,
        role: instructorUser.role,
    });

    // Create student user
    const student = await prisma.user.upsert({
        where: { email: 'student@lms.com' },
        update: {},
        create: {
            email: 'student@lms.com',
            name: 'Jane Student',
            password_hash: hashedPassword,
            role: 'STUDENT',
            bio: 'Eager learner',
        },
    });

    console.log('✅ Student created:', {
        email: student.email,
        name: student.name,
        role: student.role,
    });

    // Create some categories
    const categories = await Promise.all([
        prisma.category.upsert({
            where: { slug: 'web-development' },
            update: {},
            create: {
                name: 'Web Development',
                slug: 'web-development',
                description: 'Build modern web applications',
                icon: '💻',
            },
        }),
        prisma.category.upsert({
            where: { slug: 'data-science' },
            update: {},
            create: {
                name: 'Data Science',
                slug: 'data-science',
                description: 'Analyze data and build ML models',
                icon: '📊',
            },
        }),
        prisma.category.upsert({
            where: { slug: 'design' },
            update: {},
            create: {
                name: 'Design',
                slug: 'design',
                description: 'UI/UX and graphic design',
                icon: '🎨',
            },
        }),
    ]);

    console.log('✅ Categories created:', categories.length);

    console.log('\n🎉 Seeding completed successfully!');
    console.log('\n📝 Login credentials:');
    console.log('─────────────────────────────');
    console.log('Admin:');
    console.log('  Email: admin@lms.com');
    console.log('  Password: admin123');
    console.log('\nInstructor:');
    console.log('  Email: instructor@lms.com');
    console.log('  Password: admin123');
    console.log('\nStudent:');
    console.log('  Email: student@lms.com');
    console.log('  Password: admin123');
    console.log('─────────────────────────────\n');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
