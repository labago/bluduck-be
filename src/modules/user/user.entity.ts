import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { PasswordTransformer } from './password.transformer';
import { Company } from '../company/company.entity';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  firstName: string;

  @Column({ length: 255 })
  lastName: string;

  @Column({ length: 255 })
  email: string;

  @Column({nullable: true, length: 255 })
  phoneNumber: string;

  @Column({ nullable: true, length: 255, default: "#000000"  })
  avatarColor: string;

  @Column({ nullable: true, length: 255 })
  role: string;

  @Column({nullable: true})
  companyLimit: number;
  
  @Column({nullable: true})
  projectLimit: number;

  @Column({nullable: true})
  taskLimit: number;

  @Column({
    name: 'password',
    length: 255,
    transformer: new PasswordTransformer(),
  })
  @Exclude({ toPlainOnly: true })
  password: string;

  // exclude password when retrieving model
  toJSON() {
    const { password, ...self } = this;
    return self;
  }

  @OneToMany(type => Company, company => company.owner)
  companies: Company[];

  @CreateDateColumn({ nullable: true, type: 'timestamp', default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date;
}
