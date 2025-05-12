import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Reflector } from '@nestjs/core';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { OwnershipGuard } from './guards/ownership.guard';
import { RoleAndOwnershipGuard } from './guards/role-ownership.guard';
import { ResourceOwnershipMiddleware } from './middleware/resource-ownership.middleware';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'super-secret-key',
        signOptions: { expiresIn: '15m' }, // Changed from 30m to 15m to match the service
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    Reflector,
    JwtStrategy,
    PrismaService,
    RolesGuard,
    OwnershipGuard,
    RoleAndOwnershipGuard,
    ResourceOwnershipMiddleware,
    JwtAuthGuard,
    {
      provide: 'APP_GUARD',
      useClass: JwtAuthGuard,
    },
  ],
  exports: [
    AuthService,
    JwtAuthGuard,
    RolesGuard,
    OwnershipGuard,
    RoleAndOwnershipGuard,
    ResourceOwnershipMiddleware,
  ],
})
export class AuthModule {}
