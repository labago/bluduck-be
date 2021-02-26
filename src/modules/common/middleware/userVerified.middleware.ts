import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, NextFunction } from 'express';

@Injectable()
export class UserVerifiedMiddleware implements NestMiddleware {
  async use(req: Request, next: NextFunction) {
    const { isVerified } = req.user ;
    if (!isVerified) {
      throw new UnauthorizedException('User must verify ')
    }
    next();
  }
}
