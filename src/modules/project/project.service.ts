import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Project } from './project.entity';
import { UserDto } from '../user/dto'
import { CompanyCreateDto } from './dto/project.create.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>
  ) {}

  async get(id: number): Promise<any> {
    return this.projectRepository.findOne(id);
  }

  async getAllCompaniesForOwner({ id }: UserDto): Promise<any> {
    return await this.projectRepository.find({
      where: { owner: id }
    });
  }

  async create({ id }: UserDto, payload: CompanyCreateDto): Promise<any> {
    // const { companyName } = payload;
    // const owner = await this.userService.get(id);
    // if (!owner) {
    //   throw new NotFoundException(
    //     'User not found. Could not create company. Beep boop.',
    //   );
    // }
    // return await this.projectRepository.save(
    //   this.projectRepository.create({
    //     companyName,
    //     owner
    //   }));
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
