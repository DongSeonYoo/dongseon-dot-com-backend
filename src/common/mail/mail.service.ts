import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  sendTest() {
    this.mailerService
      .sendMail({
        to: 'inko51366@naver.com',
        from: 'inko51366@naver.com',
        subject: '제목',
        template: '본문',
        text: 'qwer',
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

    return true;
  }
}
