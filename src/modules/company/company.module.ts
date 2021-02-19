import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PassportModule,
    TypeOrmModule.forFeature([Company])],
  exports: [CompanyService],
  controllers: [CompanyController],
  providers: [CompanyService]
})
export class CompanyModule {}
