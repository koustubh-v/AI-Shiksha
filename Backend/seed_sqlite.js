const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    const email = 'expertttrainers@gmail.com';
    const password = '@#k$7878V';
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('Seeding super admin user...');

    try {
        const admin = await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
                id: 'e35bb631-4d8c-4369-af73-f64987ef8430', // Consistent ID
                email,
                name: 'Super Admin',
                password_hash: hashedPassword,
                role: 'SUPER_ADMIN', // String literal
                avatar_url: 'https://github.com/shadcn.png',
            },
        });
        console.log('Super Admin seeded:', admin);
    } catch (e) {
        console.error('Error seeding admin:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
