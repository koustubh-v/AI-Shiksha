import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FooterSettingsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Resolves the actual franchise ID for Super Admins.
   * Super Admins have null franchise_id; their settings are stored
   * under the 'localhost' domain franchise record (master settings).
   */
  private async resolveSystemFranchiseId(): Promise<string | null> {
    const systemFranchise = await this.prisma.franchise.findFirst({
      where: { domain: 'localhost' },
      select: { id: true },
    });
    return systemFranchise?.id || null;
  }

  async getSettings(franchiseId: string | null) {
    // For Super Admins (null franchise_id), resolve to the master 'localhost' franchise
    const resolvedId = franchiseId || (await this.resolveSystemFranchiseId());

    if (!resolvedId) {
      // No franchise exists at all yet - return defaults
      return {
        franchise_id: null,
        site_title: null,
        copyright_text: `© ${new Date().getFullYear()} All rights reserved.`,
        show_support_section: true,
        logo_url: null,
        menus: [],
        social_links: [],
      };
    }

    const settings = await this.prisma.footerSetting.findUnique({
      where: { franchise_id: resolvedId },
    });

    if (!settings) {
      return {
        franchise_id: resolvedId,
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

  async updateSettings(franchiseId: string | null, data: any) {
    // For Super Admins (null franchise_id), upsert against the 'localhost' master franchise
    const resolvedId = franchiseId || (await this.resolveSystemFranchiseId());

    if (!resolvedId) {
      throw new Error(
        'System franchise not set up yet. Please save your Platform Settings first to initialize it.',
      );
    }

    return this.prisma.footerSetting.upsert({
      where: { franchise_id: resolvedId },
      update: {
        site_title: data.site_title,
        copyright_text: data.copyright_text,
        show_support_section: data.show_support_section,
        logo_url: data.logo_url,
        menus: data.menus || [],
        social_links: data.social_links || [],
      },
      create: {
        franchise_id: resolvedId,
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
