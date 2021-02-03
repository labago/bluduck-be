import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from './../config';
import { AuthModule } from './../auth/auth.module';
import { UserModule } from './../user/user.module';
import { CompanyModule } from './../company/company.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: process.env.APP_ENV || configService.get('DB_TYPE'),
          host: process.env.APP_ENV || configService.get('DB_HOST'),
          port: process.env.APP_ENV || configService.get('DB_PORT'),
          username: process.env.APP_ENV || configService.get('DB_USERNAME'),
          password: process.env.APP_ENV || configService.get('DB_PASSWORD'),
          database: process.env.DB_DATABASE || configService.get('DB_DATABASE'),
          entities: [__dirname + './../**/**.entity{.ts,.js}'],
          synchronize: process.env.APP_ENV || configService.isEnv('dev'),
        } as TypeOrmModuleAsyncOptions;
      },
    }),
    ConfigModule,
    AuthModule,
    UserModule,
    CompanyModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
