import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
// import { PortfolioImageType } from '@prisma/client';
import { Request } from 'express';
import { CurrentUser } from '../auth/interfaces/current-user.interface';
import { UploadService } from 'src/upload/upload.service';
import { QueryMetadataDto, ResponseMetadata } from 'src/utils';
import { CreateCommentDto } from './dto/create-comment.dto';
import {
  CreatePortfolioDto,
  CreatePortfolioWithImagesAndStandardsDto,
} from './dto/create-portfolio.dto';
import { FavoritePortfolioDto } from './dto/favorite-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { PortfolioService } from './portfolio.service';
import { PortfolioImageType } from 'generated/prisma';
import { Public } from 'src/auth/decorators/public.decorator';
import { PortfolioByIndustryResponseDto } from './dto/portfolio-response.dto';
import {
  GetAllCommentsResponse,
  CreateCommentResponse,
  UpdateCommentResponse,
  DeleteCommentResponse,
} from './types/comment.types';
// import { PortfolioImageType } from 'src/generated/prisma';

@ApiTags('Portfolio')
@ApiBearerAuth()
@Controller('portfolio')
export class PortfolioController {
  constructor(
    private readonly portfolioService: PortfolioService,
    private readonly uploadService: UploadService,
  ) {}

  @Get('all')
  @Public()
  @ApiOperation({
    summary: 'Get all portfolios without pagination',
    operationId: 'getAllPortfolios',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all portfolios',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term for title and description',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    description: 'Sort field and direction (e.g., title:asc, createdAt:desc)',
  })
  @ApiQuery({
    name: 'filter',
    required: false,
    type: Object,
    description: 'Filter criteria (e.g., industryTypeSlug)',
  })
  async getAllPortfolios(
    @Query() query: QueryMetadataDto,
  ): Promise<PortfolioByIndustryResponseDto[]> {
    return this.portfolioService.getAllPortfolios(query);
  }

  // Public endpoints accessible by anyone
  @Get()
  @Public()
  @ApiOperation({
    summary:
      'Get all portfolios with pagination, filtering, sorting, and search capabilities',
    operationId: 'getPortfolios',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved portfolios',
    type: ResponseMetadata,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (1-based)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term for title and description',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    description: 'Sort field and direction (e.g., title:asc, createdAt:desc)',
  })
  @ApiQuery({
    name: 'filter',
    required: false,
    type: Object,
    description: 'Filter criteria (e.g., industryTypeSlug)',
  })
  async getPortfolios(
    @Query() query: QueryMetadataDto,
  ): Promise<ResponseMetadata<PortfolioByIndustryResponseDto[]>> {
    return this.portfolioService.getPortfolios(query);
  }

  @Get(':id')
  @Public()
  @ApiOperation({
    summary: 'Get portfolio by ID',
    operationId: 'getPortfolioById',
  })
  @ApiParam({ name: 'id', description: 'Portfolio ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved portfolio',
  })
  @ApiResponse({
    status: 404,
    description: 'Portfolio not found',
  })
  async getPortfolio(
    @Param('id') id: string,
  ): Promise<PortfolioByIndustryResponseDto | null> {
    return this.portfolioService.getPortfolioById(id);
  }

  @Get('company/:companyJuristicId')
  @Public()
  @ApiOperation({
    summary: 'Get portfolios by company juristic ID',
    operationId: 'getPortfoliosByCompanyJuristicId',
  })
  @ApiParam({ name: 'companyJuristicId', description: 'Company juristic ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved portfolios for company',
  })
  async getPortfolioByCompanyJuristicId(
    @Param('companyJuristicId') companyJuristicId: string,
  ): Promise<PortfolioByIndustryResponseDto[]> {
    return this.portfolioService.getPortfolioByCompanyJuristicId(
      companyJuristicId,
    );
  }

  @Get('freelance/:freelanceId')
  @Public()
  @ApiOperation({
    summary: 'Get portfolios by freelance ID',
    operationId: 'getPortfoliosByFreelanceId',
  })
  @ApiParam({ name: 'freelanceId', description: 'Freelance ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved portfolios for freelancer',
  })
  async getPortfolioByFreelanceId(
    @Param('freelanceId') freelanceId: string,
  ): Promise<PortfolioByIndustryResponseDto[]> {
    return this.portfolioService.getPortfolioByFreelanceId(freelanceId);
  }

  @Get('industry/:industrySlug')
  @Public()
  @ApiOperation({
    summary: 'Get portfolios by industry',
    operationId: 'getPortfoliosByIndustry',
  })
  @ApiParam({ name: 'industrySlug', description: 'Industry slug' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved portfolios for industry',
    type: PortfolioByIndustryResponseDto,
    isArray: true,
  })
  async getPortfolioByIndustry(
    @Param('industrySlug') industrySlug: string,
  ): Promise<PortfolioByIndustryResponseDto[]> {
    return this.portfolioService.getPortfolioByIndustry(industrySlug);
  }

  // Protected endpoint with role-based access
  @Post()
  // @UseGuards(AuthGuard)
  // @Roles(Role.ADMIN, Role.COMPANY, Role.FREELANCE)
  @ApiOperation({
    summary: 'Create a new portfolio with images and standards',
    operationId: 'createPortfolio',
  })
  @ApiBody({ type: CreatePortfolioWithImagesAndStandardsDto })
  @ApiResponse({
    status: 201,
    description: 'Portfolio created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
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
  ): Promise<PortfolioByIndustryResponseDto> {
    const user = req.user as CurrentUser;

    console.log('createPortfolio user', user);

    const payload: CreatePortfolioDto = {
      title: data.title,
      description: data.description,
      freelanceId: data.freelanceId,
      companyId: data.companyId,
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

    const imagePaths = resImages.data.map((image) => image.fullPath);

    // add gallery images
    await this.portfolioService.addImagesToPortfolio(
      resPort.id,
      imagePaths,
      PortfolioImageType.gallery,
    );

    // add cover image
    await this.portfolioService.addImagesToPortfolio(
      resPort.id,
      resCover.data.map((image) => image.fullPath),
      PortfolioImageType.cover,
    );

    // add main image
    await this.portfolioService.addImagesToPortfolio(
      resPort.id,
      resMainImage.data.map((image) => image.fullPath),
      PortfolioImageType.main,
    );

    return resPort;
  }

  @Post('favorite')
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Toggle favorite status for a portfolio',
    operationId: 'togglePortfolioFavorite',
  })
  @ApiBody({ type: FavoritePortfolioDto })
  @ApiResponse({
    status: 200,
    description: 'Favorite status toggled successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async toggleFavorite(
    @Body() favoriteDto: FavoritePortfolioDto,
    @Req() req: Request,
  ): Promise<{ message: string }> {
    const user = req.user as CurrentUser;
    return this.portfolioService.toggleFavorite(
      favoriteDto.portfolioId,
      user.id,
      favoriteDto.action,
    );
  }

  @Get('favorite/:portfolioId')
  @Public()
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get favorite status for a portfolio',
    operationId: 'getPortfolioFavoriteStatus',
  })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved favorite status',
  })
  async getFavoriteStatus(
    @Param('portfolioId') portfolioId: string,
    @Req() req: Request,
  ): Promise<{ isFavorite: boolean }> {
    const user = req.user as CurrentUser;
    return this.portfolioService.getFavoriteStatus(portfolioId, user.id);
  }

  @Get('favorites/user')
  @Public()
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get user favorite portfolios',
    operationId: 'getUserFavoritePortfolios',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved user favorite portfolios',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getUserFavorites(
    @Req() req: Request,
  ): Promise<PortfolioByIndustryResponseDto[]> {
    const user = req.user as CurrentUser;
    return this.portfolioService.getUserFavorites(user.id);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.ADMIN, Role.COMPANY, Role.FREELANCE)
  @ApiOperation({
    summary: 'Delete a portfolio',
    operationId: 'deletePortfolio',
  })
  @ApiParam({ name: 'id', description: 'Portfolio ID' })
  @ApiResponse({
    status: 200,
    description: 'Portfolio deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - not allowed to delete this portfolio',
  })
  @ApiResponse({
    status: 404,
    description: 'Portfolio not found',
  })
  async deletePortfolio(
    @Param('id') id: string,
    //  @Req() req: Request
  ): Promise<{ message: string }> {
    // const user = req.user as any;

    // // If not admin, verify ownership before delete
    // if (user.userType !== Role.ADMIN) {
    //   const portfolio = await this.portfolioService.getPortfolioById(id);

    //   // Check if portfolio belongs to the user
    //   if (
    //     (user.userType === Role.COMPANY &&
    //       portfolio.companyJuristicId !== user.company?.juristicId) ||
    //     (user.userType === Role.FREELANCE &&
    //       portfolio.freelanceId !== user.freelance?.id)
    //   ) {
    //     throw new ForbiddenException('You can only delete your own portfolios');
    //   }
    // }

    return this.portfolioService.deletePortfolio(id);
  }

  // Comment related endpoints

  @ApiOperation({
    summary: 'Get comments for a portfolio',
    operationId: 'getPortfolioComments',
  })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of comments for the portfolio',
  })
  @ApiResponse({ status: 404, description: 'Portfolio not found' })
  @Get(':portfolioId/comments')
  @Public()
  async getPortfolioComments(
    @Param('portfolioId') portfolioId: string,
  ): Promise<GetAllCommentsResponse> {
    return this.portfolioService.getPortfolioComments(portfolioId);
  }

  @ApiOperation({
    summary: 'Create a new comment on a portfolio',
    operationId: 'createPortfolioComment',
  })
  @ApiBody({ type: CreateCommentDto })
  @ApiResponse({ status: 201, description: 'Comment created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - must be logged in' })
  @Post('comments')
  // @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createComment(
    @Body() commentDto: CreateCommentDto,
    @Req() req: Request,
  ): Promise<CreateCommentResponse> {
    const user = req.user as CurrentUser;
    return this.portfolioService.createComment(user.id, commentDto);
  }

  @ApiOperation({
    summary: 'Update an existing comment',
    operationId: 'updatePortfolioComment',
  })
  @ApiParam({ name: 'commentId', description: 'Comment ID' })
  @ApiBody({
    schema: { type: 'object', properties: { content: { type: 'string' } } },
  })
  @ApiResponse({ status: 200, description: 'Comment updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your comment' })
  @Patch('comments/:commentId')
  // @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateComment(
    @Param('commentId') commentId: string,
    @Body('content') content: string,
    @Req() req: Request,
  ): Promise<UpdateCommentResponse> {
    const user = req.user as CurrentUser;
    return this.portfolioService.updateComment(commentId, user.id, content);
  }

  @ApiOperation({
    summary: 'Delete a comment',
    operationId: 'deletePortfolioComment',
  })
  @ApiParam({ name: 'commentId', description: 'Comment ID' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - not allowed to delete this comment',
  })
  @Delete('comments/:commentId')
  // @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteComment(
    @Param('commentId') commentId: string,
    @Req() req: Request,
  ): Promise<DeleteCommentResponse> {
    const user = req.user as CurrentUser;
    return this.portfolioService.deleteComment(
      commentId,
      user.id,
      user.userType,
    );
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a portfolio with images and standards',
    operationId: 'updatePortfolio',
  })
  @ApiParam({ name: 'id', description: 'Portfolio ID' })
  @ApiBody({ type: UpdatePortfolioDto })
  @ApiResponse({
    status: 200,
    description: 'Portfolio updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Portfolio not found',
  })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'images', maxCount: 6 },
      { name: 'cover', maxCount: 1 },
      { name: 'main_image', maxCount: 1 },
    ]),
  )
  async updatePortfolio(
    @Param('id') id: string,
    @Body() data: UpdatePortfolioDto,
    @UploadedFiles()
    files: {
      images: Express.Multer.File[];
      cover: Express.Multer.File[];
      main_image: Express.Multer.File[];
    },
  ): Promise<PortfolioByIndustryResponseDto> {
    // Prepare payload for update
    const payload = {
      ...data,
      tags: data.tags ?? [],
      looking_for: data.looking_for ?? [],
    };
    // Update main portfolio fields
    const updatedPortfolio = await this.portfolioService.updatePortfolio(
      id,
      payload,
    );

    // Update standards if provided
    if (data.standards) {
      await this.portfolioService.addStandardsToPortfolio(id, data.standards);
    }

    // Handle images if provided
    if (files.images?.length) {
      const resImages = await this.uploadService.uploadMultiFile(
        files.images,
        'portfolio',
      );
      await this.portfolioService.replaceImagesForPortfolio(
        id,
        resImages.data.map((img) => img.fullPath),
        PortfolioImageType.gallery,
      );
    }
    if (files.cover?.length) {
      const resCover = await this.uploadService.uploadMultiFile(
        files.cover,
        'portfolio',
      );
      await this.portfolioService.replaceImagesForPortfolio(
        id,
        resCover.data.map((img) => img.fullPath),
        PortfolioImageType.cover,
      );
    }
    if (files.main_image?.length) {
      const resMainImage = await this.uploadService.uploadMultiFile(
        files.main_image,
        'portfolio',
      );
      await this.portfolioService.replaceImagesForPortfolio(
        id,
        resMainImage.data.map((img) => img.fullPath),
        PortfolioImageType.main,
      );
    }

    return updatedPortfolio;
  }

  @Get('random')
  @Public()
  @ApiOperation({
    summary: 'Get random portfolios',
    operationId: 'getRandomPortfolios',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of random portfolios to return (default 10)',
  })
  async getPortfolioRandom(
    @Query('limit') limit?: number,
  ): Promise<PortfolioByIndustryResponseDto[]> {
    console.log('getPortfolioRandom limit', limit);
    return this.portfolioService.getPortfolioRandom(limit ?? 10);
  }
}
