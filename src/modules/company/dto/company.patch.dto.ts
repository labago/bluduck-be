import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "modules/user/dto/user.dto";

export class CompanyPatchDto {   
    @ApiProperty()
    companyName: string;

    owner: UserDto;
}