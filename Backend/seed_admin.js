const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function seedAdmin() {
    const hashedPassword = await bcrypt.hash('@#k$7878V', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'expertttrainers@gmail.com' },
        update: {},
        create: {
            name: 'Super Admin',
            email: 'expertttrainers@gmail.com',
            password_hash: hashedPassword,
            role: 'SUPER_ADMIN',
        },
    });

    console.log('✅ Super Admin user created/updated:');
    console.log('   Email: expertttrainers@gmail.com');
    // Password output hidden for security
    console.log('   Role: SUPER_ADMIN');
}

seedAdmin()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
