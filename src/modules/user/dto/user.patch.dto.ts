import { ApiProperty } from '@nestjs/swagger';

export class UserPatchDto {
    @ApiProperty({ 
        required: false
    })
    email: string;

    @ApiProperty({ 
        required: false
    })
    firstName: string;

    @ApiProperty({ 
        required: false
    })
    lastName: string;

    @ApiProperty({ 
        required: false
    })
    phoneNumber: string;

    @ApiProperty({ 
        required: false
    })
    avatarColor: string;

    @ApiProperty({ 
        required: false
    })
    role: string;

    @ApiProperty({ 
        required: false
    })
    verified: boolean;

    @ApiProperty({ 
        required: false
    })
    companyLimit: number;
    
    @ApiProperty({ 
        required: false
    })
    projectLimit: number;
    
    @ApiProperty({ 
        required: false
    })
    taskLimit: number;    
}