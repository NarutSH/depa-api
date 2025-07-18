import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtPayload } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'super-secret-key', // Use environment variable in production
    });
  }

  async validate(payload: JwtPayload): Promise<any> {
    if (!payload.id) {
      // If there's no user ID in the token, we can't verify the user
      // But we may still want to allow the request with limited permissions
      return payload;
    }

    // Check if this is an admin token
    if (payload.isAdmin) {
      const admin = await this.prismaService.userAdmin.findUnique({
        where: { id: payload.id },
      });

      if (!admin) {
        throw new UnauthorizedException('Admin no longer exists');
      }

      // Return admin data with special flag
      return {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        userType: 'admin',
        role: 'admin',
        isAdmin: true,
      };
    }

    // Try to find the regular user by ID
    const user = await this.usersService.getUserById(payload.id);
    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }

    // Return the user with the payload information for route handlers
    return {
      ...user,
      sessiontoken: payload.sessiontoken,
      memberid: payload.memberid,
    };
  }
}
