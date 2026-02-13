const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedCategories() {
    const categories = [
        { name: 'Development', description: 'Programming and software development courses', icon: 'Code' },
        { name: 'Business', description: 'Business and entrepreneurship courses', icon: 'Briefcase' },
        { name: 'Design', description: 'Design and creative courses', icon: 'Palette' },
        { name: 'Marketing', description: 'Marketing and sales courses', icon: 'TrendingUp' },
        { name: 'IT & Software', description: 'IT and software courses', icon: 'Server' },
        { name: 'Personal Development', description: 'Personal growth and development courses', icon: 'User' },
        { name: 'Photography', description: 'Photography and videography courses', icon: 'Camera' },
        { name: 'Music', description: 'Music and audio production courses', icon: 'Music' },
    ];

    for (const category of categories) {
        const slug = category.name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
        await prisma.category.upsert({
            where: { slug },
            update: {},
            create: {
                ...category,
                slug,
            },
        });
    }

    console.log('✅ Categories seeded successfully');
}

seedCategories()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
