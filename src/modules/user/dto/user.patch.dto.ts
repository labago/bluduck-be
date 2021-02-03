import { ApiProperty } from '@nestjs/swagger';

export class UserPatchDto {
    @ApiProperty()
    email: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    phoneNumber: string;

    @ApiProperty()
    avatarColor: string;

    @ApiProperty()
    role: string;

    @ApiProperty()
    companyLimit: number;
    
    @ApiProperty()
    projectLimit: number;
    
    @ApiProperty()
    taskLimit: number;    
}