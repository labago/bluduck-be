import { CompanyDto } from "modules/company/dto";

export class ProjectDto {
    id: number;  
    projectName: string;
    dueDate: Date;
    latestUpdate?: Date;
    companyId: CompanyDto;
}