import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { CompanyModule } from '../company/company.module';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { Task } from './task.entity';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { ProjectModule } from 'modules/project/project.module';
import { EmailModule } from 'modules/email/email.module';
import { CommonModule } from 'modules/common/common.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    forwardRef(() => CompanyModule),
    ProjectModule,
    EmailModule,
    CommonModule,
    PassportModule,
    TypeOrmModule.forFeature([Task])],
  exports: [TaskService],
  controllers: [TaskController],
  providers: [TaskService]
})
export class TaskModule {}
