import {
  Controller,
  Body,
  Patch,
  Get,
  UseGuards,
  Request,
  Param,
  Delete
} from '@nestjs/common';
import { ApiResponse, ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './../user/user.service';
import { UserPatchDto } from './dto/user.patch.dto';
import { UnauthorizedException } from '@nestjs/common';
import { UserRolePatchDto } from './dto/userRole.patch.dto';
import { UserRole } from 'modules/common/userRole/userRole.decorator';
import { UserRoleEnum } from './user.entity';

@Controller('api/user')
@ApiTags('user')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@ApiResponse({ status: 400, description: 'Bad Request' })
@ApiResponse({ status: 401, description: 'Unauthorized' })
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Get()
  @ApiOperation({ summary: "Retrieve user info." })
  @ApiResponse({ status: 201, description: 'Successfully retrieved user.' })
  async userGet(@Request() req): Promise<any> {   
    return await this.userService.get(req.user.id);
  }

  @Get('all')
  @ApiOperation({ summary: "**ADMIN ONLY** Retrieve all users." })
  @UserRole(UserRoleEnum.ADMIN)
  @ApiResponse({ status: 201, description: 'Successfully retrieved all users.' })
  async userGetAll(): Promise<any> {   
    return await this.userService.getAllUsers();
  }


  @Patch(':id')
  @ApiOperation({ summary: "Update user info." })
  @ApiResponse({ status: 201, description: 'Successfully updated user.' })
  async userPatch(@Request() req, @Param('id') id: any, @Body() payload: UserPatchDto): Promise<any> {
    if (parseInt(req.user.id) !== parseInt(id)) {
      throw new UnauthorizedException('User only authorized to make changes to his/her/their/shis/xis profile');
    }
    return await this.userService.patch(id, payload);
  }

  @Delete(':id')
  @UserRole(UserRoleEnum.ADMIN)
  @ApiOperation({ summary: "**ADMIN ONLY** Delete user by <id>" })
  @ApiResponse({ status: 201, description: 'Successfully deleted user.' })
  async delete(@Param('id') id: number): Promise<any> {
    return await this.userService.delete(id);
  }


  @Patch(':id/userRole')
  @ApiOperation({ summary: "**ADMIN ONLY** Update user role." })
  @UserRole(UserRoleEnum.ADMIN)
  @ApiResponse({ status: 201, description: 'Successfully updated user role.' })
  async userRole(@Param('id') id: any, @Body() payload: UserRolePatchDto): Promise<any> {
    return await this.userService.patchRole(id, payload);
  }

  @Get('userRoles')
  @ApiOperation({ summary: "Retrieve user roles." })
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserRoles(): Promise<any> {
    return {
      'User': 0,
      'Manager': 1,
      'Admin': 2
    };
  }
}
  