import { ApiProperty } from "@nestjs/swagger";

export class CompanyPatchDto {   
    @ApiProperty()
    companyName: string;
    
    @ApiProperty()
    ownerId: number;
    
    @ApiProperty()
    userLimit: number;

    @ApiProperty()
    projectLimit: number;

    @ApiProperty()
    taskLimit: number;

    @ApiProperty()
    isActive: boolean;
}