import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskCreateDto, TaskDto } from './dto';
import { Task } from './task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>
  ) {}

  // async getTasksByProjectId(userId: number, projectId: number): Promise<TaskDto[]> {
  //   const project = await this.companyService.get(companyId);
  //   if (userId !== company.owner.id) {
  //     throw new NotFoundException('Only owner of company can retrieve projects.');
  //   }
  //   return this.taskRepository.find({
  //     join: {
  //       alias: 'task',
  //       leftJoinAndSelect: {
  //         company: 'task.project'
  //       }
  //     },
  //     where: {
  //       company: projectId
  //     }
  //   });
  // }

  // async getProjectsByCompany(userId: number, companyId: number): Promise<ProjectDto[]> {
  //   const company = await this.companyService.get(companyId);
  //   if (userId !== company.owner.id) {
  //     throw new NotFoundException('Only owner of company can retrieve projects.');
  //   }
  //   return this.projectRepository.find({
  //     join: {
  //       alias: 'project',
  //       leftJoinAndSelect: {
  //         company: 'project.company'
  //       }
  //     },
  //     where: {
  //       company: companyId
  //     }
  //   });
  // }

  // async create(userId: number, projectId: number, payload: TaskCreateDto): Promise<any> {
  //   console.log(payload);
  //   const company = await this.companyService.get(companyId);
  //   if (company.owner.id !== userId) {
  //     throw new NotFoundException('Only owner of company can create projects.');
  //   }

  //   return await this.projectRepository.save(this.projectRepository.create({
  //     company,
  //     projectName: payload.projectName,
  //     dueDate: payload.dueDate,
  //     latestUpdate: payload.latestUpdate
  //   }));
  // }

  // async patch(userId, projectId, payload: ProjectPatchDto): Promise<ProjectDto> {
  //   const project = await this.projectRepository
  //                             .createQueryBuilder('project')
  //                             .leftJoinAndSelect('project.company', 'company')
  //                             .leftJoinAndSelect('company.owner', 'owner')
  //                             .where('project.id = :id')
  //                             .setParameter('id', projectId)
  //                             .getOne();                                                   
  //   if (project.company.owner.id !== userId) {
  //     throw new UnauthorizedException('User only authorized to make changes to his/her/their/shis/xis project.'); 
  //   }
  //   await this.projectRepository.update({ id: projectId }, payload);
  //   return await this.getProjectsById(projectId);
  // }

  // async delete(userId: number, projectId: number): Promise<any> {
  //   const project = await this.projectRepository
  //                             .createQueryBuilder('project')
  //                             .leftJoinAndSelect('project.company', 'company')
  //                             .leftJoinAndSelect('company.owner', 'owner')
  //                             .where('project.id = :id')
  //                             .setParameter('id', projectId)
  //                             .getOne();                                                   
  //   if (project.company.owner.id !== userId) {
  //     throw new UnauthorizedException('User only authorized to make changes to his/her/their/shis/xis project.'); 
  //   }
  //   return await this.projectRepository.delete(projectId);;
  // }
}
