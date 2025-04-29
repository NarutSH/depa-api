import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RolesGuard } from './guards/roles.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthGuard } from './guards/auth.guard';
import { Reflector } from '@nestjs/core';
import { BypassAuthGuard } from './guards/bypass-auth.guard';
import { BypassJwtAuthGuard } from './guards/bypass-jwt-auth.guard';
import { BypassRolesGuard } from './guards/bypass-roles.guard';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'your-secret-key',
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    RolesGuard,
    AuthGuard,
    Reflector,
    BypassRolesGuard,
    BypassAuthGuard,
    BypassJwtAuthGuard,
    // Override the standard guards with bypass guards for global use
    {
      provide: 'APP_GUARD',
      useClass: BypassRolesGuard,
    },
  ],
  exports: [
    AuthService,
    JwtStrategy,
    RolesGuard,
    AuthGuard,
    BypassRolesGuard,
    BypassAuthGuard,
    BypassJwtAuthGuard,
  ],
})
export class AuthModule {}
