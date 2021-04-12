import { ApiProperty } from "@nestjs/swagger";

export class CompanyPatchOwnerDto {   
    @ApiProperty({ required: true })
    ownerId: number;
}