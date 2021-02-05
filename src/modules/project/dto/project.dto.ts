import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "modules/user/dto/user.dto";

export class CompanyDto {
    @ApiProperty()
    id: number;  

    @ApiProperty()
    companyName: string;

    owner: UserDto;
}