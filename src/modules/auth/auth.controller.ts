import {
  Controller,
  Body,
  Post,
  UseGuards,
  Get,
  Request,
  Param,
  Query,
  HostParam,
} from '@nestjs/common';
import { ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService} from './auth.service';
import { UserService } from './../user/user.service';
import { ChangePasswordPayload } from './dto/changePassword.payload';
import { UserDto } from 'modules/user/dto/user.dto';
import { ForgotPasswordPayload } from './dto/forgotPassword.payload';
import { ForgotPasswordChangePayload } from './dto/forgotPasswordChange.payload';
import { LoginPayload } from './dto/login.payload';
import { RegisterPayload } from './dto/register.payload';

@Controller('api/auth')
@ApiTags('authentication')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Post('login')
  @ApiResponse({ status: 201, description: 'Successful Login' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() payload: LoginPayload): Promise<any> {
    const user = await this.authService.login(payload);
    return await this.authService.createToken(user);
  }

  @Post('register')
  @ApiResponse({ status: 201, description: 'Successful Registration' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async register(@Body() payload: RegisterPayload): Promise<any> {
    const user = await this.userService.create(payload);
    return await this.authService.createToken(user);
  }

  @Get('verify')
  @ApiResponse({ status: 201, description: 'Successfully Verified User' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async verify(@Query('token') token: string, @Query('email') email: string): Promise<any> {
    return await this.authService.validateUser(token, email);
  }

  @Post('forgotPassword')
  @ApiResponse({ status: 201, description: 'Successfully changed password' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async forgotPassword(@Body() payload: ForgotPasswordPayload ): Promise<any> {
    return await this.authService.forgotPassword(payload);
  }

  @Post('forgotPassword/verify')
  @ApiResponse({ status: 201, description: 'Successfully changed password' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async forgotPasswordVerify(@Body() payload: ForgotPasswordChangePayload): Promise<any> {
    return await this.authService.forgotPasswordVerify(payload);
  }

  @Post('changePassword')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiResponse({ status: 201, description: 'Successfully changed password' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async changePassword(@Request() req: any, @Body() payload: ChangePasswordPayload ): Promise<any> {
    const { id } = req.user;
    return await this.authService.changePassword(id, payload);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get('me')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getLoggedInUser(@Request() req: any): Promise<any> {
    const user = req.user as UserDto;
    return await this.userService.get(user.id);
  }
}
