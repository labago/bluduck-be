import { Project } from 'modules/project/project.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
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
  owner: User;

  @OneToMany(type => Project, project => project.company)
  projects?: Project[];  

  @Column({ nullable: true })
  userLimit: number;

  @Column({ nullable: true })
  projectLimit: number;

  @Column({ nullable: true })
  taskLimit: number;

  @CreateDateColumn({ nullable: true, type: 'timestamp', default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date;

  @ManyToMany(() => User)
  users?: User[];
}
