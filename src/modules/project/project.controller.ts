import {
  Controller,
  Body,
  Patch,
  Post,
  Get,
  Delete,
  UseGuards,
  Request,
  Param
} from '@nestjs/common';
import { ApiResponse, ApiTags, ApiBearerAuth, ApiOperation, ApiCreatedResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ProjectService } from './project.service';
import { ProjectCreateDto } from './dto/project.create.dto';
import { ProjectPatchDto } from './dto/project.patch.dto';
import { UserRoleGuard } from 'modules/common/userRole/userRole.guard';
import { UserRole } from 'modules/common';
import { UserRoleEnum } from 'modules/user/user.entity';

@Controller('api/project')
@ApiTags('project')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@UseGuards(UserRoleGuard)
@ApiResponse({ status: 400, description: 'Bad Request' })
@ApiResponse({ status: 401, description: 'Unauthorized' })
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService
  ) {}

  @Get('company/:id')
  @ApiOperation({ summary: "Retrieve all projects under company <id>." })
  @ApiResponse({ status: 201, description: 'Successfully retrieved projects.' })
  async get(@Param('id') companyId: number, @Request() req: any): Promise<any> {
    const { id } = req.user;
    return await this.projectService.getProjectsByCompany(id, companyId);
  }

  @Post()
  @UserRole(UserRoleEnum.ADMIN, UserRoleEnum.MANAGER)
  @ApiOperation({ summary: "Create a project." })
  @ApiResponse({ status: 201, description: 'Successfully added project.' })
  async create(@Request() req: any, @Body() payload: ProjectCreateDto): Promise<any> {
    const { id } = req.user;
    return await this.projectService.create(id, payload);
  }

  @Patch(':id')
  @ApiOperation({ summary: "Update a project" })
  @ApiResponse({ status: 201, description: 'Successfully updated project.' })
  async patch(@Param('id') projectId: number, 
              @Request() req, @Body() 
              payload: ProjectPatchDto): Promise<any> {
    const { id } = req.user;
    return await this.projectService.patch(id, projectId, payload);
  }

  @Delete(':id')
  @UserRole(UserRoleEnum.ADMIN, UserRoleEnum.MANAGER)
  @ApiOperation({ summary: "Delete a project." })
  @ApiResponse({ status: 201, description: 'Successfully deleted project.' })
  async delete(@Request() req, @Param('id') projectId: number): Promise<any> {
    const { id } = req.user;
    return await this.projectService.delete(id, projectId);
  }
}
  