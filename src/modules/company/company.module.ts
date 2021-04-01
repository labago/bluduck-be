import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { EmailModule } from 'modules/email/email.module';
import { ProjectModule } from 'modules/project/project.module';
import { TaskModule } from 'modules/task/task.module';
import { CommonModule } from 'modules/common/common.module';

@Module({
  imports: [
    AuthModule,
    forwardRef(() => UserModule),
    EmailModule,
    forwardRef(() => ProjectModule),
    forwardRef(() => TaskModule),
    CommonModule,
    PassportModule,
    TypeOrmModule.forFeature([Company])],
  exports: [CompanyService],
  controllers: [CompanyController],
  providers: [CompanyService]
})
export class CompanyModule {}
