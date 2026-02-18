/**
 * Script to check all enrollments and certificates to debug dashboard and template issues.
 * Run with: npx tsx prisma/scripts/debug-data.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugData() {
    try {
        console.log('--- DEBUGGING DATA ---');

        // 1. Check Courses and Templates
        const courses = await prisma.course.findMany({
            include: {
                certificate_template: true
            }
        });
        console.log('\n1. COURSES:');
        courses.forEach(c => {
            console.log(`- ${c.title} (ID: ${c.id})`);
            console.log(`  Certificate Enabled: ${c.certificate_enabled}`);
            console.log(`  Template: ${c.certificate_template?.name || 'NONE'} (ID: ${c.certificate_template_id})`);
        });

        // 2. Check Enrollments
        const enrollments = await prisma.enrollment.findMany({
            include: {
                user: true,
                course: true
            }
        });
        console.log('\n2. ENROLLMENTS:');
        enrollments.forEach(e => {
            console.log(`- User: ${e.user.name} | Course: ${e.course.title}`);
            console.log(`  Progress: ${e.progress_percentage}%`);
            console.log(`  Status: ${e.status}`); // Assuming there's a status field, or checking mapping
            console.log(`  Completed At: ${e.completed_at}`);
        });

        // 3. Check Certificates
        const certificates = await prisma.certificate.findMany({
            include: {
                user: true,
                course: true
            }
        });
        console.log('\n3. CERTIFICATES:');
        certificates.forEach(c => {
            console.log(`- Owner: ${c.user.name} | Course: ${c.course.title}`);
            console.log(`  Cert Number: ${c.certificate_number}`);
        });

    } catch (error) {
        console.error('Error debugging data:', error);
    } finally {
        await prisma.$disconnect();
    }
}

debugData();
