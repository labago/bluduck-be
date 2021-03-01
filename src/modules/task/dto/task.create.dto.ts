import { ApiProperty } from '@nestjs/swagger';
import { Status } from '../task.entity';

export class TaskCreateDto {
  @ApiProperty({
    required: true,
  })
  projectId: number;

  @ApiProperty({
    required: false,
  })
  taskTitle: string;

  @ApiProperty({
    required: false,
  })
  date: Date;

  @ApiProperty({
    required: false,
  })
  status: Status;

  @ApiProperty({
    required: false,
  })
  notes: string;
}