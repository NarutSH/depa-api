import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector = new Reflector()) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Call the parent canActivate method directly
    const canActivate = super.canActivate(context);

    if (canActivate instanceof Promise) {
      return canActivate.then((result) => {
        // Log debugging information
        const request = context.switchToHttp().getRequest();
        console.log('JWT Auth result:', result);
        console.log('JWT Auth user:', request.user);
        return result;
      });
    }

    return canActivate;
  }

  handleRequest(err, user, info) {
    console.log('JWT handleRequest:', { err, userExists: !!user, info });

    if (err || !user) {
      throw err || new UnauthorizedException('Authentication required');
    }

    return user;
  }
}
