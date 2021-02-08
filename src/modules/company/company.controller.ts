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
import { CompanyService } from './company.service';
import { UserDto } from '../user/dto';
import { CompanyCreateDto } from './dto/company.create.dto';
import { CompanyPatchDto } from './dto/company.patch.dto';

@Controller('api/company')
@ApiTags('company')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@ApiResponse({ status: 400, description: 'Bad Request' })
@ApiResponse({ status: 401, description: 'Unauthorized' })
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService
  ) {}

  @Get()
  @ApiOperation({ summary: "Retrieve all companies owned by user." })
  @ApiResponse({ status: 201, description: 'Successfully retrieved companies.' })
  async get(@Request() req: any): Promise<any> {
    const user = req.user as UserDto;
    return await this.companyService.getAllCompaniesForOwner(user);
  }

  @Post()
  @ApiOperation({ summary: "Create a company." })
  @ApiResponse({ status: 201, description: 'Successfully added company.' })
  async create(@Request() req: any, @Body() payload: CompanyCreateDto): Promise<any> {
    const user = req.user as UserDto;
    return await this.companyService.create(user, payload);
  }

 
  @Patch(':id')
  @ApiOperation({ summary: "Update company info under company <id>." })
  @ApiResponse({ status: 201, description: 'Successfully updated company.' })
  async patch(@Param('id') companyId: number, @Request() req, @Body() payload: CompanyPatchDto): Promise<any> {
    return await this.companyService.patch(req, companyId, payload);
  }

  @Delete(':id')
  @ApiOperation({ summary: "Delete company <id>." })
  @ApiResponse({ status: 201, description: 'Successfully deleted company.' })
  async delete(@Request() req, @Param('id') id: number): Promise<any> {
    return await this.companyService.delete(req, id);
  }
}
  