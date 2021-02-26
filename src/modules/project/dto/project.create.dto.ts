import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class ProjectCreateDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  companyId: number;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  projectName: string;

  @ApiProperty({
    required: false,
  })
  dueDate: Date;

  @ApiProperty({
    required: false,
  })  
  latestUpdate: Date
}