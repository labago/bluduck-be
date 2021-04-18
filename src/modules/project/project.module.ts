import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { AuthModule } from '../auth/auth.module';
import { CompanyModule } from '../company/company.module';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from 'modules/config/config.module';
import { CommonModule } from 'modules/common/common.module';
import { TaskModule } from 'modules/task/task.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => CompanyModule),
    forwardRef(() => UserModule),
    forwardRef(() => CommonModule),
    forwardRef(() => TaskModule),
    PassportModule,
    ConfigModule,
    TypeOrmModule.forFeature([Project])
  ],
  exports: [ProjectService],
  controllers: [ProjectController],
  providers: [ProjectService]
})
export class ProjectModule {}
