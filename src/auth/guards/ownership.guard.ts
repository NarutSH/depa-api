import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../roles.enum';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // If no user, deny access
    if (!user) {
      return false;
    }

    // Admin can access everything
    if (user.userType === Role.ADMIN) {
      return true;
    }

    // Get the resource ID from request params
    const resourceId = request.params.id;

    // If no resource ID in params, we can't verify ownership
    // This might be a GET all request or a POST request
    if (!resourceId) {
      return true;
    }

    // For userId based ownership check
    const userId = user.id;

    // Special case for user profile endpoints where the :id is the user ID itself
    if (request.route && request.route.path.includes('/users/:id')) {
      return String(resourceId) === String(userId);
    }

    // For most resources, we'll check the owner/user ID field of the resource
    // This assumes the resource was added to the request by a previous middleware or params validator
    const resource = request.resource;

    // If no resource is provided yet (like in GET requests before the controller method executes)
    // then we should let the controller handle it
    if (!resource) {
      return true;
    }

    // Check if the current user is the owner
    const resourceOwnerId =
      resource.userId ||
      resource.ownerId ||
      resource.user_id ||
      resource.owner_id;

    // If we can't determine ownership, deny access to be safe
    if (!resourceOwnerId) {
      return false;
    }

    // Compare the resource's owner ID with the current user's ID
    return String(resourceOwnerId) === String(userId);
  }
}
