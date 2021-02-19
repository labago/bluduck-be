import { IsDate } from 'class-validator';
import { Company } from '../company/company.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
// import { Task } from 'modules/tasks/task.entity';
import { User } from 'modules/user';

@Entity({
  name: 'project',
})
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 255 })
  projectName: string;

  @Column({ nullable: false})
  @IsDate()
  dueDate: Date;

  @Column({ nullable: false})
  @IsDate()
  latestUpdate: Date;

  @ManyToOne(type => Company, company => company.projects, { onDelete: 'CASCADE' })
  company: Company;

  // @OneToMany(type => Task, task => task.project)
  // tasks?: Task[];

  users?: User[];

  @CreateDateColumn({ nullable: true, type: 'timestamp', default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date;
}
