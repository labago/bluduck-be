import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, NextFunction } from 'express';

@Injectable()
export class UserVerifiedMiddleware implements NestMiddleware {
  use(req: Request, next: NextFunction) {
    console.log('Request...');
    next();
  }
}
