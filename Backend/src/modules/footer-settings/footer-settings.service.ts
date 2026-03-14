import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FooterSettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSettings(franchiseId: string) {
    const settings = await this.prisma.footerSetting.findUnique({
      where: { franchise_id: franchiseId },
    });

    if (!settings) {
      // Return defaults if none exist
      return {
        franchise_id: franchiseId,
        site_title: null,
        copyright_text: `© ${new Date().getFullYear()} All rights reserved.`,
        show_support_section: true,
        logo_url: null,
        menus: [],
        social_links: [],
      };
    }
    return settings;
  }

  async updateSettings(franchiseId: string, data: any) {
    return this.prisma.footerSetting.upsert({
      where: { franchise_id: franchiseId },
      update: {
        site_title: data.site_title,
        copyright_text: data.copyright_text,
        show_support_section: data.show_support_section,
        logo_url: data.logo_url,
        menus: data.menus || [],
        social_links: data.social_links || [],
      },
      create: {
        franchise_id: franchiseId,
        site_title: data.site_title,
        copyright_text: data.copyright_text,
        show_support_section: data.show_support_section ?? true,
        logo_url: data.logo_url,
        menus: data.menus || [],
        social_links: data.social_links || [],
      },
    });
  }
}
