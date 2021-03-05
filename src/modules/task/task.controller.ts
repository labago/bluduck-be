import {
  Controller,
  Body,
  Patch,
  Post,
  Get,
  Delete,
  UseGuards,
  Request,
  Param,
  UseInterceptors
} from '@nestjs/common';
import { ApiResponse, ApiTags, ApiBearerAuth, ApiOperation, ApiCreatedResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { TaskService } from './task.service';
import { TaskCreateDto } from './dto/task.create.dto';
import { TaskPatchDto } from './dto';
import { GlobalErrorHandler } from 'modules/common/middleware/globalErrorHandler.middleware';
import { TaskInviteDto } from './dto/task.invite.dto';

@Controller('api/task')
@ApiTags('task')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@ApiResponse({ status: 400, description: 'Bad Request' })
@ApiResponse({ status: 401, description: 'Unauthorized' })

export class TaskController {
  constructor(
    private readonly taskService: TaskService
  ) {}
  
  @Get('project/:id')
  @ApiOperation({ summary: "Retrieve all tasks under project <id>." })
  @ApiResponse({ status: 201, description: 'Successfully retrieved tasks.' })
  async get(@Param('id') projectId: number, @Request() req: any): Promise<any> {
    const { id } = req.user;
    return await this.taskService.getTasksByProjectId(id, projectId);
  }

  @Post()
  @ApiOperation({ summary: "Create a task." })
  @ApiResponse({ status: 201, description: 'Successfully added task.' })
  async create(@Request() req: any, @Body() payload: TaskCreateDto): Promise<any> {
    const { id } = req.user;
    return await this.taskService.create(id, payload);
  }

  @Patch(':id')
  @ApiOperation({ summary: "Update a task." })
  @ApiResponse({ status: 201, description: 'Successfully updated task.' })
  async patch(@Param('id') taskId: number, 
              @Request() req, 
              @Body() payload: TaskPatchDto): Promise<any> {
    const { id } = req.user;
    return await this.taskService.patch(id, taskId, payload);
  }

  @Delete(':id')
  @ApiOperation({ summary: "Delete a task." })
  @ApiResponse({ status: 201, description: 'Successfully deleted task.' })
  async delete(@Param('id') taskId: number, @Request() req): Promise<any> {
    const { id } = req.user;
    return await this.taskService.delete(id, taskId);
  }

  @Post('invite')
  @ApiOperation({ summary: "Invite user to a task." })
  @ApiResponse({ status: 201, description: 'Successfully added user to task.' })
  async invite(@Request() req: any, @Body() payload: TaskInviteDto): Promise<any> {
    const { id } = req.user;
    return await this.taskService.invite(id, payload);
  }

  @Post('removeUser')
  @ApiOperation({ summary: "Remove user from a task." })
  @ApiResponse({ status: 201, description: 'Successfully removed user from task.' })
  async removeUser(@Request() req: any, @Body() payload: TaskInviteDto): Promise<any> {
    const { id } = req.user;
    return await this.taskService.removeUser(id, payload);
  }
}
  