import { Injectable, ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Reflector } from '@nestjs/core';

@Injectable()
export class BypassJwtAuthGuard extends JwtAuthGuard {
  constructor(reflector: Reflector = new Reflector()) {
    super(reflector);
  }

  // Override canActivate to always return true, effectively bypassing JWT authentication
  canActivate(context: ExecutionContext) {
    console.log('BypassJwtAuthGuard: Bypassing JWT authentication checks');

    // Add a mock user to the request to avoid downstream errors
    const request = context.switchToHttp().getRequest();
    request.user = {
      id: 'temp-bypass-user-id',
      email: 'bypass@example.com',
      userId: 'temp-bypass-user-id',
      userType: 'admin',
    };

    return true;
  }

  handleRequest(err, user, info) {
    // Always return a mock user to avoid errors downstream
    return (
      user || {
        id: 'temp-bypass-user-id',
        email: 'bypass@example.com',
        userId: 'temp-bypass-user-id',
        userType: 'admin',
      }
    );
  }
}
