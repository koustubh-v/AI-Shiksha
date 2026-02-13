const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@lms.com';
    const password = 'Admin@123';
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('Seeding admin user...');

    try {
        const admin = await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
                id: 'e35bb631-4d8c-4369-af73-f64987ef8430', // Consistent ID
                email,
                name: 'Admin User',
                password_hash: hashedPassword,
                role: 'ADMIN', // String literal
                avatar_url: 'https://github.com/shadcn.png',
            },
        });
        console.log('Admin seeded:', admin);
    } catch (e) {
        console.error('Error seeding admin:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
