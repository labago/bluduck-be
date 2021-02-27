import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';

import { Company } from './company.entity';
import { CompanyDto } from './dto/company.dto';
import { UserDto } from '../user/dto'
import { UserService } from '../user/user.service';
import { CompanyCreateDto } from './dto/company.create.dto';
import { CompanyPatchDto } from './dto/company.patch.dto';
import { CompanyInviteDto } from './dto/company.invite.dto';
import { EmailService } from 'modules/email';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly userService: UserService,
    private readonly emailService: EmailService
  ) {}

  async getCompanyById(id: number): Promise<Company> {
    return await this.companyRepository.findOne({
      where: { id },
      relations: ["owner", "projects", "users"]
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

  async invite(userId: number, payload: CompanyInviteDto): Promise<any> {
    const company = await this.companyRepository.findOne(payload.companyId, { relations: ["owner", "users"]});
    
    if (company.owner.id !== userId) {
      throw new BadRequestException(
        'Must be owner to invite.',
      );
    }

    const user = await this.userService.getByEmail(payload.email);
    if (!user) {
      throw new BadRequestException(
        'User needs to be registered and verified to join company.',
      );
    }

    if (userId === user.id) {
      throw new BadRequestException(
        'Owner cannot invite self to company.',
      );
    }

    if (!user.isVerified) {
      throw new BadRequestException(
        'User needs to be registered and verified to join company.',
      );
    }

    if (company.users.filter(user => user.id === userId)) {
      throw new BadRequestException(
        'User already exists in company.',
      );
    }

    await getConnection()
            .createQueryBuilder()
            .relation(Company, 'users')
            .of(company)
            .add(user);
    const result = await this.emailService.sendCompanyInviteNotification(payload.email, company.companyName);
    return result;
  }

  async create({ id }: UserDto, payload: CompanyCreateDto): Promise<any> {
    const { companyName } = payload;
    const user = await this.userService.get(id);
    if (!user) {
      throw new NotFoundException(
        'User not found. Could not create company. Beep boop.',
      );
    }

    if (!user.isAdmin) {
      throw new NotFoundException(
        'User must be admin to create company.',
      );
    }

    try {
      const owner = await this.userService.get(payload.ownerId);
    
      const company = await this.companyRepository.save(
                              this.companyRepository.create({
                                companyName,
                                owner,
                                userLimit: payload.userLImit,
                                projectLimit: payload.projectLimit,
                                taskLimit: payload.taskLimit
                              }));
      return await getConnection()
                    .createQueryBuilder()
                    .relation(Company, 'users')
                    .of(company)
                    .add(owner);
    } catch (e) {
      
    }    
  }

  async patch(req: any, companyId, payload: CompanyPatchDto): Promise<any> {
    const user = await this.userService.get(req.user.id);
    if (!user.isAdmin) {
      throw new UnauthorizedException('Only admins may make changes to company.'); 
    }
    // const company = await this.companyRepository
    //                           .createQueryBuilder('company')
    //                           .leftJoinAndSelect('company.owner', 'owner')
    //                           .where('company.id = :id')
    //                           .setParameter('id', companyId)
    //                           .getOne();
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
