import { Global, Module } from '@nestjs/common';
import { AuthModule } from 'modules/auth';
import { ConfigModule } from 'modules/config';
import { UserModule } from 'modules/user';
import { GlobalErrorHandler } from './middleware/globalErrorHandler.middleware';
import { UserVerifiedMiddleware } from './middleware/userVerified.middleware';

@Global()
@Module({
  imports: [
    UserModule,
    ConfigModule
  ],
  providers: [GlobalErrorHandler, UserVerifiedMiddleware],
})
export class CommonModule {}
