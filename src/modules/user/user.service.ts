import { Injectable, NotFoundException, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';
import { UserPatchDto, UserCredentialsDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async get(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: ['companies']
    });
  }

  async getByEmail(email: string) {
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

    return await this.userRepository.save(this.userRepository.create(payload));
  }

  async patch(userId: number, payload: UserPatchDto): Promise<User> {
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
}
