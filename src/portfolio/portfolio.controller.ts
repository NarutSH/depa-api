import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import {
  CreatePortfolioDto,
  CreatePortfolioWithImagesAndStandardsDto,
} from './dto/create-portfolio.dto';
import { UploadService } from 'src/upload/upload.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { PortfolioImageType } from '@prisma/client';

@Controller('portfolio')
export class PortfolioController {
  constructor(
    private readonly portfolioService: PortfolioService,
    private readonly uploadService: UploadService,
  ) {}

  @Get()
  async getPortfolios() {
    return this.portfolioService.getPortfolios();
  }

  @Get('company/:companyJuristicId')
  async getPortfolioByCompanyJuristicId(
    @Param('companyJuristicId') companyJuristicId: string,
  ) {
    return this.portfolioService.getPortfolioByCompanyJuristicId(
      companyJuristicId,
    );
  }

  @Post()
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
  ) {
    console.log('files ===>', files);

    const payload: CreatePortfolioDto = {
      title: data.title,
      description: data.description,
      freelanceId: data.freelanceId,
      companyJuristicId: data.companyJuristicId,
      tags: data.tags,
      looking_for: data.looking_for,
      link: data.link,
      industryTypeSlug: data.industryTypeSlug,
    };

    const resPort = await this.portfolioService.createPortfolio(payload);

    const arrayStandards = Array.isArray(data.standards)
      ? data.standards
      : [data.standards];

    await this.portfolioService.addStandardsToPortfolio(
      resPort.id,
      arrayStandards,
    );

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
    // return files;
  }
}
