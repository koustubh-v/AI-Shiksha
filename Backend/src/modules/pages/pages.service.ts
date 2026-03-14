import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PagesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(franchiseId: string) {
    return this.prisma.page.findMany({
      where: { franchise_id: franchiseId },
      orderBy: { created_at: 'desc' },
    });
  }

  async findBySlug(franchiseId: string, slug: string) {
    const page = await this.prisma.page.findUnique({
      where: {
        slug_franchise_id: { slug, franchise_id: franchiseId },
      },
    });
    if (!page) throw new NotFoundException(`Page '${slug}' not found`);
    return page;
  }

  async upsertPage(franchiseId: string, data: { slug: string; title: string; content: string; is_published: boolean }) {
    return this.prisma.page.upsert({
      where: {
        slug_franchise_id: { slug: data.slug, franchise_id: franchiseId },
      },
      update: {
        title: data.title,
        content: data.content,
        is_published: data.is_published,
      },
      create: {
        franchise_id: franchiseId,
        slug: data.slug,
        title: data.title,
        content: data.content,
        is_published: data.is_published,
      },
    });
  }

  async deletePage(franchiseId: string, slug: string) {
    return this.prisma.page.delete({
      where: {
        slug_franchise_id: { slug, franchise_id: franchiseId },
      },
    });
  }
}
