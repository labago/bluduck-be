import {
  Controller,
  Body,
  Patch,
  Get,
  UseGuards,
  Request,
  Param
} from '@nestjs/common';
import { ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './../user/user.service';
import { UserPatchDto } from './dto/user.patch.dto';
import { UnauthorizedException } from '@nestjs/common';

@Controller('api/user')
@ApiTags('user')
@ApiBearerAuth()
@UseGuards(AuthGuard())
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Get()
  @ApiResponse({ status: 201, description: 'Successfully retrieved user.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async userGet(@Request() req): Promise<any> {   
    return await this.userService.get(req.user.id);
  }


  @Patch(':id')
  @ApiResponse({ status: 201, description: 'Successfully updated user.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async userPatch(@Request() req, @Param('id') id: any, @Body() payload: UserPatchDto): Promise<any> {
    if (parseInt(req.user.id) !== parseInt(id)) {
      throw new UnauthorizedException('User only authorized to make changes to his/her/their/shis/xis profile');
    }
    return await this.userService.patch(id, payload);
  }
}
  