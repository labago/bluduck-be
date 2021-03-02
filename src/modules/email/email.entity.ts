import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, BeforeInsert } from 'typeorm';

export enum EmailCode {
  VERIFY_USER,
  FORGOT_PASSWORD
}

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

  @Column({ enum: EmailCode, default: () => EmailCode.VERIFY_USER })
  emailCode: EmailCode;

  @CreateDateColumn({ nullable: true, type: 'timestamp', default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date;
}
