import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { auth } from '../auth';
import { fromNodeHeaders } from 'better-auth/node';

@Injectable()
export class AdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Fetch the session directly from better-auth using the request headers
    const sessionData = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

    const user = sessionData?.user;

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
