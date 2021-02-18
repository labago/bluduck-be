import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from 'modules/user';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';

@Module({
  imports: [
    forwardRef(() => UserModule)
  ],
  exports: [EmailService],
  controllers: [EmailController],
  providers: [EmailService]
})
export class EmailModule {}
