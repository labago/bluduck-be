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
import { ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CompanyService } from './company.service';
import { UserDto } from '../user/dto';
import { CompanyCreateDto } from './dto/company.create.dto';
import { CompanyDto } from './dto/company.dto';

@Controller('api/company')
@ApiTags('company')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get()
  @ApiResponse({ status: 201, description: 'Successfully retrieved companies.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async get(@Request() req: any): Promise<any> {
    const user = req.user as UserDto;
    return await this.companyService.getAllCompaniesForOwner(user);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Post()
  @ApiResponse({ status: 201, description: 'Successfully added company.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Request() req: any, @Body() payload: CompanyCreateDto): Promise<any> {
    const user = req.user as UserDto;
    return await this.companyService.create(user, payload);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Patch()
  @ApiResponse({ status: 201, description: 'Successfully updated company.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async patch(@Request() req, @Body() payload: CompanyDto): Promise<any> {
    return await this.companyService.patch(req, payload);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Delete(':id')
  @ApiResponse({ status: 201, description: 'Successfully deleted company.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async delete(@Request() req, @Param('id') id: number): Promise<any> {
    return await this.companyService.delete(req, id);
  }
}
  