import { ApiProperty } from "@nestjs/swagger";

export class CompanyPatchDto {   
    @ApiProperty({ required: false })
    companyName: string;
    
    @ApiProperty({ required: false })
    userLimit: number;

    @ApiProperty({ required: false })
    projectLimit: number;

    @ApiProperty({ required: false })
    taskLimit: number;

    @ApiProperty({ required: false })
    isActive: boolean;
}