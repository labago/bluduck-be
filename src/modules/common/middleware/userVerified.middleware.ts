import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, NextFunction } from 'express';
import { ConfigService } from 'modules/config';
import { UserService } from 'modules/user';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserVerifiedMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService,
              private readonly configService: ConfigService) {}
  
  async use(req: Request, res: Response, next: NextFunction) {
    const authHeaders = req.headers.authorization;
    if (authHeaders && (authHeaders as string).split(' ')[1]) {
      const token = (authHeaders as string).split(' ')[1];
      const secret = this.configService.get('JWT_SECRET_KEY');
      const decoded: any = jwt.verify(token, secret);
      const user = await this.userService.get(decoded.id);

      if (!user) {
        throw new UnauthorizedException('User not found.');
      }
      
      if(!user.isVerified) {
        throw new UnauthorizedException('User must be verified to perform this action.');
      }

      next();
    } else {
      throw new UnauthorizedException('Not authorized.');
    }
  }
}
