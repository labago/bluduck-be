import { ApiProperty } from '@nestjs/swagger';
import { Company } from 'modules/company/company.entity';
import { UserRoleEnum } from '../user.entity';

export class UserPatchInternalDto {
    @ApiProperty({ 
        required: false
    })
    company: Company;

    @ApiProperty({ 
        required: false
    })
    userRole: UserRoleEnum;
}