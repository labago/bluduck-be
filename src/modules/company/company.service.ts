import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Company } from './company.entity';
import { CompanyDto } from './dto/company.dto';
import { UserDto } from '../user/dto'
import { UserService } from '../user/user.service';
import { CompanyCreateDto } from './dto/company.create.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly userService: UserService
  ) {}

  async get(id: number) {
    return this.companyRepository.findOne(id);
  }

  // async getAllTodo(): Promise<TodoDto[]> {
  //   const todos = await this.todoRepo.find({ relations: ['tasks', 'owner'] });
  //   return todos.map(todo => toTodoDto(todo));
  // }

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

  // async patch(payload: UserFillableFields) {
  //   return this.getByEmail(payload.email);
  //   const user = await this.getByEmail(payload.email);

  //   if (user) {
  //     throw new NotAcceptableException(
  //       'User with provided email already created.',
  //     );
  //   }

  //   return await this.userRepository.save(this.userRepository.create(payload));
  // }
}
