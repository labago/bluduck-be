import { Project } from 'modules/project/project.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../user/user.entity'

@Entity({
  name: 'company',
})
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  companyName: string;

  @ManyToOne(type => User, user => user.companies, { onDelete: 'CASCADE' })
  owner?: User;

  @OneToMany(type => Project, project => project.company)
  projects?: Project[];  
  
  @CreateDateColumn({ nullable: true, type: 'timestamp', default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date;
}
