import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { CompanyModule } from '../company';
import { UserModule } from '../user';
import { PassportModule } from '@nestjs/passport';
import { Task } from './task.entity';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { ProjectModule } from 'modules/project';
import { EmailModule } from 'modules/email';

@Module({
  imports: [
    AuthModule,
    UserModule,
    CompanyModule,
    ProjectModule,
    UserModule,
    EmailModule,
    PassportModule,
    TypeOrmModule.forFeature([Task])],
  exports: [TaskService],
  controllers: [TaskController],
  providers: [TaskService]
})
export class TaskModule {}
