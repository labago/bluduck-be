import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { ProjectCreateDto } from './dto/project.create.dto';
import { CompanyService } from '../company/company.service';
import { ProjectDto } from './dto/project.dto';
import { ProjectPatchDto } from './dto/project.patch.dto';
import { UserRoleEnum } from 'modules/user/user.entity';
import { UserRole } from 'modules/common/userRole/userRole.decorator';

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
    const userFoundInCompany = await company.users.filter(u => u.id === userId);
    if (userFoundInCompany.length <= 0 && userFoundInCompany[0].userRole !== UserRoleEnum.ADMIN) {
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
    const managerFoundInCompany = await company.users.filter(u => u.id === userId);
    
    if (managerFoundInCompany.length <= 0 && managerFoundInCompany[0].userRole !== UserRoleEnum.ADMIN) {
      throw new BadRequestException(
        'Must belong to company to create a project.',
      );
    }

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
    await this.projectRepository.update({ id: projectId }, payload);
    return await this.getProjectById(projectId);
  }

  async delete(userId: number, projectId: number): Promise<any> {
    const project = await this.projectRepository.findOne({ id: projectId }, { relations: ['company', 'company.users'] });     
    const managerFoundInCompany = project.company.users.filter(u => u.id === userId);

    if (managerFoundInCompany.length <= 0 && managerFoundInCompany[0].userRole !== UserRoleEnum.ADMIN) {
      throw new BadRequestException(
        'Must belong to company to delete project.',
      );
    }                                                        
    await this.projectRepository.delete(projectId);
    return { status: 200, message: 'Successfully deleted project.'};
  }
}
