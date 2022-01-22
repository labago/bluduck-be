import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ProjectCopyDto {

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  companyId: number;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  projectId: number;

  @ApiProperty({
    required: false,
  })
  @IsNotEmpty()
  includeNotes: boolean;
}