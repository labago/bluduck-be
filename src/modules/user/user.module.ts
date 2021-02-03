import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([User])],
  exports: [UserService],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
