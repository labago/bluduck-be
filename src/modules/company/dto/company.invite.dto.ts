import { ApiProperty } from "@nestjs/swagger";

export class CompanyInviteDto {   
    @ApiProperty({ required: true})
    companyId: number;
    
    @ApiProperty({ required: true})
    email: string;
}