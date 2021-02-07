import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { AuthModule } from '../auth/auth.module';
import { CompanyModule } from '../company';
import { UserModule } from '../user';

@Module({
  imports: [
    AuthModule,
    UserModule,
    CompanyModule,
    TypeOrmModule.forFeature([Project])],
  exports: [ProjectService],
  controllers: [ProjectController],
  providers: [ProjectService]
})
export class ProjectModule {}
