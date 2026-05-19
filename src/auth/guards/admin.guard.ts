import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // In better-auth, the session/user is usually attached to the request by the auth package.
    // We get the user object from the request.
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('You must be logged in to access this resource.');
    }

    // Check if the role is 'ADMIN' (matching what you will store in the DB)
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('You do not have the required admin permissions.');
    }

    return true;
  }
}
