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
import {
  AuthService,
  TechHuntLoginResult,
  RefreshTokenResponse,
  AdminAuthResult,
} from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from './decorators/user.decorator';
import { Public } from './decorators/public.decorator';
import { AdminGuard } from './guards/admin.guard';

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

class RefreshTokenDto {
  @ApiProperty({ description: 'The refresh token' })
  @IsString()
  refreshToken: string;
}

class AdminSignupDto {
  @ApiProperty({
    description: 'Admin username',
    example: 'admin123',
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Admin email address',
    example: 'admin@depa.com',
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: 'Admin password',
    example: 'SecureAdminPass123!',
  })
  @IsString()
  password: string;
}

class AdminSigninDto {
  @ApiProperty({
    description: 'Admin username or email address',
    example: 'admin123',
  })
  @IsString()
  usernameOrEmail: string;

  @ApiProperty({
    description: 'Admin password',
    example: 'SecureAdminPass123!',
  })
  @IsString()
  password: string;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('techhunt-login')
  @ApiOperation({ summary: 'Login through TechHunt API' })
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
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
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

  @Post('logout')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Log out and revoke refresh token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(200)
  async logout(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<{ success: boolean }> {
    // Try to revoke admin refresh token first
    let success = await this.authService.revokeAdminRefreshToken(
      refreshTokenDto.refreshToken,
    );

    // If not admin token, try regular user token
    if (!success) {
      success = await this.authService.revokeRefreshToken(
        refreshTokenDto.refreshToken,
      );
    }

    return { success };
  }

  @Post('logout-all')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Log out from all devices by revoking all refresh tokens',
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

  @Public()
  @Post('admin/signup')
  @ApiOperation({ summary: 'Register a new admin account' })
  @ApiBody({ type: AdminSignupDto })
  @ApiResponse({
    status: 201,
    description: 'Admin account created successfully',
  })
  @ApiResponse({ status: 409, description: 'Admin already exists' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @HttpCode(201)
  async adminSignup(
    @Body() signupDto: AdminSignupDto,
  ): Promise<AdminAuthResult> {
    try {
      return await this.authService.adminSignup(
        signupDto.username,
        signupDto.email,
        signupDto.password,
      );
    } catch (error) {
      throw error; // Re-throw to let NestJS handle the appropriate HTTP status
    }
  }

  @Public()
  @Post('admin/signin')
  @ApiOperation({ summary: 'Sign in as admin' })
  @ApiBody({ type: AdminSigninDto })
  @ApiResponse({ status: 200, description: 'Admin signed in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @HttpCode(200)
  async adminSignin(
    @Body() signinDto: AdminSigninDto,
  ): Promise<AdminAuthResult> {
    try {
      return await this.authService.adminSignin(
        signinDto.usernameOrEmail,
        signinDto.password,
      );
    } catch (error) {
      throw error; // Re-throw to let NestJS handle the appropriate HTTP status
    }
  }

  @Get('admin/profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Get admin profile (admin only)' })
  @ApiResponse({ status: 200, description: 'Admin profile retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  async getAdminProfile(@User() admin: any): Promise<any> {
    return {
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        userType: admin.userType,
        role: admin.role,
        isAdmin: admin.isAdmin,
      },
    };
  }
}
