import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { ConfigModule } from './../config/config.module';
import { AuthModule } from './../auth/auth.module';
import { UserModule } from './../user/user.module';
import { CompanyModule } from './../company/company.module';
import { ProjectModule } from './../project/project.module';
import { EmailModule } from 'modules/email/email.module';
import { TaskModule } from 'modules/task/task.module';
import { CommonModule } from 'modules/common/common.module';
import { UserVerifiedMiddleware } from 'modules/common/middleware/userVerified.middleware';
import { CompanyController } from 'modules/company/company.controller';
import { ProjectController } from 'modules/project/project.controller';
import { TaskController } from 'modules/task/task.controller';
import { ConfigService } from 'modules/config/config.service';

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
    CommonModule,
    CompanyModule,
    ProjectModule,
    UserModule,
    TaskModule,
    EmailModule
  ],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserVerifiedMiddleware)
      .forRoutes(CompanyController, 
                  ProjectController,
                  TaskController);
  }
}
