import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity'

@Entity({
  name: 'company',
})
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  companyName: string;

  @ManyToOne(type => User, user => user.companies)
  owner?: User;

  @CreateDateColumn({ nullable: true, type: 'timestamp', default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date;
}
