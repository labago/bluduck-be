import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { AuthModule } from '../auth/auth.module';
import { CompanyModule } from '../company';
import { UserModule } from '../user';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from 'modules/config';

@Module({
  imports: [
    AuthModule,
    UserModule,
    CompanyModule,
    PassportModule,
    ConfigModule,
    TypeOrmModule.forFeature([Project])],
  exports: [ProjectService],
  controllers: [ProjectController],
  providers: [ProjectService]
})
export class ProjectModule {}
