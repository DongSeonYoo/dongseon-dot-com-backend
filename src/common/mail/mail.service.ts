import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendAuthEmailDto } from 'src/api/auth/dto/send-auth-email.dto';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendWelcomeMail(dto: SendAuthEmailDto, code: number) {
    const option = this.authMailContent(dto.email, code);

    await this.mailerService.sendMail(option);
  }

  private authMailContent(email: string, code: number): ISendMailOptions {
    return {
      to: email,
      from: this.configService.get<string>('NODEMAILER_ID'),
      subject: 'dongseon.com에서 보낸 인증번호입니다',
      text: `인증번호: ${code}`,
    };
  }
}
