import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Extract user information from JWT token
 * Usage: @User() user: any
 */
export const User = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // If data is specified, return just that property from user
    return data ? user?.[data] : user;
  },
);
