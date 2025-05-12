import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ResourceOwnershipMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const resourceId = req.params.id;

    // If there's no resource ID in params, continue
    if (!resourceId) {
      return next();
    }

    // Determine the resource type based on the request path
    const path = req.path;
    let resource = null;

    try {
      // Extract table name from path - matches '/resource-name/:id'
      const match = path.match(/\/([^\/]+)\/[^\/]+$/);

      if (match && match[1]) {
        const resourceType = match[1];

        // Map URL path to Prisma model name
        const modelMapping = {
          users: 'user',
          companies: 'company',
          freelances: 'freelance',
          portfolios: 'portfolio',
          'company-revenues': 'companyRevenue',
          'revenue-streams': 'revenueStream',
          // Add other resource mappings as needed
        };

        const model = modelMapping[resourceType];

        // Check if the model exists on the prisma instance
        if (model && this.prisma[model]) {
          // Convert ID to number if it's numeric
          const idValue = isNaN(Number(resourceId))
            ? resourceId
            : Number(resourceId);

          // Use the proper Prisma client query pattern for finding resources
          // This correctly accesses the model delegates that exist in your Prisma client
          switch (model) {
            case 'user':
              resource = await this.prisma.user.findFirst({
                where: { id: String(idValue) },
              });
              break;
            case 'company':
              resource = await this.prisma.company.findFirst({
                where: { id: String(idValue) },
              });
              break;
            case 'freelance':
              resource = await this.prisma.freelance.findFirst({
                where: { id: String(idValue) },
              });
              break;
            case 'portfolio':
              resource = await this.prisma.portfolio.findFirst({
                where: { id: String(idValue) },
              });
              break;
            case 'companyRevenue':
              resource = await this.prisma.companyRevenue.findFirst({
                where: { id: String(idValue) },
              });
              break;
            case 'revenueStream':
              resource = await this.prisma.revenueStream.findFirst({
                where: { id: String(idValue) },
              });
              break;
            // Add cases for other models as needed
            default:
              console.log(`No mapping for model: ${model}`);
              break;
          }
        }
      }
    } catch (error) {
      console.error('Error in ResourceOwnershipMiddleware:', error);
    }

    // Attach the resource to the request for the guard to use
    if (resource) {
      req['resource'] = resource;
    }

    next();
  }
}
