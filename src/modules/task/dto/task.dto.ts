import { Project } from "modules/project/project.entity";
import { User } from "modules/user/user.entity";
import { TaskStatus } from "../task.entity";

export class TaskDto {
    id: number;
    taskTitle: string;
    date: Date;
    status: TaskStatus;
    project: Project;
    owner: User;
    users: User[];
    notes: string;
  }