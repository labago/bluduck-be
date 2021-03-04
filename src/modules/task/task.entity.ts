import { Exclude } from 'class-transformer';
import { IsDate } from 'class-validator';
import { Project } from 'modules/project/project.entity';
import { User } from 'modules/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, BeforeInsert, ManyToOne, JoinTable, ManyToMany } from 'typeorm';

export enum TaskStatus {
  TODO,
  IN_PROGRESS,
  DONE,
  BLOCK 
}

@Entity({
  name: 'task',
})
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  taskTitle: string;

  @Column({ nullable: false})
  @IsDate()
  date: Date;

  @Column({ nullable: false, enum: TaskStatus, default: () => TaskStatus.TODO })
  status: TaskStatus;

  @ManyToOne(type => Project, project => project.tasks, { onDelete: 'CASCADE' })
  project: Project;

  @ManyToOne(type => User)
  owner: User;

  @ManyToMany(() => User, { cascade: true })
  @JoinTable()
  users: User[];

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn({ nullable: true, type: 'timestamp', default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date;
}
