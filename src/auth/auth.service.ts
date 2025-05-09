import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { UsersService } from '../users/users.service';

// Define interface for TechHunt login response and export it
export interface TechHuntLoginResponse {
  responsecode: number;
  message: string;
  sessiontoken?: string;
  memberid?: string;
  phone_number?: string;
  email?: string;
  ResultList?: any[];
  data?: any[];
}

// Define interface for our backend's structured response
export interface TechHuntLoginResult {
  techhuntResponse: TechHuntLoginResponse;
  user: any | null;
  access_token: string | null;
}

@Injectable()
export class AuthService {
  // Third-party API configuration
  private API_URL = 'https://depa.techunt-uat.witsawa.com';
  private API_KEY =
    'b156c22a196bc731aa9dde9990f347aebf4d088f0d178d9b35bbddd158135ad0';

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

  /**
   * Handle login through TechHunt API
   * @param username - Username or email
   * @param password - User password
   * @returns TechHunt login response with user data
   */
  async techhuntLogin(
    username: string,
    password: string,
  ): Promise<TechHuntLoginResult> {
    try {
      // API call headers
      const headers = {
        'api-key': this.API_KEY,
        'Content-Type': 'application/json',
      };

      // Make request to third-party API
      const response = await axios.post(
        `${this.API_URL}/techhuntloginuser`,
        { username, password },
        { headers },
      );

      // Process response data
      let loginData: TechHuntLoginResponse;

      // Handle successful login
      if (
        response?.data?.responsecode === 200 &&
        response?.data?.data?.length
      ) {
        loginData = response.data.data[0];
      } else {
        // Return the response for other cases
        loginData = response.data;
      }

      // Get or create user in our system based on third-party response
      let user;

      try {
        // Try to get existing user
        user = await this.usersService.getUserByEmail(
          loginData.email || username,
        );
      } catch (error) {
        console.log('Error fetching user:', error);
        // User doesn't exist yet - we could create a new user here if needed
      }

      // Create a simplified JWT payload from TechHunt data with only memberid, email and userType
      const jwtPayload = {
        id: user?.id || null,
        email: loginData.email || username,
        sessiontoken: loginData.sessiontoken || null,
        memberid: loginData.memberid || null,
      };

      // Generate access token using TechHunt data
      const access_token = this.jwtService.sign(jwtPayload);

      // Always include the access token in the loginData response
      // loginData.access_token = access_token;

      // Return formatted response with session data
      return {
        techhuntResponse: loginData,
        user: user || null,
        access_token: access_token,
      };
    } catch (error) {
      console.error('TechHunt login error:', error);
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Login failed. Please check your credentials.',
      );
    }
  }
}
