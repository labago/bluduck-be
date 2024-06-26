import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { EmailModule } from 'modules/email/email.module';
import { CommonModule } from 'modules/common/common.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => EmailModule),
    forwardRef(() => CommonModule),
    PassportModule,
    TypeOrmModule.forFeature([User])],
  exports: [UserService],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
