import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';

import { Company } from './company.entity';
import { CompanyDto } from './dto/company.dto';
import { UserDto, UserPatchDto } from '../user/dto'
import { UserService } from '../user/user.service';
import { CompanyCreateDto } from './dto/company.create.dto';
import { CompanyPatchDto } from './dto/company.patch.dto';
import { CompanyInviteDto } from './dto/company.invite.dto';
import { EmailService } from 'modules/email';
import { UserRoleEnum } from 'modules/user';

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
      relations: ["owner", "projects", "projects.users", "users"]
    });
  }

  async getCompanyWithProjects(companyId: number, user: UserDto): Promise<Company> {
    const company = await this.getCompanyById(companyId);
    const userFound = await company.users.filter(u => u.id === user.id)[0];
    if (!userFound) {
      throw new UnauthorizedException('Must be member of company to view projects.'); 
    }
    return company;
  }

  async getAllCompanies({ id }: UserDto): Promise<any> {    
    return await this.companyRepository.find();
  }

  async getAllCompaniesByUser({ id }: UserDto): Promise<any> {
    const user = await this.userService.get(id);
    const companies = await this.companyRepository.find({ relations:['users', 'projects', 'projects.users'] });
    let companyList = [];
    companies.forEach(company => {
      const user = company.users.filter(user => user.id === id);
      if (user.length > 0) {
        companyList.push(company);
      }
    });
    
    return user;
  }

  async invite(ownerId: number, payload: CompanyInviteDto): Promise<any> {
    const company = await this.getCompanyById(payload.companyId);

    if (company.owner.id !== ownerId) {
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

    if (ownerId === user.id) {
      throw new BadRequestException(
        'Owner cannot invite self to company.',
      );
    }

    if (!user.isVerified) {
      throw new BadRequestException(
        'User needs to be registered and verified to join company.',
      );
    }
    
    if (company.users.filter(u => u.id === user.id).length !== 0) {
      throw new BadRequestException(
        'User already exists in company.',
      );
    }

    const userPatchDto = new UserPatchDto();
    userPatchDto.company = company;
    await this.userService.patch(user.id, userPatchDto);

    await getConnection()
            .createQueryBuilder()
            .relation(Company, 'users')
            .of(company)
            .add(user);
            
    await this.emailService.sendCompanyInviteNotification(payload.email, company.companyName);
    
    return { status: 200, success: 'Successfully invited user to company.'};
  }

  async create({ id }: UserDto, payload: CompanyCreateDto): Promise<any> {
    const { companyName } = payload;
    const user = await this.userService.get(id);
    if (!user) {
      throw new NotFoundException(
        'User not found. Could not create company. Beep boop.',
      );
    }

    const owner = await this.userService.get(payload.ownerId);
  
    const company = await this.companyRepository.save(
                            this.companyRepository.create({
                              companyName,
                              owner,
                              userLimit: payload.userLImit,
                              projectLimit: payload.projectLimit,
                              taskLimit: payload.taskLimit
                            }));
    await getConnection()
            .createQueryBuilder()
            .relation(Company, 'users')
            .of(company)
            .add(owner); 
    const userPatchDto = new UserPatchDto();
    userPatchDto.company = company;                            
    await this.userService.patch(owner.id, userPatchDto);
    return { status: 200, message: 'Successfully added owner to company.'}  
  }

  async patch(req: any, companyId, payload: CompanyPatchDto): Promise<any> {
    const user = await this.userService.get(req.user.id);
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
