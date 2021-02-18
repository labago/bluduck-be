import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user';

@Module({
  imports: [
    AuthModule,
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([Task])],
  exports: [TaskService],
  controllers: [TaskController],
  providers: [TaskService]
})
export class TaskModule {}
