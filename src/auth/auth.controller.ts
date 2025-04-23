import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService, TechHuntLoginResult } from './auth.service';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiProperty,
} from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

class LoginDto {
  @ApiProperty({ description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User password' })
  @IsString()
  password: string;
}

class TechhuntLoginDto {
  @ApiProperty({ description: 'Username or email address' })
  @IsString()
  username: string;

  @ApiProperty({ description: 'User password' })
  @IsString()
  password: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      //   loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.authService.login(user);
  }

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
}
