import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CompanyCreateDto {
    @ApiProperty({
        required: true
      })
    @IsNotEmpty()
    companyName: string;

    @ApiProperty({
      required: true
    })
    @IsNotEmpty()
    ownerId: number;

    @ApiProperty({
      required: false
    })
    @IsNotEmpty()
    userLImit: number;
  }