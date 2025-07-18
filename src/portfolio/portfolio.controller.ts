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
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { PortfolioImageType } from 'generated/prisma';
import { Public } from 'src/auth/decorators/public.decorator';
import { UploadService } from 'src/upload/upload.service';
import { QueryMetadataDto } from 'src/utils';
import { CreateCommentDto } from './dto/create-comment.dto';
import {
  CreatePortfolioDto,
  CreatePortfolioWithImagesAndStandardsDto,
} from './dto/create-portfolio.dto';
import { FavoritePortfolioDto } from './dto/favorite-portfolio.dto';
import { FavoriteStatusResponse } from './dto/portfolio-response.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { PortfolioService } from './portfolio.service';
import {
  CreateCommentResponse,
  DeleteCommentResponse,
  GetAllCommentsResponse,
  UpdateCommentResponse,
} from './types/comment.types';

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
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all portfolios',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            allOf: [
              { $ref: '#/components/schemas/Portfolio' },
              {
                type: 'object',
                properties: {
                  standards: { type: 'array' },
                  Image: { type: 'array' },
                  company: { type: 'object' },
                  freelance: { type: 'object' },
                },
              },
            ],
          },
        },
        message: { type: 'string' },
      },
    },
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
  async getAllPortfolios(@Query() query: QueryMetadataDto): Promise<any> {
    return this.portfolioService.getAllPortfolios(query);
  }

  // Public endpoints accessible by anyone
  @Get()
  @Public()
  @ApiOperation({
    summary:
      'Get all portfolios with pagination, filtering, sorting, and search capabilities',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved portfolios',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            allOf: [
              { $ref: '#/components/schemas/Portfolio' },
              {
                type: 'object',
                properties: {
                  standards: { type: 'array' },
                  Image: { type: 'array' },
                  company: { type: 'object' },
                  freelance: { type: 'object' },
                },
              },
            ],
          },
        },
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            page: { type: 'number' },
            limit: { type: 'number' },
            totalPages: { type: 'number' },
            hasNext: { type: 'boolean' },
            hasPrevious: { type: 'boolean' },
          },
        },
        message: { type: 'string' },
      },
    },
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
  async getPortfolios(@Query() query: QueryMetadataDto): Promise<any> {
    return this.portfolioService.getPortfolios(query);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get portfolio by ID' })
  @ApiParam({ name: 'id', description: 'Portfolio ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved portfolio',
    schema: {
      allOf: [
        { $ref: '#/components/schemas/Portfolio' },
        {
          type: 'object',
          properties: {
            standards: { type: 'array' },
            Image: { type: 'array' },
            company: { type: 'object' },
            freelance: { type: 'object' },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Portfolio not found',
  })
  async getPortfolio(@Param('id') id: string): Promise<any> {
    return this.portfolioService.getPortfolioById(id);
  }

  @Get('company/:companyJuristicId')
  @Public()
  @ApiOperation({ summary: 'Get portfolios by company juristic ID' })
  @ApiParam({ name: 'companyJuristicId', description: 'Company juristic ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved portfolios',
    schema: {
      type: 'array',
      items: {
        allOf: [
          { $ref: '#/components/schemas/Portfolio' },
          {
            type: 'object',
            properties: {
              standards: { type: 'array' },
              Image: { type: 'array' },
              company: { type: 'object' },
            },
          },
        ],
      },
    },
  })
  async getPortfolioByCompanyJuristicId(
    @Param('companyJuristicId') companyJuristicId: string,
  ): Promise<any[]> {
    return this.portfolioService.getPortfolioByCompanyJuristicId(
      companyJuristicId,
    );
  }

  @Get('freelance/:freelanceId')
  @Public()
  @ApiOperation({ summary: 'Get portfolios by freelance ID' })
  @ApiParam({ name: 'freelanceId', description: 'Freelance ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved portfolios',
    schema: {
      type: 'array',
      items: {
        allOf: [
          { $ref: '#/components/schemas/Portfolio' },
          {
            type: 'object',
            properties: {
              standards: { type: 'array' },
              Image: { type: 'array' },
              company: { type: 'object' },
            },
          },
        ],
      },
    },
  })
  async getPortfolioByFreelanceId(
    @Param('freelanceId') freelanceId: string,
  ): Promise<any[]> {
    return this.portfolioService.getPortfolioByFreelanceId(freelanceId);
  }

  @Get('industry/:industrySlug')
  @Public()
  @ApiOperation({ summary: 'Get portfolios by industry slug' })
  @ApiParam({ name: 'industrySlug', description: 'Industry slug' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved portfolios',
    schema: {
      type: 'array',
      items: {
        allOf: [
          { $ref: '#/components/schemas/Portfolio' },
          {
            type: 'object',
            properties: {
              standards: { type: 'array' },
              Image: { type: 'array' },
              company: { type: 'object' },
            },
          },
        ],
      },
    },
  })
  async getPortfolioByIndustry(
    @Param('industrySlug') industrySlug: string,
  ): Promise<any[]> {
    return this.portfolioService.getPortfolioByIndustry(industrySlug);
  }

  // Protected endpoint with role-based access
  @Post()
  // @UseGuards(AuthGuard)
  // @Roles(Role.ADMIN, Role.COMPANY, Role.FREELANCE)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'images', maxCount: 6 },
      { name: 'cover', maxCount: 1 },
      { name: 'main_image', maxCount: 1 },
    ]),
  )
  @ApiOperation({ summary: 'Create a new portfolio' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        freelanceId: { type: 'string' },
        companyId: { type: 'string' },
        companyJuristicId: { type: 'string' },
        tags: { type: 'array', items: { type: 'string' } },
        looking_for: { type: 'array', items: { type: 'string' } },
        link: { type: 'string' },
        industryTypeSlug: { type: 'string' },
        standards: { type: 'array', items: { type: 'string' } },
        images: { type: 'array', items: { type: 'string', format: 'binary' } },
        cover: { type: 'array', items: { type: 'string', format: 'binary' } },
        main_image: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Portfolio created successfully',
    schema: {
      allOf: [
        { $ref: '#/components/schemas/Portfolio' },
        {
          type: 'object',
          properties: {
            standards: { type: 'array' },
            Image: { type: 'array' },
            company: { type: 'object' },
          },
        },
      ],
    },
  })
  async createPortfolio(
    @Body() data: CreatePortfolioWithImagesAndStandardsDto,
    @UploadedFiles()
    files: {
      images: Express.Multer.File[];
      cover: Express.Multer.File[];
      main_image: Express.Multer.File[];
    },
  ): Promise<any> {
    // const user = req.user as any;

    // console.log('createPortfolio user', user);

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

  @Post('favorite')
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Toggle favorite status for a portfolio' })
  @ApiBody({ type: FavoritePortfolioDto })
  @ApiResponse({
    status: 200,
    description: 'Favorite status toggled successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        isFavorite: { type: 'boolean' },
      },
    },
  })
  async toggleFavorite(
    @Body() favoriteDto: FavoritePortfolioDto,
    @Req() req: Request,
  ): Promise<any> {
    const user = req.user as any;
    return this.portfolioService.toggleFavorite(
      favoriteDto.portfolioId,
      user.userId,
      favoriteDto.action,
    );
  }

  @Get('favorite/:portfolioId')
  @Public()
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get favorite status for a portfolio' })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio ID' })
  @ApiResponse({
    status: 200,
    description: 'Favorite status retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        isFavorite: { type: 'boolean' },
        favoriteCount: { type: 'number' },
      },
    },
  })
  async getFavoriteStatus(
    @Param('portfolioId') portfolioId: string,
    @Req() req: Request,
  ): Promise<FavoriteStatusResponse> {
    const user = req.user as any;
    return this.portfolioService.getFavoriteStatus(portfolioId, user.userId);
  }

  @Get('favorites/user')
  @Public()
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user favorite portfolios' })
  @ApiResponse({
    status: 200,
    description: 'User favorite portfolios retrieved successfully',
    schema: {
      type: 'array',
      items: {
        allOf: [
          { $ref: '#/components/schemas/Portfolio' },
          {
            type: 'object',
            properties: {
              standards: { type: 'array' },
              Image: { type: 'array' },
              company: { type: 'object' },
            },
          },
        ],
      },
    },
  })
  async getUserFavorites(@Req() req: Request): Promise<any[]> {
    const user = req.user as any;
    return this.portfolioService.getUserFavorites(user.userId);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.ADMIN, Role.COMPANY, Role.FREELANCE)
  @ApiOperation({ summary: 'Delete a portfolio' })
  @ApiParam({ name: 'id', description: 'Portfolio ID' })
  @ApiResponse({
    status: 200,
    description: 'Portfolio deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  async deletePortfolio(
    @Param('id') id: string,
    //  @Req() req: Request
  ): Promise<any> {
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

  @ApiOperation({ summary: 'Get comments for a portfolio' })
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

  @ApiOperation({ summary: 'Create a new comment on a portfolio' })
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
    const user = req.user as any;
    return this.portfolioService.createComment(user.id, commentDto);
  }

  @ApiOperation({ summary: 'Update an existing comment' })
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
    const user = req.user as any;
    return this.portfolioService.updateComment(commentId, user.id, content);
  }

  @ApiOperation({ summary: 'Delete a comment' })
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
    const user = req.user as any;
    return this.portfolioService.deleteComment(
      commentId,
      user.id,
      user.userType,
    );
  }

  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'images', maxCount: 6 },
      { name: 'cover', maxCount: 1 },
      { name: 'main_image', maxCount: 1 },
    ]),
  )
  @ApiOperation({ summary: 'Update a portfolio' })
  @ApiParam({ name: 'id', description: 'Portfolio ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        tags: { type: 'array', items: { type: 'string' } },
        looking_for: { type: 'array', items: { type: 'string' } },
        link: { type: 'string' },
        standards: { type: 'array', items: { type: 'string' } },
        images: { type: 'array', items: { type: 'string', format: 'binary' } },
        cover: { type: 'array', items: { type: 'string', format: 'binary' } },
        main_image: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Portfolio updated successfully',
    schema: {
      allOf: [
        { $ref: '#/components/schemas/Portfolio' },
        {
          type: 'object',
          properties: {
            standards: { type: 'array' },
            Image: { type: 'array' },
            company: { type: 'object' },
          },
        },
      ],
    },
  })
  async updatePortfolio(
    @Param('id') id: string,
    @Body() data: UpdatePortfolioDto,
    @UploadedFiles()
    files: {
      images: Express.Multer.File[];
      cover: Express.Multer.File[];
      main_image: Express.Multer.File[];
    },
    @Req() req: Request,
  ): Promise<any> {
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
        resImages.map((img) => img.fullPath),
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
        resCover.map((img) => img.fullPath),
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
        resMainImage.map((img) => img.fullPath),
        PortfolioImageType.main,
      );
    }

    return updatedPortfolio;
  }

  @Get('random')
  @Public()
  @ApiOperation({ summary: 'Get random portfolios' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of random portfolios to return (default 10)',
  })
  async getPortfolioRandom(@Query('limit') limit?: number) {
    console.log('getPortfolioRandom limit', limit);
    return this.portfolioService.getPortfolioRandom(limit ?? 10);
  }
}
