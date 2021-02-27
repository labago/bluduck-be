import { Module, UseInterceptors } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from './../config';
import { AuthModule } from './../auth/auth.module';
import { UserModule } from './../user/user.module';
import { CompanyModule } from './../company/company.module';
import { ProjectModule } from './../project/project.module';
import { EmailModule } from 'modules/email/email.module';
import { TaskModule } from 'modules/task';
import { CommonModule } from 'modules/common';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: process.env.DB_TYPE || configService.get('DB_TYPE'),
          host: process.env.DB_HOST || configService.get('DB_HOST'),
          port: process.env.DB_PORT || configService.get('DB_PORT'),
          username: process.env.DB_USERNAME || configService.get('DB_USERNAME'),
          password: process.env.DB_PASSWORD || configService.get('DB_PASSWORD'),
          database: process.env.DB_DATABASE || configService.get('DB_DATABASE'),
          entities: [__dirname + './../**/**.entity{.ts,.js}'],
          synchronize: configService.isEnv('dev'),
        } as TypeOrmModuleAsyncOptions;
      },
    }),
    ConfigModule,
    AuthModule,
    UserModule,
    CompanyModule,
    ProjectModule,
    EmailModule,
    TaskModule,
    CommonModule
  ],
  providers: [AppService],
})
export class AppModule {}
