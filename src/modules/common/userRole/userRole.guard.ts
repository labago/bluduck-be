import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject, forwardRef } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from 'modules/config/config.service';
import { UserRoleEnum } from 'modules/user/user.entity';
import * as jwt from 'jsonwebtoken';
import { UserService } from 'modules/user/user.service';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private reflector: Reflector,
    private readonly configService: ConfigService,
    private readonly userService: UserService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const userRole = this.reflector.get<UserRoleEnum[]>('userRole', context.getHandler());
        if (!userRole) {
            return true;
        }
        const req = context.switchToHttp().getRequest();
        const authHeaders = req.headers.authorization;
        if (authHeaders && (authHeaders as string).split(' ')[1]) {
            const token = (authHeaders as string).split(' ')[1];
            const secret = this.configService.get('JWT_SECRET_KEY');
            const decoded: any = jwt.verify(token, secret);
            const user = await this.userService.get(decoded.id);
            const hasRole = () => !!userRole.some(item => item === user.userRole);
            return user && user.userRole && hasRole();
        } else {
            throw new UnauthorizedException('User must be logged in to perform this action.');
        }
        
    }
}

