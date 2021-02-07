import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "modules/user/dto/user.dto";

export class CompanyPatchDto {
    @ApiProperty()
    id: number;  
    
    @ApiProperty()
    companyName: string;

    owner: UserDto;
}