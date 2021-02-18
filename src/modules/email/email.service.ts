import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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

    // Boilerplate configs
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

    async sendVerificationEmail(recipient: UserDto): Promise<any> {
        const hash = Hash.make(recipient.email);
        const result = await this.transporter.sendMail({
            from: this.fromAddy,
            to: recipient.email,
            subject: 'Please verify your email',
            text: 'Welcome to BluDuck! If you received this email in error, please ignore.',
            html: '<p><a href="https://www.thehourlyadmin.com/confirm?token=' + hash + '">Click here to verify your account.</a>.</p> <br /> Thank you, <br /><br /> The Hourly Admin Team'
        });
        const email = this.emailRepository.create({
            userId: recipient.id,
            hash
        });
        await this.emailRepository.save(email);
        console.log('email result', result);
        return result.messageId;
    }

  // async getTasksByProjectId(userId: number, projectId: number): Promise<TaskDto[]> {
  //   const project = await this.companyService.get(companyId);
  //   if (userId !== company.owner.id) {
  //     throw new NotFoundException('Only owner of company can retrieve projects.');
  //   }
  //   return this.taskRepository.find({
  //     join: {
  //       alias: 'task',
  //       leftJoinAndSelect: {
  //         company: 'task.project'
  //       }
  //     },
  //     where: {
  //       company: projectId
  //     }
  //   });
  // }

  // async getProjectsByCompany(userId: number, companyId: number): Promise<ProjectDto[]> {
  //   const company = await this.companyService.get(companyId);
  //   if (userId !== company.owner.id) {
  //     throw new NotFoundException('Only owner of company can retrieve projects.');
  //   }
  //   return this.projectRepository.find({
  //     join: {
  //       alias: 'project',
  //       leftJoinAndSelect: {
  //         company: 'project.company'
  //       }
  //     },
  //     where: {
  //       company: companyId
  //     }
  //   });
  // }

  // async create(userId: number, projectId: number, payload: TaskCreateDto): Promise<any> {
  //   console.log(payload);
  //   const company = await this.companyService.get(companyId);
  //   if (company.owner.id !== userId) {
  //     throw new NotFoundException('Only owner of company can create projects.');
  //   }

  //   return await this.projectRepository.save(this.projectRepository.create({
  //     company,
  //     projectName: payload.projectName,
  //     dueDate: payload.dueDate,
  //     latestUpdate: payload.latestUpdate
  //   }));
  // }

  // async patch(userId, projectId, payload: ProjectPatchDto): Promise<ProjectDto> {
  //   const project = await this.projectRepository
  //                             .createQueryBuilder('project')
  //                             .leftJoinAndSelect('project.company', 'company')
  //                             .leftJoinAndSelect('company.owner', 'owner')
  //                             .where('project.id = :id')
  //                             .setParameter('id', projectId)
  //                             .getOne();                                                   
  //   if (project.company.owner.id !== userId) {
  //     throw new UnauthorizedException('User only authorized to make changes to his/her/their/shis/xis project.'); 
  //   }
  //   await this.projectRepository.update({ id: projectId }, payload);
  //   return await this.getProjectsById(projectId);
  // }

  // async delete(userId: number, projectId: number): Promise<any> {
  //   const project = await this.projectRepository
  //                             .createQueryBuilder('project')
  //                             .leftJoinAndSelect('project.company', 'company')
  //                             .leftJoinAndSelect('company.owner', 'owner')
  //                             .where('project.id = :id')
  //                             .setParameter('id', projectId)
  //                             .getOne();                                                   
  //   if (project.company.owner.id !== userId) {
  //     throw new UnauthorizedException('User only authorized to make changes to his/her/their/shis/xis project.'); 
  //   }
  //   return await this.projectRepository.delete(projectId);;
  // }
}
