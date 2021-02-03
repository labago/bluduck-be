import {
  Controller,
  Body,
  Patch,
  Get,
  UseGuards,
  Request
} from '@nestjs/common';
import { ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './../user/user.service';
import { UserPatchDto } from './dto/user.patch.dto';
import { UnauthorizedException } from '@nestjs/common';

@Controller('api/user')
@ApiTags('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Patch()
  @ApiResponse({ status: 201, description: 'Successfully updated user' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async userPatch(@Request() req, @Body() payload: UserPatchDto): Promise<any> {
    const thisUser = await this.userService.get(req.user.id);
    if (thisUser.email !== payload.email) {
      throw new UnauthorizedException('User only authorized to make changes to his/her/their/shis/xis profile'); 
    }
    return await this.userService.patch(payload);
  }
}
  