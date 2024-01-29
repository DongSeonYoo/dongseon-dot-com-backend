import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: 'naver',
        host: 'smtp.naver.com',
        port: 587,
        auth: {
          user: process.env.NODEMAILER_ID,
          pass: process.env.NODEMAILER_PW,
        },
      },
    }),
  ],
  exports: [MailService],
  providers: [MailService],
})
export class MailModule {}
