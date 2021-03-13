import { Company } from "modules/company/company.entity";
import { UserRoleEnum } from "../user.entity";

export class UserDto {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    avatarColor: string;
    role: string;
    userRole: UserRoleEnum;
    companies: Company[];
    isVerified: boolean;
}