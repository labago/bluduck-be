import { forwardRef, Global, Module } from '@nestjs/common';
import { ConfigModule } from 'modules/config/config.module';
import { UserModule } from 'modules/user/user.module';
import { GlobalErrorHandler } from './middleware/globalErrorHandler.middleware';
import { UserVerifiedMiddleware } from './middleware/userVerified.middleware';
import { UserRoleGuard } from './userRole/userRole.guard';

@Global()
@Module({
  imports: [
    forwardRef(() => UserModule),
    ConfigModule
  ],
  providers: [GlobalErrorHandler, UserVerifiedMiddleware, UserRoleGuard],
})
export class CommonModule {}
