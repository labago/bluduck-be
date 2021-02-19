import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from 'modules/config';
import { UserModule } from 'modules/user';
import { EmailController } from './email.controller';
import { Email } from './email.entity';
import { EmailService } from './email.service';

@Module({
  imports: [
    forwardRef(() => UserModule),
    ConfigModule,
    PassportModule,
    TypeOrmModule.forFeature([Email])],
  exports: [EmailService],
  controllers: [EmailController],
  providers: [EmailService]
})
export class EmailModule {}
