import { ApiProperty } from "@nestjs/swagger";

export class CompanyPatchSetActiveStatusDto {   
    @ApiProperty({ required: true })
    isActive: boolean;
}