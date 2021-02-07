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

@Controller('api/project')
@ApiTags('project')
@ApiBearerAuth()
@UseGuards(AuthGuard())
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService
  ) {}

  @Get('company/:id')
  @ApiOperation({ summary: "Retrieve all projects under company <id>." })
  @ApiResponse({ status: 201, description: 'Successfully retrieved projects.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async get(@Param('id') companyId: number, @Request() req: any): Promise<any> {
    const { id } = req.user;
    return await this.projectService.getProjectsByCompany(id, companyId);
  }

  @Post('company/:id')
  @ApiOperation({ summary: "Create a project under company <id>." })
  @ApiResponse({ status: 201, description: 'Successfully added project.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Param('id') companyId, @Request() req: any, @Body() payload: ProjectCreateDto): Promise<any> {
    const { id } = req.user;
    return await this.projectService.create(id, companyId, payload);
  }

  @Patch(':id')
  @ApiOperation({ summary: "Update a project under project <id>." })
  @ApiResponse({ status: 201, description: 'Successfully updated project.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async patch(@Param('id') projectId: number, 
              @Request() req, @Body() 
              payload: ProjectPatchDto): Promise<any> {
    const { id } = req.user;
    return await this.projectService.patch(id, projectId, payload);
  }

  @Delete(':id')
  @ApiOperation({ summary: "Delete a project under project <id>." })
  @ApiResponse({ status: 201, description: 'Successfully deleted project.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async delete(@Request() req, @Param('id') projectId: number): Promise<any> {
    const { id } = req.user;
    return await this.projectService.delete(id, projectId);
  }
}
  