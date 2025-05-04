import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  async validate(payload: any) {
    // Check for either sub or memberid in the token
    const userId = payload.sub || payload.memberid;
    const email = payload.email;

    if (!userId && !email) {
      throw new UnauthorizedException('Invalid token payload');
    }

    try {
      // Try to get user by ID first if available
      if (userId) {
        const user = await this.usersService.getUserById(userId);
        return {
          ...user,
          userType: payload.userType, // Make sure userType is included
        };
      }

      // Fall back to email if ID is not available
      if (email) {
        const user = await this.usersService.getUserByEmail(email);
        return {
          ...user,
          userType: payload.userType, // Make sure userType is included
        };
      }
    } catch (error) {
      console.log('Error fetching user:', error);
      // Handle case where user doesn't exist in database yet
      // But token is valid (e.g., first-time user creating profile)
      if (email && payload.userType) {
        return {
          email: email,
          userType: payload.userType,
          // Include other fields from payload as needed
          id: userId || null,
        };
      }

      throw new UnauthorizedException('User not found');
    }
  }
}
