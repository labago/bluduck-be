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
        host: this.configService.get('SMTP_HOST'),
        port: this.configService.get('SMTP_PORT'),
        secure: this.configService.get('SMTP_SECURE') || true,
        auth: {
            user: this.configService.get('SMTP_USER'),
            pass: this.configService.get('SMTP_PASS')
        }
      });
    private host = this.configService.get('URL_HOST');

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
                html: `<p>Welcome to BluDuck! If you received this email in error, please ignore. <a href="${this.host}/api/auth/verify?token=${hash}&email=${recipient.email}">Click here to verify your account.</a>.</p> <br /> Thank you, <br /><br /> The BluDuck Team`
            });

            return result.messageId;
        } catch(e) {
            throw new BadRequestException(e);
        }
    }

    async delete(email: string): Promise<any> {                                     
        return await this.emailRepository.delete({ email });
    }  

    async getHashByEmail(email: string): Promise<any> {
        return await this.emailRepository.findOne({ email });
    }
}
