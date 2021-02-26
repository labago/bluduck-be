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
    userLImit: number;

    @ApiProperty({
      required: false
    })
    projectLimit: number;

    @ApiProperty({
      required: false
    })
    taskLimit: number;
  }