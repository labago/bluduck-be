import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, BeforeInsert, ManyToOne, ManyToMany } from 'typeorm';
import { PasswordTransformer } from './password.transformer';
import { Company } from '../company/company.entity';

export enum UserRoleEnum {
  USER,
  MANAGER,
  ADMIN
}

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, length: 255 })
  firstName: string;

  @Column({ nullable: true, length: 255 })
  lastName: string;

  @Column({ length: 255 })
  email: string;

  @Column({nullable: true, length: 255 })
  phoneNumber: string;

  @Column({ nullable: true, length: 255, default: "#000000"  })
  avatarColor: string;

  @Column({ nullable: true, length: 255 })
  role: string;

  @Column({ nullable: false, default: false })
  isVerified: boolean;
  
  @Column({
    name: 'password',
    length: 255,
    transformer: new PasswordTransformer(),
    select: false
  })
  @Exclude({ toPlainOnly: true })
  password: string;

  @ManyToMany(type => Company, company => company.users)
  companies: Company[];

  @Column({ nullable: false, enum: UserRoleEnum, default: () => UserRoleEnum.USER })
  userRole: UserRoleEnum;

  @CreateDateColumn({ nullable: true, type: 'timestamp', default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date;
}
