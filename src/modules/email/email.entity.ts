import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, BeforeInsert } from 'typeorm';

@Entity({
  name: 'email',
})
export class Email {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ length: 255 })
  hash: string;

  @Column({ length: 255 })
  email: string;

  @CreateDateColumn({ nullable: true, type: 'timestamp', default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date;
}
