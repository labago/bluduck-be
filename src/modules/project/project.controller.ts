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
import { ApiResponse, ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ProjectService } from './project.service';
import { UserDto } from '../user/dto';
import { ProjectCreateDto } from './dto/project.create.dto';

@Controller('api/project')
@ApiTags('project')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get('company/:id')
  @ApiOperation({ summary: "Retrieve all projects under company <id>." })
  @ApiResponse({ status: 201, description: 'Successfully retrieved projects.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async get(@Param('id') companyId: number, @Request() req: any): Promise<any> {
    const { id } = req.user;
    return await this.projectService.getProjectsByCompany(id, companyId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Post('company/:id')
  @ApiOperation({ summary: "Create a project under company <id>." })
  @ApiResponse({ status: 201, description: 'Successfully added project.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Param('id') companyId, @Request() req: any, @Body() payload: ProjectCreateDto): Promise<any> {
    const { id } = req.user;
    return await this.projectService.create(id, companyId, payload);
  }

  // @ApiBearerAuth()
  // @UseGuards(AuthGuard())
  // @Patch()
  // @ApiResponse({ status: 201, description: 'Successfully updated company.' })
  // @ApiResponse({ status: 400, description: 'Bad Request' })
  // @ApiResponse({ status: 401, description: 'Unauthorized' })
  // async patch(@Request() req, @Body() payload: CompanyDto): Promise<any> {
  //   return await this.companyService.patch(req, payload);
  // }

  // @ApiBearerAuth()
  // @UseGuards(AuthGuard())
  // @Delete(':id')
  // @ApiResponse({ status: 201, description: 'Successfully deleted company.' })
  // @ApiResponse({ status: 400, description: 'Bad Request' })
  // @ApiResponse({ status: 401, description: 'Unauthorized' })
  // async delete(@Request() req, @Param('id') id: number): Promise<any> {
  //   return await this.companyService.delete(req, id);
  // }
}
  