import { Injectable, NotFoundException, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';
import { UserPatchDto, UserCredentialsDto, UserDto } from './dto';
import { EmailService } from 'modules/email/email.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly emailService: EmailService
  ) {}

  async get(id: number): Promise<User>  {
    return this.userRepository.findOne(id, { relations: ['company'] });
  }

  async getByEmail(email: string): Promise<User> {
    return await this.userRepository
      .createQueryBuilder('users')
      .where('users.email = :email')
      .setParameter('email', email)
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

  async updatePassword(userId: number, newPassword: string): Promise<any> {
    await this.userRepository.update({ id: userId }, { password: newPassword });
    return { status: 200, message: 'Password successfuly updated.' };
  }

  async verifyUser(email: string): Promise<any> {
    return await this.userRepository.update({ email }, { isVerified: true });
  }
}
