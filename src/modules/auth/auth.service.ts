import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Hash } from '../../utils/Hash';
import { ConfigService } from './../config';
import { User, UserService } from './../user';
import { LoginPayload } from './login.payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async createToken(user: User) {
    return {
      expiresIn: this.configService.get('JWT_EXPIRATION_TIME'),
      accessToken: this.jwtService.sign({ id: user.id }),
      user,
    };
  }

  async validateUser(payload: LoginPayload): Promise<any> {
    const user = await this.userService.getByEmail(payload.email);
    if (!user || !Hash.compare(payload.password, user.password)) {
      throw new UnauthorizedException('Invalid credentials you wannabe hax0rz');
    }
    return user;
  }
}
