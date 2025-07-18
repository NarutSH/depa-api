import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { addDays } from 'date-fns';
import { UserType } from 'generated/prisma';
import * as bcrypt from 'bcrypt';

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
  refresh_token?: string | null;
}

// Define the refresh token response
export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
}

// Define admin signup/signin response
export interface AdminAuthResult {
  admin: {
    id: string;
    username: string;
    email: string;
  };
  access_token: string;
  refresh_token: string;
}

// Define JWT token payload
export interface JwtPayload {
  id: string | null;
  email: string;
  sessiontoken: string | null;
  memberid: string | null;
  userType: string | null;
  role: string | null;
  isAdmin?: boolean; // เพิ่มสำหรับแยก admin
}

@Injectable()
export class AuthService {
  // Third-party API configuration
  private API_URL = 'https://depa.techunt-uat.witsawa.com';
  private API_KEY =
    'b156c22a196bc731aa9dde9990f347aebf4d088f0d178d9b35bbddd158135ad0';

  // Token configuration
  private ACCESS_TOKEN_EXPIRATION = '1d'; // Short-lived
  // private ACCESS_TOKEN_EXPIRATION = '15m'; // Short-lived
  private REFRESH_TOKEN_EXPIRATION_DAYS = 7; // 7 days

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prismaService: PrismaService,
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

      if (response.data.responsecode !== 200) {
        throw new UnauthorizedException(response.data.reason);
      }

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
        // User doesn't exist yet - create a new user with the email
        if (error instanceof NotFoundException) {
          try {
            user = await this.prismaService.user.create({
              data: {
                fullnameTh: '',
                email: loginData.email || username,
                userType: UserType.guest,
                role: UserType.guest,
                // Add any additional default fields needed for a new user
              },
            });
            console.log('Created new user with ID:', user.id);
          } catch (createError) {
            console.error('Failed to create new user:', createError);
          }
        }
      }

      // Create a simplified JWT payload from TechHunt data with only memberid, email and userType
      const jwtPayload = {
        id: user?.id || null,
        email: loginData.email || username,
        sessiontoken: loginData.sessiontoken || null,
        memberid: loginData.memberid || null,
        userType: user?.userType || null,
        role: user?.role || null,
      };

      // Generate access token using TechHunt data
      const access_token = this.jwtService.sign(jwtPayload, {
        expiresIn: this.ACCESS_TOKEN_EXPIRATION,
      });

      // Generate refresh token using memberid instead of user.id
      const refresh_token = null;
      // if (loginData.memberid) {
      //   refresh_token = await this.generateRefreshToken(loginData.memberid);
      // }

      // Return formatted response with session data
      return {
        techhuntResponse: loginData,
        user: user || null,
        access_token: access_token,
        refresh_token: refresh_token,
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

  /**
   * Generate a new refresh token for a user
   * @param memberid - Member ID from TechHunt
   * @returns The refresh token string
   */
  async generateRefreshToken(memberid: string): Promise<string> {
    // Create a random token string (uuidv4 is secure enough for this purpose)
    const tokenString = uuidv4();

    // Calculate expiration date (7 days from now)
    const expiresAt = addDays(new Date(), this.REFRESH_TOKEN_EXPIRATION_DAYS);

    // Try to find user by memberid
    let user = null;
    try {
      user = await this.usersService.getUserByEmail(memberid);
    } catch {
      console.log('User not found for memberid:', memberid);
    }

    if (!user) {
      // We need to create a temporary user because RefreshToken has a foreign key constraint
      // with the User table (every RefreshToken must be linked to a valid User)
      console.log('Creating temporary user for memberid:', memberid);

      try {
        // Create a minimal user record with the required fields
        user = await this.prismaService.user.create({
          data: {
            fullnameTh: `Temporary User ${memberid}`,
            email: memberid, // Use the memberid as email temporarily
            userType: 'guest',
            role: 'guest',
          },
        });
        console.log('Created temporary user with ID:', user.id);
      } catch (error) {
        console.error('Failed to create temporary user:', error);
        throw new Error('Unable to create refresh token: user creation failed');
      }
    }

    console.log('tokenString:', tokenString);
    console.log('expiresAt:', expiresAt);
    console.log('user:', user);

    // At this point, we should have a valid user (either existing or newly created)
    // Save token to database with the user ID
    try {
      const refreshToken = await this.prismaService.refreshToken.create({
        data: {
          token: tokenString,
          userId: user.id,
          expiresAt,
        },
      });

      return refreshToken.token;
    } catch (error) {
      console.error('Failed to create refresh token:', error);
      throw new Error('Unable to create refresh token');
    }
  }

  /**
   * Refresh access token using a valid refresh token
   * @param token - The refresh token
   * @returns New access and refresh tokens
   */
  async refreshTokens(token: string): Promise<RefreshTokenResponse> {
    // Try to find the token in admin refresh tokens first
    const adminRefreshTokenRecord =
      await this.prismaService.adminRefreshToken.findUnique({
        where: { token },
        include: { admin: true },
      });

    if (adminRefreshTokenRecord) {
      const now = new Date();

      // Check if token has expired
      if (adminRefreshTokenRecord.expiresAt < now) {
        throw new UnauthorizedException('Refresh token expired');
      }

      // Check if token has been revoked
      if (adminRefreshTokenRecord.revokedAt) {
        throw new UnauthorizedException('Refresh token has been revoked');
      }

      // This is an admin refresh token
      const jwtPayload: JwtPayload = {
        id: adminRefreshTokenRecord.admin.id,
        email: adminRefreshTokenRecord.admin.email,
        sessiontoken: null,
        memberid: null,
        userType: 'admin',
        role: 'admin',
        isAdmin: true,
      };

      // Generate new access token
      const access_token = this.jwtService.sign(jwtPayload, {
        expiresIn: this.ACCESS_TOKEN_EXPIRATION,
      });

      // Generate new refresh token for admin
      const refresh_token = await this.generateAdminRefreshToken(
        adminRefreshTokenRecord.admin.id,
      );

      // Optionally revoke the old token
      await this.revokeAdminRefreshToken(token);

      return {
        access_token,
        refresh_token,
      };
    }

    // If not admin token, try regular user refresh token
    const refreshTokenRecord = await this.prismaService.refreshToken.findUnique(
      {
        where: { token },
      },
    );

    // Check if token exists and is valid
    if (!refreshTokenRecord) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const now = new Date();

    // Check if token has expired
    if (refreshTokenRecord.expiresAt < now) {
      throw new UnauthorizedException('Refresh token expired');
    }

    // Check if token has been revoked
    if (refreshTokenRecord.revokedAt) {
      throw new UnauthorizedException('Refresh token has been revoked');
    }

    // Find regular user
    const user = await this.prismaService.user.findUnique({
      where: { id: refreshTokenRecord.userId },
    });

    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }

    // Create a new JWT payload for regular user
    const jwtPayload: JwtPayload = {
      id: user.id,
      email: user.email || '',
      sessiontoken: null,
      memberid: null,
      userType: user.userType || null,
      role: user.role || null,
    };

    // Generate new access token
    const access_token = this.jwtService.sign(jwtPayload, {
      expiresIn: this.ACCESS_TOKEN_EXPIRATION,
    });

    // For now, return empty refresh token for regular users (as in original code)
    return {
      access_token,
      refresh_token: '',
    };
  }

  /**
   * Regenerate a refresh token (revoke old one and create a new one)
   * @param oldTokenId - ID of the old token to revoke
   * @returns New refresh token string
   */
  async regenerateRefreshToken(oldTokenId: string): Promise<string> {
    // First get the old token to get the user ID
    const oldToken = await this.prismaService.refreshToken.findUnique({
      where: { id: oldTokenId },
    });

    if (!oldToken) {
      throw new Error('Original token not found');
    }

    // Mark the old token as revoked
    await this.prismaService.refreshToken.update({
      where: { id: oldTokenId },
      data: { revokedAt: new Date() },
    });

    // Generate a new refresh token
    return this.generateRefreshToken(oldToken.userId);
  }

  /**
   * Revoke a refresh token (e.g., on logout)
   * @param token - The refresh token to revoke
   * @returns True if the token was revoked successfully
   */
  async revokeRefreshToken(token: string): Promise<boolean> {
    try {
      await this.prismaService.refreshToken.update({
        where: { token },
        data: { revokedAt: new Date() },
      });
      return true;
    } catch (error) {
      console.error('Error revoking refresh token:', error);
      return false;
    }
  }

  /**
   * Revoke all refresh tokens for a user (e.g., on password change or security breach)
   * @param userId - The user ID
   * @returns True if the tokens were revoked successfully
   */
  async revokeAllUserRefreshTokens(userId: string): Promise<boolean> {
    try {
      await this.prismaService.refreshToken.updateMany({
        where: {
          userId,
          revokedAt: null,
        },
        data: { revokedAt: new Date() },
      });
      return true;
    } catch (error) {
      console.error('Error revoking user refresh tokens:', error);
      return false;
    }
  }

  /**
   * Register a new admin user
   * @param username - Admin username
   * @param email - Admin email
   * @param password - Admin password (will be hashed)
   * @returns Admin data with tokens
   */
  async adminSignup(
    username: string,
    email: string,
    password: string,
  ): Promise<AdminAuthResult> {
    try {
      // Check if admin with same email or username already exists
      const existingAdmin = await this.prismaService.userAdmin.findFirst({
        where: {
          OR: [{ email: email }, { username: username }],
        },
      });

      if (existingAdmin) {
        if (existingAdmin.email === email) {
          throw new ConflictException('Admin with this email already exists');
        }
        if (existingAdmin.username === username) {
          throw new ConflictException(
            'Admin with this username already exists',
          );
        }
      }

      // Hash the password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create new admin
      const newAdmin = await this.prismaService.userAdmin.create({
        data: {
          username,
          email,
          password: hashedPassword,
        },
      });

      // Generate tokens
      const jwtPayload: JwtPayload = {
        id: newAdmin.id,
        email: newAdmin.email,
        sessiontoken: null,
        memberid: null,
        userType: 'admin',
        role: 'admin',
        isAdmin: true,
      };

      const access_token = this.jwtService.sign(jwtPayload, {
        expiresIn: this.ACCESS_TOKEN_EXPIRATION,
      });

      const refresh_token = await this.generateAdminRefreshToken(newAdmin.id);

      return {
        admin: {
          id: newAdmin.id,
          username: newAdmin.username,
          email: newAdmin.email,
        },
        access_token,
        refresh_token,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      console.error('Admin signup error:', error);
      throw new BadRequestException('Failed to create admin account');
    }
  }

  /**
   * Login admin user
   * @param usernameOrEmail - Admin username or email
   * @param password - Admin password
   * @returns Admin data with tokens
   */
  async adminSignin(
    usernameOrEmail: string,
    password: string,
  ): Promise<AdminAuthResult> {
    try {
      // Find admin by username or email
      const admin = await this.prismaService.userAdmin.findFirst({
        where: {
          OR: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
        },
      });

      if (!admin) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Generate tokens
      const jwtPayload: JwtPayload = {
        id: admin.id,
        email: admin.email,
        sessiontoken: null,
        memberid: null,
        userType: 'admin',
        role: 'admin',
        isAdmin: true,
      };

      const access_token = this.jwtService.sign(jwtPayload, {
        expiresIn: this.ACCESS_TOKEN_EXPIRATION,
      });

      const refresh_token = await this.generateAdminRefreshToken(admin.id);

      return {
        admin: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
        },
        access_token,
        refresh_token,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      console.error('Admin signin error:', error);
      throw new UnauthorizedException('Failed to authenticate admin');
    }
  }

  /**
   * Generate a refresh token specifically for admin users
   * @param adminId - Admin user ID
   * @returns The refresh token string
   */
  private async generateAdminRefreshToken(adminId: string): Promise<string> {
    // Create a random token string
    const tokenString = uuidv4();

    // Calculate expiration date (7 days from now)
    const expiresAt = addDays(new Date(), this.REFRESH_TOKEN_EXPIRATION_DAYS);

    // Use AdminRefreshToken table for admin tokens
    await this.prismaService.adminRefreshToken.create({
      data: {
        token: tokenString,
        adminId: adminId,
        expiresAt,
      },
    });

    return tokenString;
  }

  /**
   * Revoke an admin refresh token
   * @param token - The admin refresh token string to revoke
   * @returns True if the token was revoked successfully
   */
  async revokeAdminRefreshToken(token: string): Promise<boolean> {
    try {
      await this.prismaService.adminRefreshToken.update({
        where: { token },
        data: { revokedAt: new Date() },
      });
      return true;
    } catch (error) {
      console.error('Error revoking admin refresh token:', error);
      return false;
    }
  }

  /**
   * Revoke all admin refresh tokens for an admin user
   * @param adminId - The admin ID
   * @returns True if the tokens were revoked successfully
   */
  async revokeAllAdminRefreshTokens(adminId: string): Promise<boolean> {
    try {
      await this.prismaService.adminRefreshToken.updateMany({
        where: {
          adminId,
          revokedAt: null,
        },
        data: { revokedAt: new Date() },
      });
      return true;
    } catch (error) {
      console.error('Error revoking admin refresh tokens:', error);
      return false;
    }
  }
}
