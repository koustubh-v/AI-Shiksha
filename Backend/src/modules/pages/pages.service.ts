import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PagesService {
  constructor(private readonly prisma: PrismaService) {}

  private async resolveSystemFranchiseId(): Promise<string | null> {
    const sys = await this.prisma.franchise.findFirst({
      where: { domain: 'localhost' },
      select: { id: true },
    });
    return sys?.id || null;
  }

  async findAll(franchiseId: string | null) {
    const resolvedId = franchiseId || (await this.resolveSystemFranchiseId());
    if (!resolvedId) return [];
    return this.prisma.page.findMany({
      where: { franchise_id: resolvedId },
      orderBy: { created_at: 'desc' },
    });
  }

  async findBySlug(franchiseId: string | null, slug: string) {
    const resolvedId = franchiseId || (await this.resolveSystemFranchiseId());
    if (!resolvedId) throw new NotFoundException(`Page '${slug}' not found`);
    const page = await this.prisma.page.findUnique({
      where: {
        slug_franchise_id: { slug, franchise_id: resolvedId },
      },
    });
    if (!page) throw new NotFoundException(`Page '${slug}' not found`);
    return page;
  }

  async upsertPage(franchiseId: string | null, data: { slug: string; title: string; content: string; is_published: boolean }) {
    const resolvedId = franchiseId || (await this.resolveSystemFranchiseId());
    if (!resolvedId) throw new NotFoundException('System franchise not initialized. Save Platform Settings first.');
    return this.prisma.page.upsert({
      where: {
        slug_franchise_id: { slug: data.slug, franchise_id: resolvedId },
      },
      update: {
        title: data.title,
        content: data.content,
        is_published: data.is_published,
      },
      create: {
        franchise_id: resolvedId,
        slug: data.slug,
        title: data.title,
        content: data.content,
        is_published: data.is_published,
      },
    });
  }

  async deletePage(franchiseId: string | null, slug: string) {
    const resolvedId = franchiseId || (await this.resolveSystemFranchiseId());
    if (!resolvedId) throw new NotFoundException('Page not found');
    return this.prisma.page.delete({
      where: {
        slug_franchise_id: { slug, franchise_id: resolvedId },
      },
    });
  }
}

