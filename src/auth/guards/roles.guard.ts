import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../roles.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      this.logger.debug('No roles required for this route, access granted');
      return true; // No roles required, access granted
    }

    const request = context.switchToHttp().getRequest();
    const { user } = request;

    this.logger.debug(`RolesGuard checking user: ${JSON.stringify(user)}`);
    this.logger.debug(`Required roles: ${JSON.stringify(requiredRoles)}`);

    if (!user) {
      this.logger.error('User not authenticated in RolesGuard');
      throw new ForbiddenException('User not authenticated');
    }

    // For admin, grant access to everything
    if (user.userType === Role.ADMIN) {
      this.logger.debug('Admin user detected, granting access');
      return true;
    }

    // Check if user has the required role
    const hasRole = requiredRoles.some((role) => role === user.userType);

    if (!hasRole) {
      this.logger.warn(
        `Access denied: User role ${user.userType} does not have permission for required roles ${requiredRoles.join(', ')}`,
      );
      throw new ForbiddenException(
        `User with role ${user.userType} does not have permission to access this resource`,
      );
    }

    this.logger.debug(`Access granted for user with role ${user.userType}`);
    return true;
  }
}
