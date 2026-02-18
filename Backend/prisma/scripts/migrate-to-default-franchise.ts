/**
 * Data Migration Script: Assign existing data to a default franchise
 * Run with: npx ts-node prisma/scripts/migrate-to-default-franchise.ts
 *
 * This script:
 * 1. Creates a "Default" franchise with domain "localhost"
 * 2. Assigns all existing users, courses, enrollments, payments, certificates to it
 * 3. Upgrades existing ADMIN users to SUPER_ADMIN
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Starting franchise data migration...\n');

    // 1. Create or find the default franchise
    let defaultFranchise = await prisma.franchise.findFirst({
        where: { domain: 'localhost' },
    });

    if (!defaultFranchise) {
        defaultFranchise = await prisma.franchise.create({
            data: {
                name: 'Default Franchise',
                lms_name: 'AI Shiksha',
                domain: 'localhost',
                primary_color: '#6366f1',
                is_active: true,
                domain_verified: true,
            },
        });
        console.log(`✅ Created default franchise: ${defaultFranchise.id}`);
    } else {
        console.log(`ℹ️  Default franchise already exists: ${defaultFranchise.id}`);
    }

    const franchiseId = defaultFranchise.id;

    // 2. Upgrade existing ADMIN users to SUPER_ADMIN
    const adminUpgradeResult = await prisma.user.updateMany({
        where: { role: 'ADMIN' },
        data: { role: 'SUPER_ADMIN' },
    });
    console.log(`✅ Upgraded ${adminUpgradeResult.count} ADMIN users to SUPER_ADMIN`);

    // 3. Assign all users without franchise_id to default franchise
    const usersResult = await prisma.user.updateMany({
        where: { franchise_id: null },
        data: { franchise_id: franchiseId },
    });
    console.log(`✅ Assigned ${usersResult.count} users to default franchise`);

    // 4. Assign all courses without franchise_id to default franchise
    const coursesResult = await prisma.course.updateMany({
        where: { franchise_id: null },
        data: { franchise_id: franchiseId },
    });
    console.log(`✅ Assigned ${coursesResult.count} courses to default franchise`);

    // 5. Assign all enrollments without franchise_id to default franchise
    const enrollmentsResult = await prisma.enrollment.updateMany({
        where: { franchise_id: null },
        data: { franchise_id: franchiseId },
    });
    console.log(`✅ Assigned ${enrollmentsResult.count} enrollments to default franchise`);

    // 6. Assign all payments without franchise_id to default franchise
    const paymentsResult = await prisma.payment.updateMany({
        where: { franchise_id: null },
        data: { franchise_id: franchiseId },
    });
    console.log(`✅ Assigned ${paymentsResult.count} payments to default franchise`);

    // 7. Assign all certificates without franchise_id to default franchise
    const certificatesResult = await prisma.certificate.updateMany({
        where: { franchise_id: null },
        data: { franchise_id: franchiseId },
    });
    console.log(`✅ Assigned ${certificatesResult.count} certificates to default franchise`);

    console.log('\n🎉 Migration complete!');
    console.log(`   Default Franchise ID: ${franchiseId}`);
    console.log('   All existing data has been assigned to the default franchise.');
    console.log('   Existing ADMIN users have been upgraded to SUPER_ADMIN.');
}

main()
    .catch((e) => {
        console.error('❌ Migration failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
