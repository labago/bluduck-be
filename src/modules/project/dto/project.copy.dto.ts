import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ProjectCopyDto {
  @ApiProperty({
    required: false,
  })
  @IsNotEmpty()
  includeNotes: boolean = false;
}