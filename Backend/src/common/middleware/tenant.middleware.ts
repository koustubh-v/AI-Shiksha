import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * TenantMiddleware
 *
 * Reads req.hostname, looks up the matching franchise by domain,
 * and injects franchise_id into the request object.
 *
 * SUPER_ADMIN users bypass franchise restriction (handled in services).
 * If no franchise is found for the domain, franchise_id is set to null
 * (SUPER_ADMIN can still operate; others will be scoped to their JWT franchise_id).
 */
@Injectable()
export class TenantMiddleware implements NestMiddleware {
    constructor(private prisma: PrismaService) { }

    async use(req: Request, res: Response, next: NextFunction) {
        const hostname = req.hostname || (req.headers['host'] as string) || 'localhost';
        // Strip port number for local dev (e.g. "localhost:3000" → "localhost")
        const domain = hostname.split(':')[0];

        try {
            const franchise = await this.prisma.franchise.findFirst({
                where: {
                    OR: [{ domain }, { domain: hostname }],
                    is_active: true,
                },
                select: { id: true, name: true, lms_name: true, logo_url: true, primary_color: true },
            });

            if (franchise) {
                (req as any).tenantId = franchise.id;
                (req as any).tenantBranding = franchise;
            } else {
                (req as any).tenantId = null;
                (req as any).tenantBranding = null;
            }
        } catch {
            // If DB lookup fails, continue without tenant context
            (req as any).tenantId = null;
            (req as any).tenantBranding = null;
        }

        next();
    }
}
