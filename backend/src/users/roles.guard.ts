import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // You can expand this to use decorators like @Roles()
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return user && user.role; // basic check
  }
}
