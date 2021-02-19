import { Company } from "modules/company";

export class UserDto {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    avatarColor: string;
    role: string;
    isVerified: boolean;
    companies?: Company[];
    isAdmin: boolean;
}