import { IsDate } from 'class-validator';
import { Company } from '../company/company.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Task } from 'modules/task/task.entity';
import { User } from 'modules/user/user.entity';

@Entity({
  name: 'project',
})
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 255 })
  projectName: string;

  @Column({ nullable: true})
  @IsDate()
  dueDate: Date;

  @Column({ nullable: true})
  @IsDate()
  latestUpdate: Date;

  @ManyToOne(type => Company, company => company.projects, { onDelete: 'CASCADE' })
  company: Company;

  @OneToMany(type => Task, task => task.project)
  tasks?: Task[];

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];

  @CreateDateColumn({ nullable: true, type: 'timestamp', default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date;
}
