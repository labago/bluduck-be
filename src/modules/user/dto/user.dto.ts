import { Company } from "modules/company/company.entity";

export class UserDto {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    avatarColor: string;
    role: string;
    company: Company;
    isVerified: boolean;
    isAdmin: boolean;
}