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
import { EmailService } from './email.service';

@Controller('api/email')
@ApiTags('email')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@ApiResponse({ status: 400, description: 'Bad Request' })
@ApiResponse({ status: 401, description: 'Unauthorized' })
export class EmailController {
  constructor(
    private readonly emailService: EmailService
  ) {}

  // @Get('company/:id')
  // @ApiOperation({ summary: "Retrieve all projects under company <id>." })
  // @ApiResponse({ status: 201, description: 'Successfully retrieved projects.' })
  // async get(@Param('id') companyId: number, @Request() req: any): Promise<any> {
  //   const { id } = req.user;
  //   return await this.taskService.getProjectsByCompany(id, companyId);
  // }

  @Post(':id')
  @ApiOperation({ summary: "Create a project under company <id>." })
  @ApiResponse({ status: 201, description: 'Successfully sent email.' })
  async create(@Param('id') companyId, @Request() req: any): Promise<any> {
    const { id } = req.user;
    console.log(req.url);
    // return await this.emailService.sendEmail(id, companyId);
  }

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
}
  