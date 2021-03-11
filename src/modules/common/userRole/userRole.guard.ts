import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const userRole = this.reflector.get<string[]>('userRole', context.getHandler());
        if (!userRole) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        return this.matchRoles(userRole, user.userRole);
    }

    private matchRoles(role, userRole): any {

    }
}

