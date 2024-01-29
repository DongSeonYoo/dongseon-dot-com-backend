import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeMail(email: string) {
    const option = this.welcomeMailContent(email);

    await this.mailerService.sendMail(option);
    return true;
  }

  private welcomeMailContent(email: string) {
    return {
      to: 'inko51366@naver.com',
      from: email,
      subject: '어서오십쇼',
      text: '환영합니다ㅋ',
    };
  }
}
