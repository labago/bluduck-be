import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import { ConfigService } from 'modules/config';
import { Email } from './email.entity';
import { Repository } from 'typeorm';
import { Hash } from '../../utils/Hash';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from 'modules/user';

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
                html: `<p>You have been added to a company and can now log in to begin creating projects and tasks. If you received this email in error, please ignore. Thank you, <br /><br /> The BluDuck Team`
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
                subject: `Welcome! You have been added to task ${taskName}`,
                text: '',
                html: `<p>You have been added to a task and can log in to review. If you received this email in error, please ignore. Thank you, <br /><br /> The BluDuck Team`
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
                html: `<p>Forgotten your password? Not a problem, <a href="${this.host}/forgotPassword?token=${hash}&email=${recipient}">click here</a> to reset your password. If you received this email in error, please ignore. Thank you, <br /><br /> The BluDuck Team`
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
