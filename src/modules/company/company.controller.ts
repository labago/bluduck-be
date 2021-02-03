import {
  Controller,
  Body,
  Patch,
  Post,
  Get,
  UseGuards,
  Request
} from '@nestjs/common';
import { ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CompanyService } from './company.service';
import { UserDto } from '../user/dto';
import { CompanyCreateDto } from './dto/company.create.dto';

@Controller('api/company')
@ApiTags('company')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService
  ) {}

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
}
  