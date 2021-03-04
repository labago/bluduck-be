import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyService } from 'modules/company';
import { EmailService } from 'modules/email';
import { ProjectDto, ProjectPatchDto, ProjectService } from 'modules/project';
import { Project } from '../project/project.entity';
import { UserPatchDto, UserService } from 'modules/user';
import { getConnection, Repository, Transaction } from 'typeorm';
import { TaskDto, TaskPatchDto } from './dto';
import { TaskCreateDto } from './dto/task.create.dto';
import { TaskInviteDto } from './dto/task.invite.dto';
import { Task, TaskStatus } from './task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly companyService: CompanyService,
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
    private readonly emailService: EmailService
  ) {}

  async getTaskById(id: number): Promise<TaskDto> {
    return await this.taskRepository.findOne(id, { relations: ['users', 'owner', 'project', 'project.company', 'project.users', 'project.tasks'] });
  }

  async getTasksByProjectId(userId: number, projectId: number): Promise<TaskDto[]> {
    
      const project = await this.projectService.getProjectById(projectId);
      const company = await this.companyService.getCompanyById(project.company.id);
      const userFound = await company.users.filter(user => user.id === userId)[0];

      if (!userFound) {
        throw new NotFoundException('Only users in company can view projects.');
      }
      // todo add owner and assignee relations
      return this.taskRepository.find({
        join: {
          alias: 'task',
          leftJoinAndSelect: {
            project: 'task.project',
            owner: 'task.owner',
            users: 'task.users'
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
    // const userFound = await company.users.filter(user => user.id === userId)[0];

    if (company.owner.id !== userId) {
      throw new NotFoundException('Only owner in company can create tasks.');
    }

    const task = await this.taskRepository.save(this.taskRepository.create({
      owner: company.owner,
      project: project,
      date: payload.date,
      status: payload.status,
      taskTitle: payload.taskTitle,
      notes: payload.notes
    }));

    return task;
  }

  async patch(userId: number, taskId: number, payload: TaskPatchDto): Promise<TaskDto> {
    const task = await this.getTaskById(taskId);
    const userFound = await task.users.filter(user => user.id === userId)[0];
    const owner = await this.userService.get(userId);
    const project = await this.projectService.getProjectById(task.project.id);

    if (!userFound && !owner) {
      throw new NotFoundException('Only owner and users added to task can perform this action.');
    }
    await this.taskRepository.update({ id: taskId }, payload);
    return await this.updateProjectCompletion(task.project);
  }

  async delete(userId: number, taskId: number): Promise<any> {
    const task = await this.getTaskById(taskId);    

    if (userId !== task.owner.id) {
      throw new UnauthorizedException('Only owners of task can delete task.'); 
    }
    return await this.taskRepository.delete(taskId);;
  }

  async invite(userId: number, payload: TaskInviteDto): Promise<any> {
    const company = await this.companyService.getCompanyById(payload.companyId);
    if (company.owner.id !== userId) {
      throw new BadRequestException(
        'Must be owner to add user to task.',
      );
    }

    const user = await this.userService.getByEmail(payload.email);
    if (!user || !user.isVerified) {
      throw new BadRequestException(
        'User needs to be registered and verified to join company.',
      );
    }

    const task = await this.getTaskById(payload.taskId);
    const userFound = await task.users.filter(u => u.id === user.id);
    if (userFound.length > 0) {
      throw new BadRequestException(
        'User already added to task.',
      );
    }
    
    await getConnection()
          .createQueryBuilder()
          .relation(Task, 'users')
          .of(task)
          .add(user);

    const userFoundInProject = await task.project?.users?.filter(u => u.id === user.id);
    if (!userFoundInProject) {
      await getConnection()
      .createQueryBuilder()
      .relation(Project, 'users')
      .of(task.project)
      .add(user);
    }

    const result = await this.emailService.sendTaskInviteNotification(payload.email, task.taskTitle);
    return { status: 200, message: 'Successfully added user to task'};
  }

  private async updateProjectCompletion(project: Project): Promise<any> {    
    if (project.tasks?.length > 0) {
      let tasksDone = 0;
      project.tasks?.forEach(task => {
        if (task.status === TaskStatus.DONE) {
          tasksDone++;
        }
      });
      let taskPercentage = tasksDone / project.tasks.length;
      const projectPatchDto = new ProjectPatchDto();
      projectPatchDto.percentComplete = taskPercentage;
      const company = await this.companyService.getCompanyById(project.company.id);
      await this.projectService.patch(company.owner.id, project.id, projectPatchDto);
      return await this.companyService.getCompanyById(project.company.id);
    }    
  }
}
