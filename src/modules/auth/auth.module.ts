import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from './../config/config.module';
import { UserModule } from './../user/user.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { EmailModule } from 'modules/email/email.module';
import { ConfigService } from 'modules/config/config.service';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => EmailModule),
    ConfigModule,    
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: process.env.JWT_SECRET_KEY || configService.get('JWT_SECRET_KEY'),
          signOptions: {
            ...(process.env.JWT_EXPIRATION_TIME || configService.get('JWT_EXPIRATION_TIME')
              ? {
                  expiresIn: Number(process.env.JWT_EXPIRATION_TIME || configService.get('JWT_EXPIRATION_TIME')),
                }
              : {}),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule.register({ defaultStrategy: 'jwt' })]
})
export class AuthModule {}
