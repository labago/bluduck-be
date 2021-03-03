import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, BeforeInsert, ManyToOne } from 'typeorm';
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

  @Column({ nullable: true})
  isVerified: boolean;
  
  @BeforeInsert()
  defaultisVerifiedValue() {
    this.isVerified = false;
  }

  @Column({
    name: 'password',
    length: 255,
    transformer: new PasswordTransformer(),
  })
  @Exclude({ toPlainOnly: true })
  password: string;

  @ManyToOne(type => Company, company => company.projects)
  company: Company;

  // exclude password when retrieving model
  toJSON() {
    const { password, ...self } = this;
    return self;
  }

  @Column({nullable: false, default: false})
  isAdmin: boolean;

  @CreateDateColumn({ nullable: true, type: 'timestamp', default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date;
}
