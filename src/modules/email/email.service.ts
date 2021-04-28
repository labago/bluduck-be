import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import { ConfigService } from 'modules/config/config.service';
import { Email } from './email.entity';
import { Repository } from 'typeorm';
import { Hash } from '../../utils/Hash';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from 'modules/user/dto/user.dto';
import { TaskStatus } from 'modules/task/task.entity';
import { InjectSendGrid, SendGridService } from '@ntegral/nestjs-sendgrid';

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(Email)
    private readonly emailRepository: Repository<Email>,
    private readonly configService: ConfigService,
    @InjectSendGrid() private readonly sgMailService: SendGridService
  ) {}

    // Default configs
    private fromAddy = 'no-reply@bluduck.io';
    private transporter = createTransport({
        host: process.env.SMTP_HOST || this.configService.get('SMTP_HOST'),
        port: process.env.SMTP_PORT || this.configService.get('SMTP_PORT'),
        secure: process.env.SMTP_SECURE || this.configService.get('SMTP_SECURE') || true,
        auth: {
            user: process.env.SMTP_USER || this.configService.get('SMTP_USER'),
            pass: process.env.SMTP_PASS || this.configService.get('SMTP_PASS')
        }
      });
    private host = process.env.URL_HOST || this.configService.get('URL_HOST');

    async sendVerificationEmail(recipient: UserDto): Promise<any> {
        try {
            const templateId = 'd-af199b11ee0642158a2f4d607e8e3312';
            
            const hash = Hash.make(recipient.email);
            const email = this.emailRepository.create({
                email: recipient.email,
                hash
            });

            const payload = {
                verifyLink: `${this.host}/verify?token=${hash}&email=${recipient.email}`
            }

            const msg = {
                to:  recipient.email || this.fromAddy,
                from: process.env.VERIFY_EMAIL_FROM || this.fromAddy,
                templateId: templateId,
                dynamic_template_data: payload
              };

            const result = await this.sgMailService.send(msg);
            await this.emailRepository.save(email);           
            return result;
        } catch(e) {
            throw new BadRequestException(e);
        }
    }

    async sendCompanyInviteNotification(recipient: string, companyName: string): Promise<any> {
        try {
            const templateId = 'd-d96772e480ad47b2bcb8a9a175bbda4a';
            const payload = {
                companyName,
                verifyLink: `${this.host}/edit-profile`
            }

            const msg = {
                to:  recipient || this.fromAddy,
                from: process.env.VERIFY_EMAIL_FROM || this.fromAddy,
                templateId: templateId,
                dynamic_template_data: payload
              };
            const result = await this.sgMailService.send(msg);
            return result;
        } catch(e) {
            throw new BadRequestException(e);
        }
    }

    async sendCompanyInviteNewUser(recipient: any, companyName: string): Promise<any> {
        try {
            const templateId = 'd-8f12a7bcb415488cb0dd3396027b5149';
            const payload = {
                companyName,
                email: recipient.email,
                password: recipient.password,
                verifyLink: `${this.host}/edit-profile`
            }
            
            const msg = {
                to:  recipient || this.fromAddy,
                from: process.env.VERIFY_EMAIL_FROM || this.fromAddy,
                templateId: templateId,
                dynamic_template_data: payload
              };
            const result = await this.sgMailService.send(msg);
            return result;
        } catch(e) {
            throw new BadRequestException(e);
        }
    }

    async sendCompanyOwnerNotification(recipient: string, companyName: string): Promise<any> {
        try {
            const templateId = 'd-d9357b556fd740f7b5627e0fa2218626';
            const payload = {
                companyName,
                verifyLink: `${this.host}/login`
            }

            const msg = {
                to:  recipient || this.fromAddy,
                from: process.env.VERIFY_EMAIL_FROM || this.fromAddy,
                templateId: templateId,
                dynamic_template_data: payload
              };
            const result = await this.sgMailService.send(msg);
            return result;
        } catch(e) {
            throw new BadRequestException(e);
        }
    }

    async sendTaskInviteNotification(recipient: string, taskName: string): Promise<any> {
        try {
            const templateId = 'd-a0f3269250444a718e045eebd5b6784b';
            const payload = {
                taskName,
                verifyLink: `${this.host}/login`
            }

            const msg = {
                to:  recipient || this.fromAddy,
                from: process.env.VERIFY_EMAIL_FROM || this.fromAddy,
                templateId: templateId,
                dynamic_template_data: payload
              };
            const result = await this.sgMailService.send(msg);
            return result;
        } catch(e) {
            throw new BadRequestException(e);
        }
    }

    async sendTaskRemoveNotification(recipient: string, taskName: string): Promise<any> {
        try {
            const templateId = 'd-f1de12cf061040e59a588fe93b0b00a4';
            const payload = {
                taskName
            }

            const msg = {
                to:  recipient || this.fromAddy,
                from: process.env.VERIFY_EMAIL_FROM || this.fromAddy,
                templateId: templateId,
                dynamic_template_data: payload
              };
            const result = await this.sgMailService.send(msg);
            return result;
        } catch(e) {
            throw new BadRequestException(e);
        }
    }

    async sendTaskUpdateNotification(recipient: string, taskName: string, taskId: number, taskStatus: TaskStatus, projectId: number): Promise<any> {
        try {
            const templateId = 'd-701c7f475f2e4a4c9b587a8f28fc6005';
            const payload = {
                taskName,
                taskStatus: `${taskStatus === TaskStatus.DONE ? 'DONE' : 'HELP'}`,
                link: `${this.host}/project/${projectId}?taskId=${taskId}`
            }
            const msg = {
                to:  recipient || this.fromAddy,
                from: process.env.VERIFY_EMAIL_FROM || this.fromAddy,
                templateId: templateId,
                dynamic_template_data: payload
              };
            const result = await this.sgMailService.send(msg);
            return result;
        } catch(e) {
            throw new BadRequestException(e);
        }
    }

    async sendForgotPasswordEmail(recipient: string): Promise<any> {
        try {
            const hash = Hash.make(recipient);
            const email = this.emailRepository.create({
                email: recipient,
                hash
            });

            const templateId = 'd-8936a6b727344a149a357d7979c15be1';
            const payload = {
                link: `${this.host}/reset?token=${hash}&email=${recipient}`
            } 
            await this.emailRepository.save(email);
            const msg = {
                to:  recipient || this.fromAddy,
                from: process.env.VERIFY_EMAIL_FROM || this.fromAddy,
                templateId: templateId,
                dynamic_template_data: payload
              };
            const result = await this.sgMailService.send(msg);
            return result;
        } catch(e) {
            throw new BadRequestException(e);
        }
    }

    async delete(email: string): Promise<any> {                                     
        return await this.emailRepository.delete({ email });
    }  

    async getHashByEmail(email: string): Promise<Email[]> {
        return await this.emailRepository.find({ email });
    }
}
