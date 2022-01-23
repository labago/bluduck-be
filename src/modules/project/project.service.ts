import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { Project } from './project.entity';
import { ProjectCreateDto } from './dto/project.create.dto';
import { CompanyService } from '../company/company.service';
import { ProjectPatchDto } from './dto/project.patch.dto';
import { User, UserRoleEnum } from 'modules/user/user.entity';
import { UserService } from 'modules/user/user.service';
import { TaskService } from 'modules/task/task.service';
import { TaskCreateDto } from 'modules/task/dto/task.create.dto';
import { ProjectCopyDto } from './dto/project.copy.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @Inject(forwardRef(() => CompanyService)) private readonly companyService: CompanyService,
    @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
    @Inject(forwardRef(() => TaskService)) private readonly taskService: TaskService
  ) {}

  async getProjects(): Promise<Project[]> {
    return await this.projectRepository.find({ relations: ['company', 'users', 'tasks'] });
  }

  async getProjectById(id: number): Promise<Project> {
    return await this.projectRepository.findOne(id, { relations: ['company', 'company.users', 'tasks', 'users']});
  }

  async getProjectsByCompany(userId: number, companyId: number): Promise<Project[]> {
    const user = await this.userService.get(userId);
    const company = await this.companyService.getCompanyById(companyId);
    const userFoundInCompany = await company.users.filter(u => u.id === userId);
    if (userFoundInCompany.length <= 0 && user.userRole !== UserRoleEnum.ADMIN) {
      throw new NotFoundException('Must be a member of company to retrieve projects.');
    }
    return this.projectRepository.find({
      join: {
        alias: 'project',
        leftJoinAndSelect: {
          company: 'project.company'
        }
      },
      where: {
        company: companyId
      }
    });
  }
  
  async removeUserFromProject(user: User, project: Project): Promise<any> {
    await getConnection()
      .createQueryBuilder()
      .relation(Project, 'users')
      .of(project)
      .remove(user);
  }

  async create(userId: number, payload: ProjectCreateDto): Promise<Project> {
    const company = await this.companyService.getCompanyById(payload.companyId);
    const user = await this.userService.get(userId);
    const managerFoundInCompany = await company.users.filter(u => u.id === userId);
    
    if (company.projects.length >= company.projectLimit || company.projectLimit === 0) {
      throw new BadRequestException(
        'Company has reached its limit of projects created.'
      )
    }

    if (managerFoundInCompany.length <= 0 && user.userRole !== UserRoleEnum.ADMIN) {
      throw new BadRequestException(
        'Must be admin or belong to company to create a project.',
      );
    }

    return await this.projectRepository.save(this.projectRepository.create({
      company,
      projectName: payload.projectName,
      dueDate: payload.dueDate,
      latestUpdate: payload.latestUpdate
    }));
  }

  async patch(userId, projectId, payload: ProjectPatchDto): Promise<Project> {
    const project = await this.projectRepository
                              .createQueryBuilder('project')
                              .leftJoinAndSelect('project.company', 'company')
                              .leftJoinAndSelect('company.owner', 'owner')
                              .where('project.id = :id')
                              .setParameter('id', projectId)
                              .getOne();                                                   
    await this.projectRepository.update({ id: projectId }, payload);
    return await this.getProjectById(projectId);
  }

  async delete(userId: number, projectId: number): Promise<any> {
    const project = await this.getProjectById(projectId); 
    const user = await this.userService.get(userId);
    const managerFoundInCompany = project.company.users.filter(u => u.id === userId);

    if (managerFoundInCompany.length <= 0 && user.userRole !== UserRoleEnum.ADMIN) {
      throw new BadRequestException(
        'Must belong to company to delete project.',
      );
    }                                                        
    await this.projectRepository.delete(projectId);
    return { status: 200, message: 'Successfully deleted project.'};
  }

  async copy(userId: number, projectId: number, payload: ProjectCopyDto): Promise<any> {
    const project = await this.projectRepository.findOne({ id: projectId }, { relations: ['tasks', 'company'] });
    const company = await this.companyService.getCompanyById(project.company.id);
    const user = await this.userService.get(userId);
    const managerFoundInCompany = await company.users.filter(u => u.id === userId);
    const includeNotes = payload.includeNotes;
    console.log('include?', includeNotes);

    if (company.projects.length >= company.projectLimit || company.projectLimit === 0) {
      throw new BadRequestException(
        'Company has reached its limit of projects created.'
      )
    }

    if (managerFoundInCompany.length <= 0 && user.userRole !== UserRoleEnum.ADMIN) {
      throw new BadRequestException(
        'Must be admin or belong to company to create a project.',
      );
    }

    const newProject = await this.projectRepository.save(this.projectRepository.create({
      company,
      projectName: `${project.projectName} COPY`,
      dueDate: project.dueDate,
      latestUpdate: project.latestUpdate
    }));

    await project.tasks.forEach(async task => {
      const newTask = new TaskCreateDto();
      newTask.projectId = newProject.id;
      newTask.taskTitle = task.taskTitle;
      newTask.date = task.date;
      newTask.notes = includeNotes ? task.notes : `[{"text": "Task created", "date": "${Date.now()}", "type": "creation", "userId": "${userId}"}]`;
      await this.taskService.create(userId, newTask);
    })

    return { newProject };
  }
}
