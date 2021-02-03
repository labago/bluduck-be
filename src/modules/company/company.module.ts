import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { AuthModule } from '../auth/auth.module';
import { User, UserModule, UserService } from 'modules/user';

@Module({
  imports: [
    AuthModule,
    UserModule,
    TypeOrmModule.forFeature([Company, User])],
  exports: [CompanyService],
  controllers: [CompanyController],
  providers: [CompanyService, UserService]
})
export class CompanyModule {}
