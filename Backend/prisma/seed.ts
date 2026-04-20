import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Hash password
    const hashedPassword = await bcrypt.hash('@#k$7878V', 10);

    // Create admin user
    const admin = await prisma.user.upsert({
        where: { email_franchise_id: { email: 'expertttrainers@gmail.com', franchise_id: null } },
        update: {
            role: 'SUPER_ADMIN',
        },
        create: {
            email: 'expertttrainers@gmail.com',
            name: 'Super Admin User',
            password_hash: hashedPassword,
            role: 'SUPER_ADMIN',
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
        where: { email_franchise_id: { email: 'instructor@lms.com', franchise_id: null } },
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
        where: { email_franchise_id: { email: 'student@lms.com', franchise_id: null } },
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

    // Create some categories (system categories with franchise_id: null)
    const categoryData = [
        { name: 'Web Development', slug: 'web-development', description: 'Build modern web applications', icon: '💻' },
        { name: 'Data Science', slug: 'data-science', description: 'Analyze data and build ML models', icon: '📊' },
        { name: 'Design', slug: 'design', description: 'UI/UX and graphic design', icon: '🎨' },
    ];

    const categories = await Promise.all(
        categoryData.map(async (cat) => {
            const existing = await prisma.category.findFirst({ where: { slug: cat.slug, franchise_id: null } });
            if (existing) return existing;
            return prisma.category.create({ data: { ...cat, franchise_id: null } });
        })
    );
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
