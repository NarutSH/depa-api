import {
  Body,
  Controller,
  Post,
  Get,
  UnauthorizedException,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsEmail, IsStrongPassword, MinLength } from 'class-validator';
import {
  AuthService,
  TechHuntLoginResult,
  RefreshTokenResponse,
  AdminAuthResult,
} from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { User } from './decorators/user.decorator';
import { Public } from './decorators/public.decorator';

class TechhuntLoginDto {
  @ApiProperty({
    description: 'Username or email address',
    example: 'mathuros@playpark.com',
  })
  @IsString()
  username: string;

  @ApiProperty({ description: 'User password', example: 'TH@digital' })
  @IsString()
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty({ description: 'Refresh token', example: 'abc123...' })
  @IsString()
  refreshToken: string;
}

export class AdminSignupDto {
  @ApiProperty({
    description: 'Admin email address',
    example: 'admin@depa.go.th',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Admin username',
    example: 'admin_user',
  })
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({
    description: 'Admin password',
    example: 'SecurePassword123!',
  })
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;
}

export class AdminSigninDto {
  @ApiProperty({
    description: 'Admin email or username',
    example: 'admin@depa.go.th',
  })
  @IsString()
  @MinLength(3)
  emailOrUsername: string;

  @ApiProperty({
    description: 'Admin password',
    example: 'SecurePassword123!',
  })
  @IsString()
  @MinLength(1)
  password: string;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('techhunt-login')
  @ApiOperation({
    summary: 'Login through TechHunt API',
    operationId: 'techHuntLogin',
  })
  @ApiBody({ type: TechhuntLoginDto })
  @ApiResponse({ status: 200, description: 'TechHunt login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async techhuntLogin(
    @Body() loginDto: TechhuntLoginDto,
  ): Promise<TechHuntLoginResult> {
    try {
      const result = await this.authService.techhuntLogin(
        loginDto.username,
        loginDto.password,
      );
      return result;
    } catch (error) {
      throw new UnauthorizedException(error.message || 'TechHunt login failed');
    }
  }

  @Public()
  @Post('admin/signup')
  @ApiOperation({
    summary: 'Admin signup',
    operationId: 'adminSignup',
  })
  @ApiBody({ type: AdminSignupDto })
  @ApiResponse({
    status: 201,
    description: 'Admin successfully registered',
    schema: {
      type: 'object',
      properties: {
        admin: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            username: { type: 'string' },
            email: { type: 'string' },
          },
        },
        access_token: { type: 'string' },
        refresh_token: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 409, description: 'Email or username already exists' })
  async adminSignup(
    @Body() adminSignupDto: AdminSignupDto,
  ): Promise<AdminAuthResult> {
    return this.authService.adminSignup(
      adminSignupDto.email,
      adminSignupDto.username,
      adminSignupDto.password,
    );
  }

  @Public()
  @Post('admin/signin')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Admin signin',
    operationId: 'adminSignin',
  })
  @ApiBody({ type: AdminSigninDto })
  @ApiResponse({
    status: 200,
    description: 'Admin successfully logged in',
    schema: {
      type: 'object',
      properties: {
        admin: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            username: { type: 'string' },
            email: { type: 'string' },
          },
        },
        access_token: { type: 'string' },
        refresh_token: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async adminSignin(
    @Body() adminSigninDto: AdminSigninDto,
  ): Promise<AdminAuthResult> {
    return this.authService.adminSignin(
      adminSigninDto.emailOrUsername,
      adminSigninDto.password,
    );
  }

  @Public()
  @Post('refresh')
  @ApiOperation({
    summary: 'Refresh access token using refresh token',
    operationId: 'refreshToken',
  })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  @HttpCode(200)
  async refreshTokens(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<RefreshTokenResponse> {
    try {
      return await this.authService.refreshTokens(refreshTokenDto.refreshToken);
    } catch (error) {
      throw new UnauthorizedException(
        error.message || 'Failed to refresh token',
      );
    }
  }

  @Get('admin/me')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current admin profile',
    operationId: 'getAdminProfile',
  })
  @ApiResponse({
    status: 200,
    description: 'Admin profile retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        username: { type: 'string' },
        email: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAdminProfile(@User() user: any) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  @Post('logout')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Log out and revoke refresh token',
    operationId: 'logout',
  })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(200)
  async logout(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<{ success: boolean }> {
    // Revoke the provided refresh token
    const success = await this.authService.revokeRefreshToken(
      refreshTokenDto.refreshToken,
    );

    return { success };
  }

  @Post('admin/logout')
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'Admin log out and revoke refresh token',
    operationId: 'adminLogout',
  })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ status: 200, description: 'Admin logged out successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(200)
  async adminLogout(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<{ success: boolean }> {
    // Revoke the provided admin refresh token
    const success = await this.authService.revokeAdminRefreshToken(
      refreshTokenDto.refreshToken,
    );

    return { success };
  }

  @Post('logout-all')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Log out from all devices by revoking all refresh tokens',
    operationId: 'logoutAll',
  })
  @ApiResponse({
    status: 200,
    description: 'All sessions logged out successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(200)
  async logoutAll(@User() user: any): Promise<{ success: boolean }> {
    if (!user?.id) {
      throw new UnauthorizedException('Invalid user session');
    }

    // Revoke all refresh tokens for this user
    const success = await this.authService.revokeAllUserRefreshTokens(user.id);

    return { success };
  }

  @Post('admin/logout-all')
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @ApiOperation({
    summary:
      'Admin log out from all devices by revoking all admin refresh tokens',
    operationId: 'adminLogoutAll',
  })
  @ApiResponse({
    status: 200,
    description: 'All admin sessions logged out successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(200)
  async adminLogoutAll(@User() user: any): Promise<{ success: boolean }> {
    // Revoke all refresh tokens for this admin
    const success = await this.authService.revokeAllAdminRefreshTokens(user.id);

    return { success };
  }
}
