import { PrismaClient } from '@prisma/client';
import { Role } from '../src/enums/role.enum';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@lms.com';
    const password = 'Admin@123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            name: 'Admin User',
            password_hash: hashedPassword,
            role: 'ADMIN',
            avatar_url: 'https://github.com/shadcn.png',
        },
    });

    console.log({ admin });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
