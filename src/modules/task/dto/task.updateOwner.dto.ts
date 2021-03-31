import { ApiProperty } from '@nestjs/swagger';
import { User } from 'modules/user/user.entity';

export class TaskUpdateOwnerDto {
  @ApiProperty({
    required: false,
  })
  owner: User;
}