import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { OwnershipGuard } from './ownership.guard';
import { Role } from '../roles.enum';

@Injectable()
export class RoleAndOwnershipGuard implements CanActivate {
  private rolesGuard: RolesGuard;
  private ownershipGuard: OwnershipGuard;

  constructor(private reflector: Reflector) {
    this.rolesGuard = new RolesGuard(reflector);
    this.ownershipGuard = new OwnershipGuard(reflector);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // If no user, deny access
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Admin can access everything
    if (user.userType === Role.ADMIN) {
      return true;
    }

    // Check if user has the required role
    const hasRole = this.rolesGuard.canActivate(context);

    if (!hasRole) {
      throw new ForbiddenException(`User doesn't have required role`);
    }

    // For list operations (GET without ID) and creates (POST), we only check role
    const isGetAllOrPost =
      (request.method === 'GET' && !request.params.id) ||
      request.method === 'POST';

    if (isGetAllOrPost) {
      return true;
    }

    // For operations on specific resources, check ownership
    const isOwner = this.ownershipGuard.canActivate(context);

    if (!isOwner) {
      throw new ForbiddenException('User is not the owner of this resource');
    }

    return true;
  }
}
