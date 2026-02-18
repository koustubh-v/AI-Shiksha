/**
 * Script to enable certificates for all courses and assign default template
 * Run with: npx tsx prisma/scripts/enable-certificates.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function enableCertificates() {
    try {
        console.log('Starting certificate enablement for all courses...');

        // Get the first certificate template (or create a default one)
        let template = await prisma.certificateTemplate.findFirst();

        if (!template) {
            console.log('No certificate template found. Please run the certificate templates seed first.');
            console.log('Run: npx tsx prisma/seeds/certificateTemplates.seed.ts');
            process.exit(1);
        }

        // Update all courses to enable certificates and assign template
        const result = await prisma.course.updateMany({
            where: {
                certificate_enabled: false,
            },
            data: {
                certificate_enabled: true,
                certificate_template_id: template.id,
            },
        });

        console.log(`✅ Enabled certificates for ${result.count} courses`);
        console.log(`   Template assigned: ${template.name}`);

        // List all courses with certificate status
        const courses = await prisma.course.findMany({
            select: {
                id: true,
                title: true,
                certificate_enabled: true,
                certificate_template: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        console.log('\nCourses certificate status:');
        courses.forEach(course => {
            const status = course.certificate_enabled ? '✅ Enabled' : '❌ Disabled';
            const template = course.certificate_template?.name || 'No template';
            console.log(`  ${status} - ${course.title} (${template})`);
        });

    } catch (error) {
        console.error('Error enabling certificates:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

enableCertificates();
