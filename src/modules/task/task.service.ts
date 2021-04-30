import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyService } from 'modules/company/company.service';
import { EmailService } from 'modules/email/email.service';
import { ProjectPatchDto } from 'modules/project/dto/project.patch.dto';
import { Project } from '../project/project.entity';
import { UserRoleEnum } from 'modules/user/user.entity';
import { getConnection, Repository } from 'typeorm';
import { TaskDto } from './dto/task.dto';
import { TaskCreateDto } from './dto/task.create.dto';
import { TaskInviteDto } from './dto/task.invite.dto';
import { Task, TaskStatus } from './task.entity';
import { TaskUpdateOwnerDto } from './dto/task.updateOwner.dto';
import { ProjectService } from 'modules/project/project.service';
import { UserService } from 'modules/user/user.service';
import { TaskPatchDto } from './dto/task.patch.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @Inject(forwardRef(() => CompanyService)) private readonly companyService: CompanyService,
    @Inject(forwardRef(() => ProjectService)) private readonly projectService: ProjectService,
    private readonly userService: UserService,
    private readonly emailService: EmailService
  ) {}

    async getTasks(): Promise<Task[]> {
      return await this.taskRepository.find({ relations: ['users', 'project', 'project.company','owner'] });
    }

  async getTaskById(id: number): Promise<TaskDto> {
    return await this.taskRepository.findOne(id, { relations: ['users', 'owner', 'project', 'project.company', 'project.users', 'project.tasks'] });
  }

  async getTasksByProjectId(user: any, projectId: number): Promise<TaskDto[]> {
    
      const project = await this.projectService.getProjectById(projectId);
      const company = await this.companyService.getCompanyById(project.company.id);
      const userFound = await company.users.filter(u => u.id === user.id)[0];

      if (!userFound && user.userRole !== UserRoleEnum.ADMIN) {
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
    const user = await this.userService.get(userId);
    const project = await this.projectService.getProjectById(payload.projectId);
    const company = await this.companyService.getCompanyById(project.company.id);    
    const userFoundInCompany = await company.users.filter(u => u.id === userId);

    if (project.tasks.length >= company.taskLimit || company.taskLimit === 0) {
      throw new BadRequestException(
        'Company has reached its limit of tasks created.'
      )
    }

    if (userFoundInCompany.length <= 0 && user.userRole !== UserRoleEnum.ADMIN) {
      throw new BadRequestException(
        'Task creator must belong to company to add people to task.',
      );
    }

    const task = await this.taskRepository.save(this.taskRepository.create({
      owner: user,
      project: project,
      date: payload.date,
      status: payload.status,
      taskTitle: payload.taskTitle,
      notes: payload.notes
    }));

    return task;
  }

  async patch(userId: number, taskId: number, payload: TaskPatchDto): Promise<TaskDto> {
    let task = await this.getTaskById(taskId);
    const userFound = await task.users.filter(user => user.id === userId)[0];
    const owner = await this.userService.get(userId);
    const companyId = task.project.company.id;
    const company = await this.companyService.getCompanyById(companyId);
    const userFoundInCompany = await company.users.filter(u => u.email === owner.email);
    if (userFoundInCompany.length <= 0 && owner.userRole !== UserRoleEnum.ADMIN) {
      throw new BadRequestException(
        'User must be manager or admin to update task.',
      );
    }

    if (!userFound && !owner) {
      throw new NotFoundException('Only owner and users added to task can perform this action.');
    }
    await this.taskRepository.update({ id: taskId }, payload);
    task = await this.getTaskById(taskId);
    if (payload.status && (payload.status === TaskStatus.BLOCK || payload.status === TaskStatus.DONE)) {
      task.users.forEach(user => {
        this.emailService.sendTaskUpdateNotification(user.email, task.taskTitle, task.id, task.status, task.project.id);
      });
    }
    
    return await this.updateProjectCompletion(task.project);
  }

  async updateOwner(taskId: number, payload: TaskUpdateOwnerDto): Promise<any> {
    return await this.taskRepository.update({ id: taskId }, payload);
  }

  async delete(userId: number, taskId: number): Promise<any> {   
    const task = await this.getTaskById(taskId);
    const user = await this.userService.get(userId);
    const companyId = task.project.company.id;
    const company = await this.companyService.getCompanyById(companyId);
    const managerFoundInCompany = await company.users.filter(u => u.id === userId);
    if (managerFoundInCompany.length <= 0 && user.userRole !== UserRoleEnum.ADMIN) {
      throw new BadRequestException(
        'Must belong to company to delete task.',
      );
    }
    await this.taskRepository.delete(taskId)
    return { status: 200, message: 'Successfully deleted task.'};
  }

  async removeUser(userId: number, payload: TaskInviteDto): Promise<any> {
    const task = await this.getTaskById(payload.taskId);    
    const user = await this.userService.get(userId);
    const userToBeRemoved = await this.userService.getByEmail(payload.email);
    const company = await this.companyService.getCompanyById(payload.companyId);
    const userFoundInCompany = await company.users.filter(u => u.email === userToBeRemoved.email);

    if (userFoundInCompany.length <= 0) {
      throw new BadRequestException(
        'User must belong to company before being removed from task.',
      );
    }

    const managerFoundInCompany = await company.users.filter(u => u.id === userId);
    if (managerFoundInCompany.length <= 0 && user.userRole !== UserRoleEnum.ADMIN) {
      throw new BadRequestException(
        'Inviter must belong to company to add people to task.',
      );
    }
    
    // remove user from task
    await getConnection()
          .createQueryBuilder()
          .relation(Task, 'users')
          .of(task)
          .remove(userToBeRemoved);
    
    // check if user exists in other tasks
    const tasks = await this.getTasks();
    let userExists = false;
    tasks.forEach(task => {
      task.users.forEach(user => {
        if (user.id === userToBeRemoved.id) {
          userExists = true;
        }
      })
    });

    if (!userExists) {
      await this.projectService.removeUserFromProject(userToBeRemoved, task.project);
    }

    await this.emailService.sendTaskRemoveNotification(payload.email, task.taskTitle);
    return { status: 200, message: 'Successfully removed user from  task' };
  }

  async invite(userId: number, payload: TaskInviteDto): Promise<any> {    
    const user = await this.userService.get(userId);
    const userToBeInvited = await this.userService.getByEmail(payload.email);
    if (!userToBeInvited || !userToBeInvited.isVerified) {
      throw new BadRequestException(
        'User needs to be registered and verified to join task.',
      );
    }

    const company = await this.companyService.getCompanyById(payload.companyId);
    const userFoundInCompany = await company.users.filter(u => u.email === userToBeInvited.email);
    if (userFoundInCompany.length <= 0) {
      throw new BadRequestException(
        'User must belong to company before being added to task.',
      );
    }

    const managerFoundInCompany = await company.users.filter(u => u.id === userId);
    if (managerFoundInCompany.length <= 0 && user.userRole !== UserRoleEnum.ADMIN) {
      throw new BadRequestException(
        'Inviter must belong to company to add people to task.',
      );
    }

    const task = await this.getTaskById(payload.taskId);
    const userFound = await task.users.filter(u => u.id === userToBeInvited.id);
    if (userFound.length > 0) {
      throw new BadRequestException(
        'User already added to task.',
      );
    }
    
    await getConnection()
          .createQueryBuilder()
          .relation(Task, 'users')
          .of(task)
          .add(userToBeInvited);

    const userFoundInProject = await task.project?.users?.filter(u => u.id === userToBeInvited.id);
    if (!userFoundInProject || userFoundInProject.length <= 0) {
      await getConnection()
      .createQueryBuilder()
      .relation(Project, 'users')
      .of(task.project)
      .add(userToBeInvited);
    }

    await this.emailService.sendTaskInviteNotification(payload.email, task.taskTitle);
    return { status: 200, message: 'Successfully added user to task'};
  }

  private async updateProjectCompletion(project: Project): Promise<any> {    
      let tasksDone = 0;
      project.tasks?.forEach(task => {
        if (task.status === TaskStatus.DONE) {
          tasksDone++;
        }
      });
      const percent =  tasksDone / project.tasks.length;
      let taskPercentage = (percent !== Infinity ? percent : 0);
      const projectPatchDto = new ProjectPatchDto();
      projectPatchDto.percentComplete = taskPercentage;
      const company = await this.companyService.getCompanyById(project.company.id);
      await this.projectService.patch(company.owner.id, project.id, projectPatchDto);
      return await this.companyService.getCompanyById(project.company.id);
  
  }
}
