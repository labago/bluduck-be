import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, BeforeInsert } from 'typeorm';

import { Company } from '../company/company.entity';

@Entity({
  name: 'email',
})
export class Email {
  
  @Column({ length: 255 })
  hash: string;

  @Column()
  userId: number;

  @CreateDateColumn({ nullable: true, type: 'timestamp', default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date;
}
