import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyService } from 'modules/company';
import { ProjectService } from 'modules/project';
import { Repository } from 'typeorm';
import { TaskDto, TaskPatchDto } from './dto';
import { TaskCreateDto } from './dto/task.create.dto';
import { Task } from './task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly companyService: CompanyService,
    private readonly projectService: ProjectService
  ) {}

  async getTaskById(id: number): Promise<TaskDto> {
    return await this.taskRepository.findOne(id);
  }

  async getTasksByProjectId(userId: number, projectId: number): Promise<TaskDto[]> {
    
      const project = await this.projectService.getProjectById(projectId);
      const company = await this.companyService.getCompanyById(project.company.id);
      const userFound = await company.users.filter(user => user.id === userId)[0];

      console.log(userFound);

      if (!userFound) {
        throw new NotFoundException('Only users in company can view projects.');
      }
      return this.taskRepository.find({
        join: {
          alias: 'task',
          leftJoinAndSelect: {
            project: 'task.project'
          }
        },
        where: {
          project: projectId
        }
      });
    
  }

  async create(userId: number, payload: TaskCreateDto): Promise<TaskDto> {
    const project = await this.projectService.getProjectById(payload.projectId);
    const company = await this.companyService.getCompanyById(project.company.id);    
    const userFound = await company.users.filter(user => user.id === userId)[0];

    if (!userFound) {
      throw new NotFoundException('Only users in company can create tasks.');
    }

    return await this.taskRepository.save(this.taskRepository.create({
      owner: userFound,
      project: project,
      date: payload.date,
      status: payload.status,
      taskTitle: payload.taskTitle,
      notes: payload.notes
    }));
  }

  async patch(userId: number, taskId: number, payload: TaskPatchDto): Promise<TaskDto> {
    const task = await this.getTaskById(taskId);
    const userFound = await task.users.filter(user => user.id === userId)[0];

    if (!userFound) {
      throw new NotFoundException('Only users added to task can update tasks.');
    }
    await this.taskRepository.update({ id: taskId }, payload);
    return this.getTaskById(taskId);
  }

  async delete(userId: number, taskId: number): Promise<any> {
    const task = await this.getTaskById(taskId);    

    if (userId !== task.owner.id) {
      throw new UnauthorizedException('Only owners of task can delete task.'); 
    }
    return await this.taskRepository.delete(taskId);;
  }
}
