/**
 * Script to generate certificates for completed enrollments that don't have one
 * Run with: npx tsx prisma/scripts/generate-missing-certificates.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function generateMissingCertificates() {
    try {
        console.log('Finding completed enrollments without certificates...');

        // Find all 100% complete enrollments
        const completedEnrollments = await prisma.enrollment.findMany({
            where: {
                progress_percentage: 100,
                completed_at: {
                    not: null,
                },
            },
            include: {
                course: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        certificate_enabled: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        console.log(`Found ${completedEnrollments.length} completed enrollments`);

        let generated = 0;
        let skipped = 0;

        for (const enrollment of completedEnrollments) {
            // Check if certificate already exists
            const existingCert = await prisma.certificate.findFirst({
                where: {
                    student_id: enrollment.student_id,
                    course_id: enrollment.course_id,
                },
            });

            if (existingCert) {
                console.log(`  ⏭️  Skipped: ${enrollment.user.name} - ${enrollment.course.title} (certificate exists)`);
                skipped++;
                continue;
            }

            if (!enrollment.course.certificate_enabled) {
                console.log(`  ⏭️  Skipped: ${enrollment.user.name} - ${enrollment.course.title} (certificates not enabled)`);
                skipped++;
                continue;
            }

            // Generate certificate
            const timestamp = Date.now();
            const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
            const certificateNumber = `CERT-${new Date().getFullYear()}-${randomSuffix}${timestamp.toString().slice(-4)}`;

            const baseUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
            const qrValidationUrl = `${baseUrl}/courses/${enrollment.course.slug}/validation/${enrollment.student_id}`;

            await prisma.certificate.create({
                data: {
                    student_id: enrollment.student_id,
                    course_id: enrollment.course_id,
                    certificate_number: certificateNumber,
                    qr_validation_url: qrValidationUrl,
                    certificate_url: `/api/certificates/${enrollment.student_id}/${enrollment.course_id}.pdf`,
                    issued_at: enrollment.completed_at || new Date(),
                },
            });

            console.log(`  ✅ Generated: ${enrollment.user.name} - ${enrollment.course.title}`);
            generated++;
        }

        console.log('\n📊 Summary:');
        console.log(`   Generated: ${generated} certificates`);
        console.log(`   Skipped: ${skipped} enrollments`);
        console.log(`   Total: ${completedEnrollments.length} completed enrollments`);

    } catch (error) {
        console.error('Error generating certificates:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

generateMissingCertificates();
