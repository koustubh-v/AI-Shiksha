const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function seedAdmin() {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@lms.com' },
        update: {},
        create: {
            name: 'Admin User',
            email: 'admin@lms.com',
            password_hash: hashedPassword,
            role: 'ADMIN',
        },
    });

    console.log('✅ Admin user created/updated:');
    console.log('   Email: admin@lms.com');
    console.log('   Password: admin123');
    console.log('   Role: ADMIN');
}

seedAdmin()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
