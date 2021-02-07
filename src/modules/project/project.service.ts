import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { ProjectCreateDto } from './dto/project.create.dto';
import { CompanyService } from '../company/company.service';
import { ProjectDto } from './dto/project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly companyService: CompanyService
  ) {}

  async getProjectsByCompany(userId: number, companyId: number): Promise<ProjectDto[]> {
    const company = await this.companyService.get(companyId);
    if (userId !== company.owner.id) {
      throw new NotFoundException('Only owner of company can retrieve projects.');
    }
    return this.projectRepository.createQueryBuilder('project')
                              .leftJoin('project.company', 'company')
                              .where('project.companyId = :id')
                              .setParameter('id', companyId)
                              .getMany();
  }

  async create(userId: number, companyId: number, payload: ProjectCreateDto): Promise<Project> {
    console.log(payload);
    const company = await this.companyService.get(companyId);
    if (company.owner.id !== userId) {
      throw new NotFoundException('Only owner of company can create projects.');
    }

    return await this.projectRepository.save(this.projectRepository.create({
      company,
      projectName: payload.projectName,
      dueDate: payload.dueDate,
      latestUpdate: payload.latestUpdate
    }));
  }

  // async patch(req: any, payload: CompanyDto): Promise<any> {
  //   const company = await this.projectRepository
  //                             .createQueryBuilder('company')
  //                             .leftJoinAndSelect('company.owner', 'owner')
  //                             .where('company.id = :id')
  //                             .setParameter('id', payload.id)
  //                             .getOne();
  //   if (company.owner.id !== req.user.id) {
  //     throw new UnauthorizedException('User only authorized to make changes to his/her/their/shis/xis company.'); 
  //   }
  //   await this.companyRepository.update({ id: payload.id }, payload);
  //   return await this.get(payload.id);
  // }

  // async delete(req: any, id: number): Promise<any> {
  //   const company = await this.companyRepository
  //                             .createQueryBuilder('company')
  //                             .leftJoinAndSelect('company.owner', 'owner')
  //                             .where('company.id = :id')
  //                             .setParameter('id', id)
  //                             .getOne();
  //   if (company.owner.id !== req.user.id) {
  //     throw new UnauthorizedException('User only authorized to make changes to his/her/their/shis/xis company.'); 
  //   }
  //   await this.companyRepository.delete({ id });
  //   return company;
  // }
}
