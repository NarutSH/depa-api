import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    // password: string
  ): Promise<any> {
    // Find user by email

    const user = await this.usersService.getUserByEmail(email);

    if (!user) {
      return null;
    }

    // In a real app, you would compare hashed passwords here
    // Example with bcrypt (would require bcrypt to be installed):
    // const isPasswordValid = await bcrypt.compare(password, user.password);

    // For now, we're just validating if the user exists
    return user;
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      userType: user.userType,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        userType: user.userType,
      },
    };
  }
}
