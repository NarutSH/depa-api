import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';

@Injectable()
export class BypassAuthGuard extends AuthGuard {
  constructor(reflector: Reflector, rolesGuard: RolesGuard) {
    super(reflector, rolesGuard);
  }

  // Override canActivate to always return true, effectively bypassing authentication
  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('BypassAuthGuard: Bypassing authentication checks');
    return true;
  }
}
