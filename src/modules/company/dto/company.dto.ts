import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "modules/user/dto/user.dto";

export class CompanyDto {
    id: number;  
    companyName: string;
    owner: UserDto;
    userLimit: number;
}