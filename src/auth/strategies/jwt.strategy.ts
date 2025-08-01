import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { JwtPayload } from '../auth.service';
import { CurrentUser } from '../interfaces/current-user.interface';
import { PrismaService } from '../../prisma/prisma.service';

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

  async validate(payload: JwtPayload): Promise<CurrentUser> {
    if (!payload.id) {
      // If there's no user ID in the token, we can't verify the user
      return payload as CurrentUser;
    }

    // Check if this is an admin user
    if (payload.isAdmin) {
      // Validate admin exists
      const admin = await this.prismaService.userAdmin.findUnique({
        where: { id: payload.id },
      });
      if (!admin) {
        throw new UnauthorizedException('Admin user no longer exists');
      }
      // Return only identity info for req.user
      return {
        id: admin.id,
        email: admin.email,
        userType: 'admin',
        role: 'admin',
        isAdmin: true,
        sessiontoken: payload.sessiontoken,
        memberid: payload.memberid,
      };
    }

    // For regular users, just return JWT payload (identity only)
    return {
      id: payload.id,
      email: payload.email,
      userType: payload.userType,
      role: payload.role,
      sessiontoken: payload.sessiontoken,
      memberid: payload.memberid,
      isAdmin: payload.isAdmin,
    };
  }
}
