import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from 'modules/user';

export class TaskPatchDto {
    @ApiProperty()
    taskTitle: string;

    @ApiProperty()
    dueDate: Date;

    @ApiProperty()
    users: UserDto[];
}