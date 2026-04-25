import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SystemSettingsService {
    constructor(private prisma: PrismaService) { }

    async getTerms(franchiseId?: string | null) {
        const franchiseKey = franchiseId ? `terms_and_conditions__${franchiseId}` : null;
        const globalKey = 'terms_and_conditions';

        // Try franchise-scoped key first, then fall back to global key
        if (franchiseKey) {
            const franchiseSetting = await this.prisma.systemSetting.findUnique({
                where: { key: franchiseKey },
            });
            if (franchiseSetting?.value) {
                return { content: franchiseSetting.value };
            }
        }

        // Fall back to global key
        const globalSetting = await this.prisma.systemSetting.findUnique({
            where: { key: globalKey },
        });
        return { content: globalSetting?.value || '' };
    }

    async updateTerms(content: string, franchiseId?: string | null) {
        const key = franchiseId ? `terms_and_conditions__${franchiseId}` : 'terms_and_conditions';
        return this.prisma.systemSetting.upsert({
            where: { key },
            update: { value: content },
            create: { key, value: content },
        });
    }

    async getFranchiseServerInfo() {
        const keys = ['franchise_server_ip', 'franchise_server_cname', 'franchise_setup_instructions'];
        const settings = await this.prisma.systemSetting.findMany({
            where: { key: { in: keys } },
        });

        // Convert array to object
        const result = settings.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {} as Record<string, string>);

        return {
            ip: result['franchise_server_ip'] || '',
            cname: result['franchise_server_cname'] || '',
            instructions: result['franchise_setup_instructions'] || '',
        };
    }

    async updateFranchiseServerInfo(data: { ip: string; cname: string; instructions: string }) {
        const updates = [
            this.prisma.systemSetting.upsert({
                where: { key: 'franchise_server_ip' },
                update: { value: data.ip },
                create: { key: 'franchise_server_ip', value: data.ip },
            }),
            this.prisma.systemSetting.upsert({
                where: { key: 'franchise_server_cname' },
                update: { value: data.cname },
                create: { key: 'franchise_server_cname', value: data.cname },
            }),
            this.prisma.systemSetting.upsert({
                where: { key: 'franchise_setup_instructions' },
                update: { value: data.instructions },
                create: { key: 'franchise_setup_instructions', value: data.instructions },
            }),
        ];

        await this.prisma.$transaction(updates);
        return { success: true };
    }
}
