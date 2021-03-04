import { CompanyDto } from "modules/company/dto";
import { Task } from 'modules/task/task.entity';

export class ProjectDto {
    id: number;  
    projectName: string;
    dueDate: Date;
    latestUpdate?: Date;
    percentComplete: number;
    company: CompanyDto;
    tasks?: Task[];
}