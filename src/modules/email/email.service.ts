import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import { ConfigService } from 'modules/config/config.service';
import { Email } from './email.entity';
import { Repository } from 'typeorm';
import { Hash } from '../../utils/Hash';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from 'modules/user/dto/user.dto';
import { TaskStatus } from 'modules/task/task.entity';

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(Email)
    private readonly emailRepository: Repository<Email>,
    private readonly configService: ConfigService
  ) {}

    // Default configs
    private fromAddy = '"noreply@bluduck.com" <bluduckmailer@gmail.com>';
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
            const hash = Hash.make(recipient.email);
            const email = this.emailRepository.create({
                email: recipient.email,
                hash
            });
            await this.emailRepository.save(email);
            const result = await this.transporter.sendMail({
                from: this.fromAddy,
                to: recipient.email,
                subject: 'Please verify your email',
                text: '',
                html: `<p>Welcome to BluDuck! If you received this email in error, please ignore. <a href="${this.host}/verify?token=${hash}&email=${recipient.email}">Click here to verify your account.</a>.</p> <br /> Thank you, <br /><br /> The BluDuck Team`
            });

            return result.messageId;
        } catch(e) {
            throw new BadRequestException(e);
        }
    }

    async sendCompanyInviteNotification(recipient: string, companyName: string): Promise<any> {
        try {
            const result = await this.transporter.sendMail({
                from: this.fromAddy,
                to: recipient,
                subject: `Welcome! You have been added to ${companyName}`,
                text: '',
                html: `<p>You have been added to a company and can now <a href="${this.host}/edit-profile">log in</a> to begin creating projects and tasks. If you received this email in error, please ignore. Thank you, <br /><br /> The BluDuck Team`
            });
            return result.messageId;
        } catch(e) {
            throw new BadRequestException(e);
        }
    }

    async sendCompanyInviteNewUser(recipient: any, companyName: string): Promise<any> {
        try {
            const result = await this.transporter.sendMail({
                from: this.fromAddy,
                to: recipient.email,
                subject: `Welcome! You have been added to ${companyName}`,
                text: '',
                html: `<p>You have been added to a company and can now <a href="${this.host}/edit-profile">log in</a> with the following credentials: <br /> Login: <b>${recipient.email}</b> <br /> Password: <b>${recipient.password}</b> <br /> <br /> If you received this email in error, please ignore. Thank you, <br /><br /> The BluDuck Team`
            });
            return result.messageId;
        } catch(e) {
            throw new BadRequestException(e);
        }
    }

    async sendCompanyOwnerNotification(recipient: string, companyName: string): Promise<any> {
        try {
            const result = await this.transporter.sendMail({
                from: this.fromAddy,
                to: recipient,
                subject: `Welcome! You have been made owner of ${companyName}`,
                text: '',
                html: `<p>You have been made owner of a company and can now log in to begin creating projects and tasks. If you received this email in error, please ignore. Thank you, <br /><br /> The BluDuck Team`
            });
            return result.messageId;
        } catch(e) {
            throw new BadRequestException(e);
        }
    }

    async sendTaskInviteNotification(recipient: string, taskName: string): Promise<any> {
        try {
            const result = await this.transporter.sendMail({
                from: this.fromAddy,
                to: recipient,
                subject: `You have been added to task "${taskName}"`,
                text: '',
                html: `<p>You have been added to a task "${taskName}" and can <a href="${this.host}/login">log in</a> to view task. If you received this email in error, please ignore. Thank you, <br /><br /> The BluDuck Team`
            });
            return result.messageId;
        } catch(e) {
            throw new BadRequestException(e);
        }
    }

    async sendTaskRemoveNotification(recipient: string, taskName: string): Promise<any> {
        try {
            const result = await this.transporter.sendMail({
                from: this.fromAddy,
                to: recipient,
                subject: `You have been removed from task ${taskName}`,
                text: '',
                html: `<p>You have been removed from task ${taskName}. If you received this email in error, please ignore. Thank you, <br /><br /> The BluDuck Team`
            });
            return result.messageId;
        } catch(e) {
            throw new BadRequestException(e);
        }
    }

    async sendTaskUpdateNotification(recipient: string, taskName: string, taskId: number, taskStatus: TaskStatus, projectId: number): Promise<any> {
        try {
            const result = await this.transporter.sendMail({
                from: this.fromAddy,
                to: recipient,
                subject: `${taskName} task has been updated to ${taskStatus === TaskStatus.DONE ? 'DONE' : 'HELP'}`,
                text: '',
                html: `<p>${taskName} task has been updated ${taskStatus === TaskStatus.DONE ? 'DONE' : 'HELP'}. Click <a href="${this.host}/project/${projectId}?taskId=${taskId}">here</a> to view task update. If you received this email in error, please ignore. Thank you, <br /><br /> The BluDuck Team`
            });
            return result.messageId;
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
            await this.emailRepository.save(email);
            const result = await this.transporter.sendMail({
                from: this.fromAddy,
                to: recipient,
                subject: `Forgot password request`,
                text: '',
                html: `<p>Forgotten your password? Not a problem, <a href="${this.host}/reset?token=${hash}&email=${recipient}">click here</a> to reset your password. If you received this email in error, please ignore. Thank you, <br /><br /> The BluDuck Team`
            });
            return result.messageId;
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
