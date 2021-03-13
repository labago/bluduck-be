import { ApiProperty } from '@nestjs/swagger';
import { UserRoleEnum } from '../user.entity';

export class UserRolePatchDto {
    @ApiProperty({ 
        required: true
    })
    userRole: UserRoleEnum;
}