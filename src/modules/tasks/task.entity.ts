import { IsDate, IsEnum } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, BeforeInsert } from 'typeorm';
import { Project } from 'modules/project';
import { User } from 'modules/user';

enum TaskStatus {
  TODO,
  IN_PROGRESS,
  DONE,
  BLOCKED
}

@Entity({
  name: 'task',
})
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 255 })
  taskTitle: string;

  @Column({ nullable: false})
  @IsDate()
  dueDate: Date;

  @Column({ type: 'int', default: () => TaskStatus.TODO })
  status: TaskStatus;

  @ManyToOne(type => Project, project => project.tasks, { onDelete: 'CASCADE' })
  project: Project;

  owner: User;
  
  users: User[];

  @CreateDateColumn({ nullable: true, type: 'timestamp', default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date;
}
