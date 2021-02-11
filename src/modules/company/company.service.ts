import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Company } from './company.entity';
import { CompanyDto } from './dto/company.dto';
import { UserDto } from '../user/dto'
import { UserService } from '../user/user.service';
import { CompanyCreateDto } from './dto/company.create.dto';
import { CompanyPatchDto } from './dto/company.patch.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly userService: UserService
  ) {}

  async get(id: number): Promise<Company> {
    return await this.companyRepository.findOne({
      where: { id },
      relations: ["owner", "projects"]
    });
  }

  async getCompanyWithProjects(companyId: number, user: UserDto): Promise<Company> {
    const company = await this.companyRepository
                              .createQueryBuilder('company')
                              .leftJoinAndSelect('company.owner', 'owner')
                              .where('company.id = :id')
                              .setParameter('id', companyId)
                              .getOne();
    console.log(company);
    if (company.owner.id !== user.id) {
      throw new UnauthorizedException('Must be owner to view projects of company.'); 
    }
    return await this.companyRepository.findOne({
      where: { id: companyId },
      relations: ["projects"]
    });
  }


  async getAllCompaniesForOwner({ id }: UserDto): Promise<CompanyDto[]> {
    return await this.companyRepository.find({
      where: { owner: id }
    });
  }

  async create({ id }: UserDto, payload: CompanyCreateDto): Promise<any> {
    const { companyName } = payload;
    const owner = await this.userService.get(id);
    if (!owner) {
      throw new NotFoundException(
        'User not found. Could not create company. Beep boop.',
      );
    }
    return await this.companyRepository.save(
      this.companyRepository.create({
        companyName,
        owner
      }));
  }

  async patch(req: any, companyId, payload: CompanyPatchDto): Promise<any> {
    const company = await this.companyRepository
                              .createQueryBuilder('company')
                              .leftJoinAndSelect('company.owner', 'owner')
                              .where('company.id = :id')
                              .setParameter('id', companyId)
                              .getOne();
    if (company.owner.id !== req.user.id) {
      throw new UnauthorizedException('User only authorized to make changes to his/her/their/shis/xis company.'); 
    }
    await this.companyRepository.update({ id: companyId }, payload);
    return await this.companyRepository.findOne(companyId);
  }

  async delete(req: any, id: number): Promise<any> {
    const company = await this.companyRepository
                              .createQueryBuilder('company')
                              .leftJoinAndSelect('company.owner', 'owner')
                              .where('company.id = :id')
                              .setParameter('id', id)
                              .getOne();
    if (company.owner.id !== req.user.id) {
      throw new UnauthorizedException('User only authorized to make changes to his/her/their/shis/xis company.'); 
    }
    await this.companyRepository.delete({ id });
    return company;
  }
}
