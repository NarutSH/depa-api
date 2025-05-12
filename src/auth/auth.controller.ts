import {
  Body,
  Controller,
  Post,
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
} from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
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

class RefreshTokenDto {
  @ApiProperty({ description: 'The refresh token' })
  @IsString()
  refreshToken: string;
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
    // Revoke the provided refresh token
    const success = await this.authService.revokeRefreshToken(
      refreshTokenDto.refreshToken,
    );

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
}
