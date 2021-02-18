import { Company } from "modules/company";

export class UserDto {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    avatarColor: string;
    role: string;
    verified: boolean;
    companyLimit: number;
    projectLimit: number;
    taskLimit: number;
    companies?: Company[];
}