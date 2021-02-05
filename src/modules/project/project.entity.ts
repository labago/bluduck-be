import { IsDate } from 'class-validator';
import { Company } from 'modules/company';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';

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
  company?: Company;

  @CreateDateColumn({ nullable: true, type: 'timestamp', default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date;
}
