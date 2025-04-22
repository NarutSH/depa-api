import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../roles.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // No roles required, access granted
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // For admin, grant access to everything
    if (user.userType === Role.ADMIN) {
      return true;
    }

    // Check if user has the required role
    const hasRole = requiredRoles.some((role) => role === user.userType);

    if (!hasRole) {
      throw new ForbiddenException(
        `User with role ${user.userType} does not have permission to access this resource`,
      );
    }

    return true;
  }
}
