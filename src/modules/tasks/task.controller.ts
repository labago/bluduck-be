// import {
//   Controller,
//   Body,
//   Patch,
//   Post,
//   Get,
//   Delete,
//   UseGuards,
//   Request,
//   Param
// } from '@nestjs/common';
// import { ApiResponse, ApiTags, ApiBearerAuth, ApiOperation, ApiCreatedResponse } from '@nestjs/swagger';
// import { AuthGuard } from '@nestjs/passport';
// import { TaskService } from './task.service';

// @Controller('api/project')
// @ApiTags('project')
// @ApiBearerAuth()
// @UseGuards(AuthGuard())
// @ApiResponse({ status: 400, description: 'Bad Request' })
// @ApiResponse({ status: 401, description: 'Unauthorized' })
// export class TaskController {
//   constructor(
//     private readonly taskService: TaskService
//   ) {}

//   @Get('company/:id')
//   @ApiOperation({ summary: "Retrieve all projects under company <id>." })
//   @ApiResponse({ status: 201, description: 'Successfully retrieved projects.' })
//   async get(@Param('id') companyId: number, @Request() req: any): Promise<any> {
//     const { id } = req.user;
//     return await this.taskService.getProjectsByCompany(id, companyId);
//   }

//   @Post('company/:id')
//   @ApiOperation({ summary: "Create a project under company <id>." })
//   @ApiResponse({ status: 201, description: 'Successfully added project.' })
//   async create(@Param('id') companyId, @Request() req: any, @Body() payload: ProjectCreateDto): Promise<any> {
//     const { id } = req.user;
//     return await this.taskService.create(id, companyId, payload);
//   }

//   @Patch(':id')
//   @ApiOperation({ summary: "Update a project under project <id>." })
//   @ApiResponse({ status: 201, description: 'Successfully updated project.' })
//   async patch(@Param('id') projectId: number, 
//               @Request() req, @Body() 
//               payload: ProjectPatchDto): Promise<any> {
//     const { id } = req.user;
//     return await this.taskService.patch(id, projectId, payload);
//   }

//   @Delete(':id')
//   @ApiOperation({ summary: "Delete a project under project <id>." })
//   @ApiResponse({ status: 201, description: 'Successfully deleted project.' })
//   async delete(@Request() req, @Param('id') projectId: number): Promise<any> {
//     const { id } = req.user;
//     return await this.taskService.delete(id, projectId);
//   }
// }
  