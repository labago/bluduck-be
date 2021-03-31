import { ApiProperty } from "@nestjs/swagger";

export class CompanyRemoveUserDto {   
    @ApiProperty({ required: true})
    companyId: number;
    
    @ApiProperty({ required: true})
    email: string;
}