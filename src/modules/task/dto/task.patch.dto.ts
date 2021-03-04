import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../task.entity';

export class TaskPatchDto {
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
  status: TaskStatus;

  @ApiProperty({
    required: false,
  })
  notes: string;
}