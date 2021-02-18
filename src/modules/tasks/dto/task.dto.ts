import { ProjectDto } from "modules/project";
import { UserDto } from "modules/user/dto";

export class TaskDto {
    id: number;  
    taskTitle: string;
    dueDate: Date;
    project: ProjectDto;
    owner: UserDto;
    users: UserDto[];
}