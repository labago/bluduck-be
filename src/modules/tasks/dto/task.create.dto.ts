import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { UserDto } from 'modules/user';

export class TaskCreateDto {
    @ApiProperty({
      required: true,
    })
    @IsNotEmpty()
    taskTitle: string;

    @ApiProperty({
      required: true,
    })
    @IsNotEmpty()
    dueDate: Date;

    @ApiProperty({
      required: true,
    })
    @IsNotEmpty()
    owner: UserDto;
}