import { Injectable, ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard extends JwtAuthGuard {
  constructor(
    private reflector: Reflector,
    private rolesGuard: RolesGuard,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // First check JWT auth
    const isJwtValid = await super.canActivate(context);

    if (!isJwtValid) {
      return false;
    }

    // Then check roles
    return this.rolesGuard.canActivate(context);
  }
}
