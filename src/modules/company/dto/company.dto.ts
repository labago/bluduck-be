import { UserDto } from "modules/user/dto/user.dto";
import { User } from "modules/user/user.entity";

export class CompanyDto {
    id: number;  
    companyName: string;
    owner: UserDto;
    userLimit: number;
    isActive: boolean;
    users: User[];
}