import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user';
import { PassportModule } from '@nestjs/passport';
import { EmailModule } from 'modules/email';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    UserModule,
    PassportModule,
    EmailModule,
    TypeOrmModule.forFeature([Company])],
  exports: [CompanyService],
  controllers: [CompanyController],
  providers: [CompanyService]
})
export class CompanyModule {}
