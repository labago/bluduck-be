import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'modules/email/email.service';
import { UserService } from 'modules/user/user.service';
import { Hash } from '../../utils/Hash';
import { ConfigService } from './../config/config.service';
import { User } from './../user/user.entity';
import { ChangePasswordPayload } from './dto/changePassword.payload';
import { ForgotPasswordPayload } from './dto/forgotPassword.payload';
import { ForgotPasswordChangePayload } from './dto/forgotPasswordChange.payload';
import { LoginPayload } from './dto/login.payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly emailService: EmailService
  ) {}

  async createToken(user: User) {
    return {
      expiresIn: this.configService.get('JWT_EXPIRATION_TIME'),
      accessToken: this.jwtService.sign({ id: user.id, isVerified: user.isVerified}),
      user,
    };
  }

  async login(payload: LoginPayload): Promise<any> {
    const user = await this.userService.getByEmailForLogin(payload.email);
    if (!user || !Hash.compare(payload.password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async validateUser(token: string, email: string): Promise<any> {
    const emails = await this.emailService.getHashByEmail(email);
    const emailFound = emails.filter(e => e.hash === token)[0];
    if (!emailFound) {
      throw new UnauthorizedException('Hashes do not appear to match');
    }
    await this.emailService.delete(email);
    const result = await this.userService.verifyUser(email);
    if (result.affected === 1) {
      const user = await this.userService.getByEmail(email);
      return await this.createToken(user);
    }
    return { status: 500, message: 'Error while verifying email.'};
  }

  async changePassword(userId: number, payload: ChangePasswordPayload): Promise<any> {
    const user = await this.userService.getByIdForLogin(userId);
    if (!user || !Hash.compare(payload.oldPassword, user.password)) {
      throw new UnauthorizedException('Old password does not match current password.');
    }
    return await this.userService.updatePassword(userId, payload.newPassword);
  }
  async forgotPassword(payload: ForgotPasswordPayload): Promise<any> {
    const user = await this.userService.getByEmail(payload.email);
    return await this.emailService.sendForgotPasswordEmail(payload.email);
  }

  async forgotPasswordVerify(payload: ForgotPasswordChangePayload): Promise<any> {
    const emails = await this.emailService.getHashByEmail(payload.email);
    const user = await this.userService.getByEmail(payload.email);
    const emailFound = emails.filter(e => e.hash === payload.token)[0];
    if (!emailFound) {
      throw new UnauthorizedException('Hashes do not appear to match');
    }
    await this.emailService.delete(payload.email);
    await this.userService.updatePassword(user.id, payload.newPassword);
    return { status: 201, message: 'Successfully updated password.'};
  }
}
