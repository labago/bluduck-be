import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { ProjectCreateDto } from './dto/project.create.dto';
import { CompanyService } from '../company/company.service';
import { ProjectDto } from './dto/project.dto';
import { ProjectPatchDto } from './dto/project.patch.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly companyService: CompanyService
  ) {}

  async getProjectById(id: number): Promise<ProjectDto> {
    return await this.projectRepository.findOne(id, { relations: ['company']});
  }

  async getProjectsByCompany(userId: number, companyId: number): Promise<ProjectDto[]> {
    const company = await this.companyService.getCompanyById(companyId);
    if (company.users.filter(user => user.id !== userId)) {
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

  async create(userId: number, payload: ProjectCreateDto): Promise<Project> {
    
    const company = await this.companyService.getCompanyById(payload.companyId);

    return await this.projectRepository.save(this.projectRepository.create({
      company,
      projectName: payload.projectName,
      dueDate: payload.dueDate,
      latestUpdate: payload.latestUpdate
    }));
  }

  async patch(userId, projectId, payload: ProjectPatchDto): Promise<ProjectDto> {
    const project = await this.projectRepository
                              .createQueryBuilder('project')
                              .leftJoinAndSelect('project.company', 'company')
                              .leftJoinAndSelect('company.owner', 'owner')
                              .where('project.id = :id')
                              .setParameter('id', projectId)
                              .getOne();                                                   
    if (project.company.owner.id !== userId) {
      throw new UnauthorizedException('User only authorized to make changes to his/her/their/shis/xis project.'); 
    }
    await this.projectRepository.update({ id: projectId }, payload);
    return await this.getProjectById(projectId);
  }

  async delete(userId: number, projectId: number): Promise<any> {
    const project = await this.projectRepository
                              .createQueryBuilder('project')
                              .leftJoinAndSelect('project.company', 'company')
                              .leftJoinAndSelect('company.owner', 'owner')
                              .where('project.id = :id')
                              .setParameter('id', projectId)
                              .getOne();                                                   
    if (project.company.owner.id !== userId) {
      throw new UnauthorizedException('User only authorized to make changes to his/her/their/shis/xis project.'); 
    }
    return await this.projectRepository.delete(projectId);;
  }
}
