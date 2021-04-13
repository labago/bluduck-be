import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException, Param, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getConnection, Repository } from 'typeorm';

import { Company } from './company.entity';
import { UserDto } from '../user/dto/user.dto'
import { UserService } from '../user/user.service';
import { CompanyCreateDto } from './dto/company.create.dto';
import { CompanyPatchDto } from './dto/company.patch.dto';
import { CompanyInviteDto } from './dto/company.invite.dto';
import { EmailService } from 'modules/email/email.service';
import { User, UserRoleEnum } from 'modules/user/user.entity';
import { UserPatchInternalDto } from 'modules/user/dto/user.patch.internal.dto';
import { CompanyRemoveUserDto } from './dto/company.removeUser.dto';
import { Project } from 'modules/project/project.entity';
import { Task } from 'modules/task/task.entity';
import { TaskUpdateOwnerDto } from 'modules/task/dto/task.updateOwner.dto';
import { ProjectService } from 'modules/project/project.service';
import { TaskService } from 'modules/task/task.service';
import { CompanyPatchSetActiveStatusDto } from './dto/company.patch.setActiveStatusdto';
import { CompanyPatchOwnerDto } from './dto/company.patchOwner.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    @Inject(forwardRef(() => ProjectService)) private readonly projectService: ProjectService,
    @Inject(forwardRef(() => TaskService)) private readonly taskService: TaskService
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
    if (!userFound && user.userRole !== UserRoleEnum.ADMIN) {
      throw new UnauthorizedException('Must be member of company to view projects.'); 
    }
    return company;
  }

  async getAllCompanies({ id }: UserDto): Promise<any> {    
    return await this.companyRepository.find({ relations: ['owner'] });
  }

  async getAllCompaniesByOwner({ id }: UserDto): Promise<any> {
    const companies = await this.companyRepository.find({ relations:['owner', 'users', 'projects', 'projects.users'] });
    let companyList = [];
    companies.forEach(company => {
      const user = company.users.filter(user => user.id === id);
      if (user.length > 0) {
        companyList.push(company);
      }
    });
    
    return companyList;
  }

  async invite(userId: number, payload: CompanyInviteDto): Promise<any> {
    const company = await this.getCompanyById(payload.companyId);
    const userFoundInCompany = await company.users.filter(u => u.id === userId);
    
    if (company.owner.id !== userId && userFoundInCompany[0].userRole !== UserRoleEnum.MANAGER) {
      throw new BadRequestException(
        'Must be owner or manager to invite.',
      );
    }
    
    if (company.users.length >= company.userLimit || company.userLimit === 0) {
      throw new BadRequestException(
        'Company has reached its limit of users invited.'
      )
    }

    const user = await this.userService.getByEmail(payload.email);
    if (!user) {
      return await this.userService.createUser(payload.email, company);
    } else {
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
      
      if (company.users.filter(u => u.id === user.id).length !== 0) {
        throw new BadRequestException(
          'User already exists in company.',
        );
      }
  
      await getConnection()
              .createQueryBuilder()
              .relation(Company, 'users')
              .of(company)
              .add(user);
              
      await this.emailService.sendCompanyInviteNotification(payload.email, company.companyName);
    }    
    
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
    const companyExists = await this.companyRepository.findOne({companyName});
    
    if (companyExists) {
      throw new BadRequestException(
        'Company already exists. Try a different name.',
      );
    }
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
    const userPatchDto = new UserPatchInternalDto();
    if (owner.userRole !== UserRoleEnum.ADMIN) {
      userPatchDto.userRole = UserRoleEnum.MANAGER;                                               
      await this.userService.patchInternal(owner.id, userPatchDto);
    }

    await this.emailService.sendCompanyOwnerNotification(owner.email, company.companyName);
    return { status: 200, message: 'Successfully added owner to company.'}  
  }

  async patch(req: any, companyId, payload: CompanyPatchDto): Promise<any> {
    await this.companyRepository.update({ id: companyId }, payload);
    return await this.companyRepository.findOne(companyId);
  }

  async patchOwner(req: any, companyId, payload: CompanyPatchOwnerDto): Promise<any> {
    const owner = await this.userService.get(payload.ownerId);
    const company = await this.getCompanyById(companyId);
    if (company.users.filter(u => u.id === owner.id).length === 0) {
      await getConnection()
      .createQueryBuilder()
      .relation(Company, 'users')
      .of(company)
      .add(owner); 
    }    
    await this.companyRepository.update({ id: companyId }, { owner });
    return await this.companyRepository.findOne(companyId, { relations: ['owner'] });
  }

  async setActiveStatus(companyId, payload: CompanyPatchSetActiveStatusDto): Promise<any> {
    await this.companyRepository.update({ id: companyId }, payload);
    return await this.companyRepository.findOne(companyId);
  }

  async delete(req: any, id: number): Promise<any> {
    const user = await this.userService.get(req.user.id);
    const company = await this.companyRepository
                              .createQueryBuilder('company')
                              .leftJoinAndSelect('company.owner', 'owner')
                              .where('company.id = :id')
                              .setParameter('id', id)
                              .getOne();
    if (company.owner.id !== user.id && user.userRole !== UserRoleEnum.ADMIN) {
      throw new UnauthorizedException('User only authorized to make changes to their company.'); 
    }
    await this.companyRepository.delete({ id });
    return company;
  }

  async removeUser(userId: any, payload: CompanyRemoveUserDto): Promise<any> {
    try {
      const user = await this.userService.get(userId);
      const company = await this.getCompanyById(payload.companyId);
      const projects = await this.projectService.getProjects();
      const tasks = await this.taskService.getTasks();
      const userToBeRemoved = await this.userService.getByEmail(payload.email);

      
      const userFoundInCompany = await company.users.filter(u => u.email === user.email);
      if (userFoundInCompany.length <= 0 && user.userRole !== UserRoleEnum.ADMIN) {
        throw new BadRequestException(
          'Only authorized users may perform this action.',
        );
      }
  
      if (company.owner.email === payload.email) {
        throw new BadRequestException('Cannot remove company owner');
      }
      
      await this.removeUserFromTasks(userToBeRemoved, company, tasks);
  
      await this.removeUserFromProjects(userToBeRemoved, company, projects);
  
      await getConnection()
            .createQueryBuilder()
            .relation(Company, 'users')
            .of(company)
            .remove(userToBeRemoved);
      
      return { status: 200, message: 'Sucesssfully removed user from company.'};
    } catch (e) {
      throw new BadRequestException(e);
    }
    
  }

  private async removeUserFromTasks(user: User, company: Company, tasks: Task[]) {
    tasks.forEach(async task => {
      if (task.project.company.id === company.id) {
        if (task.owner.id === user.id) {
          let payload = new TaskUpdateOwnerDto();
          payload.owner = company.owner;
          await this.taskService.updateOwner(task.id, payload);
        }
        await getConnection()
          .createQueryBuilder()
          .relation(Task, 'users')
          .of(task)
          .remove(user);
      }
    });
  }

  private async removeUserFromProjects(user: User, company: Company, projects: Project[]) {
    projects.forEach(async project => {
      if (project.company.id === company.id) {
        await getConnection()
          .createQueryBuilder()
          .relation(Project, 'users')
          .of(project)
          .remove(user);
      }
    });
  }
}
