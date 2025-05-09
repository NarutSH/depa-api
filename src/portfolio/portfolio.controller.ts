import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PortfolioImageType } from '@prisma/client';
import { Request } from 'express';
import { UploadService } from 'src/upload/upload.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import {
  CreatePortfolioDto,
  CreatePortfolioWithImagesAndStandardsDto,
} from './dto/create-portfolio.dto';
import { FavoritePortfolioDto } from './dto/favorite-portfolio.dto';
import { PortfolioService } from './portfolio.service';

@ApiTags('portfolio')
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
  // @UseGuards(AuthGuard)
  // @Roles(Role.ADMIN, Role.COMPANY, Role.FREELANCE)
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

    console.log('createPortfolio user', user);

    // Security check: Ensure user can only create portfolio for themselves
    // Admins can create for anyone
    // if (user.userType !== Role.ADMIN) {
    //   if (
    //     user.userType === Role.COMPANY &&
    //     user.company?.juristicId !== data.companyJuristicId
    //   ) {
    //     throw new ForbiddenException(
    //       'You can only create portfolios for your own company',
    //     );
    //   }

    //   if (
    //     user.userType === Role.FREELANCE &&
    //     user.freelance?.id !== data.freelanceId
    //   ) {
    //     throw new ForbiddenException(
    //       'You can only create portfolios for yourself',
    //     );
    //   }
    // }

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
  async toggleFavorite(
    @Body() favoriteDto: FavoritePortfolioDto,
    @Req() req: Request,
  ) {
    const user = req.user as any;
    return this.portfolioService.toggleFavorite(
      favoriteDto.portfolioId,
      user.userId,
      favoriteDto.action,
    );
  }

  @Get('favorite/:portfolioId')
  // @UseGuards(JwtAuthGuard)
  async getFavoriteStatus(
    @Param('portfolioId') portfolioId: string,
    @Req() req: Request,
  ) {
    const user = req.user as any;
    return this.portfolioService.getFavoriteStatus(portfolioId, user.userId);
  }

  @Get('favorites/user')
  // @UseGuards(JwtAuthGuard)
  async getUserFavorites(@Req() req: Request) {
    const user = req.user as any;
    return this.portfolioService.getUserFavorites(user.userId);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.ADMIN, Role.COMPANY, Role.FREELANCE)
  async deletePortfolio(
    @Param('id') id: string,
    //  @Req() req: Request
  ) {
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
  async getPortfolioComments(@Param('portfolioId') portfolioId: string) {
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
  ) {
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
  ) {
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
  ) {
    const user = req.user as any;
    return this.portfolioService.deleteComment(
      commentId,
      user.id,
      user.userType,
    );
  }
}
