import { Injectable, NotFoundException, NotAcceptableException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';

import { User } from './user.entity';
import { UserPatchDto} from './dto/user.patch.dto';
import { EmailService } from 'modules/email/email.service';
import { UserRolePatchDto } from './dto/userRole.patch.dto';
import { UserPatchInternalDto } from './dto/user.patch.internal.dto';
import { UserCredentialsDto } from './dto/user.credentials.dto';
import { UserDto } from './dto/user.dto';
import { generate } from 'generate-password';
import { Company } from 'modules/company/company.entity';
import { UserCreateNewDto } from './dto/user.createNew.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly emailService: EmailService
  ) {}

  async get(id: number): Promise<User>  {
    return await this.userRepository.findOne(id, { relations: ['companies'] });
  }

  async getOwner(id: number): Promise<User>  {
    return await this.userRepository.findOne(id);
  }

  async getAllUsers(): Promise<User[]>  {
    return await this.userRepository.find({ relations: ['companies']});
  }

  async getByEmail(email: string): Promise<User> {
    return await this.userRepository
      .createQueryBuilder('users')
      .where('users.email = :email')
      .setParameter('email', email)
      .getOne();
  }

  async getByEmailForLogin(email: string): Promise<User> {
    return await this.userRepository
      .createQueryBuilder('users')
      .addSelect('users.password')
      .where('users.email = :email')
      .setParameter('email', email)
      .getOne();
  }

  async getByIdForLogin(id: number): Promise<User> {
    return await this.userRepository
      .createQueryBuilder('users')
      .addSelect('users.password')
      .where('users.id = :id')
      .setParameter('id', id)
      .getOne();
  }

  async create(payload: UserCredentialsDto) {
    const user = await this.getByEmail(payload.email);
    if (user) {
    throw new NotAcceptableException(
        'User with provided email already exists.',
      );
    }
    const newUser = await this.userRepository.create(payload);
    await this.emailService.sendVerificationEmail(newUser);
    return await this.userRepository.save(newUser);
  }

  async delete(id: number) {
    await this.userRepository.delete(id);
    return { status: 200, message: 'Sucessfully deleted user.'};
  }

  async createUser(email: string, company: Company) {
    const user = await this.getByEmail(email);
    if (user) {
    throw new NotAcceptableException(
        'User with provided email already exists.',
      );
    }
    const password = generate({
      length: 10,
      numbers: true
    });
    let payload = new UserCreateNewDto();
    payload.email = email;
    payload.password = password;
    payload.firstName = 'TempFirstName';
    payload.lastName = 'TempLastName';
    payload.isVerified = true;
    const newUser = await this.userRepository.create(payload);
    await this.userRepository.save(newUser);
    
    await getConnection()
              .createQueryBuilder()
              .relation(Company, 'users')
              .of(company)
              .add(newUser);
    await this.emailService.sendCompanyInviteNewUser(payload, company.companyName);
    return { status: 200, message: 'Successfully invited new user to company.' }
  }

  async patch(userId: number, payload: UserPatchDto): Promise<UserDto> {
    const user = await this.get(userId);
    if (!user) {
      throw new NotFoundException(
        'No user exists.',
      );
    }

    const { id } = user;    
    await this.userRepository.update({ id }, payload);
    const newUser = await this.get(id);
    return newUser;
  }

  async patchInternal(userId: number, payload: UserPatchInternalDto): Promise<UserDto> {
    const user = await this.get(userId);
    if (!user) {
      throw new NotFoundException(
        'No user exists.',
      );
    }

    const { id } = user;    
    await this.userRepository.update({ id }, payload);
    const newUser = await this.get(id);
    return newUser;
  }

  async patchRole(userId: number, payload: UserRolePatchDto): Promise<UserDto> {
    const user = await this.get(userId);
    if (!user) {
      throw new NotFoundException(
        'No user exists.',
      );
    }

    const { id } = user;    
    await this.userRepository.update({ id }, payload);
    const newUser = await this.get(id);
    return newUser;
  }

  async updatePassword(userId: number, newPassword: string): Promise<any> {
    await this.userRepository.update({ id: userId }, { password: newPassword });
    return { status: 200, message: 'Password successfuly updated.' };
  }

  async verifyUser(email: string): Promise<any> {
    return await this.userRepository.update({ email }, { isVerified: true });
  }
}
