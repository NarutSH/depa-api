import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import {
  CreatePortfolioDto,
  CreatePortfolioWithImagesAndStandardsDto,
} from './dto/create-portfolio.dto';
import { UploadService } from 'src/upload/upload.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { PortfolioImageType } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { Request } from 'express';

@Controller('portfolio')
export class PortfolioController {
  constructor(
    private readonly portfolioService: PortfolioService,
    private readonly uploadService: UploadService,
  ) {}

  // Public endpoints accessible by anyone
  @Get()
  async getPortfolios() {
    return this.portfolioService.getPortfolios();
  }

  @Get(':id')
  async getPortfolio(@Param('id') id: string) {
    return this.portfolioService.getPortfolioById(id);
  }

  @Get('company/:companyJuristicId')
  async getPortfolioByCompanyJuristicId(
    @Param('companyJuristicId') companyJuristicId: string,
  ) {
    return this.portfolioService.getPortfolioByCompanyJuristicId(
      companyJuristicId,
    );
  }

  @Get('freelance/:freelanceId')
  async getPortfolioByFreelanceId(@Param('freelanceId') freelanceId: string) {
    return this.portfolioService.getPortfolioByFreelanceId(freelanceId);
  }

  @Get('industry/:industrySlug')
  async getPortfolioByIndustry(@Param('industrySlug') industrySlug: string) {
    return this.portfolioService.getPortfolioByIndustry(industrySlug);
  }

  // Protected endpoint with role-based access
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.COMPANY, Role.FREELANCE)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'images', maxCount: 6 },
      { name: 'cover', maxCount: 1 },
      { name: 'main_image', maxCount: 1 },
    ]),
  )
  async createPortfolio(
    @Body() data: CreatePortfolioWithImagesAndStandardsDto,
    @UploadedFiles()
    files: {
      images: Express.Multer.File[];
      cover: Express.Multer.File[];
      main_image: Express.Multer.File[];
    },
    @Req() req: Request,
  ) {
    const user = req.user as any;

    // Security check: Ensure user can only create portfolio for themselves
    // Admins can create for anyone
    if (user.userType !== Role.ADMIN) {
      if (
        user.userType === Role.COMPANY &&
        user.company?.juristicId !== data.companyJuristicId
      ) {
        throw new ForbiddenException(
          'You can only create portfolios for your own company',
        );
      }

      if (
        user.userType === Role.FREELANCE &&
        user.freelance?.id !== data.freelanceId
      ) {
        throw new ForbiddenException(
          'You can only create portfolios for yourself',
        );
      }
    }

    const payload: CreatePortfolioDto = {
      title: data.title,
      description: data.description,
      freelanceId: data.freelanceId,
      companyJuristicId: data.companyJuristicId,
      tags: data.tags ?? [],
      looking_for: data.looking_for ?? [],
      link: data.link,
      industryTypeSlug: data.industryTypeSlug,
    };

    const resPort = await this.portfolioService.createPortfolio(payload);

    const arrayStandards = Array.isArray(data.standards)
      ? data.standards
      : [data.standards];

    if (arrayStandards.filter((el) => el).length) {
      await this.portfolioService.addStandardsToPortfolio(
        resPort.id,
        arrayStandards,
      );
    }
    const resImages = await this.uploadService.uploadMultiFile(
      files.images,
      'portfolio',
    );

    const resCover = await this.uploadService.uploadMultiFile(
      files.cover,
      'portfolio',
    );

    const resMainImage = await this.uploadService.uploadMultiFile(
      files.main_image,
      'portfolio',
    );

    const imagePaths = resImages.map((image) => image.fullPath);

    // add gallery images
    await this.portfolioService.addImagesToPortfolio(
      resPort.id,
      imagePaths,
      PortfolioImageType.gallery,
    );

    // add cover image
    await this.portfolioService.addImagesToPortfolio(
      resPort.id,
      resCover.map((image) => image.fullPath),
      PortfolioImageType.cover,
    );

    // add main image
    await this.portfolioService.addImagesToPortfolio(
      resPort.id,
      resMainImage.map((image) => image.fullPath),
      PortfolioImageType.main,
    );

    return resPort;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.COMPANY, Role.FREELANCE)
  async deletePortfolio(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as any;

    // If not admin, verify ownership before delete
    if (user.userType !== Role.ADMIN) {
      const portfolio = await this.portfolioService.getPortfolioById(id);

      // Check if portfolio belongs to the user
      if (
        (user.userType === Role.COMPANY &&
          portfolio.companyJuristicId !== user.company?.juristicId) ||
        (user.userType === Role.FREELANCE &&
          portfolio.freelanceId !== user.freelance?.id)
      ) {
        throw new ForbiddenException('You can only delete your own portfolios');
      }
    }

    return this.portfolioService.deletePortfolio(id);
  }
}
