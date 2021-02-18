import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { AuthModule } from '../auth/auth.module';
import { CompanyModule } from '../company';
import { UserModule } from '../user';

@Module({
  imports: [
    AuthModule,
    UserModule,
    CompanyModule,
    TypeOrmModule.forFeature([Task])],
  exports: [TaskService],
  controllers: [TaskController],
  providers: [TaskService]
})
export class TaskModule {}
