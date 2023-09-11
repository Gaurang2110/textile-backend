import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  senderEmail = this.configService.get('MAIL_SENDER', '');
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendEmail(emailOptions: Omit<ISendMailOptions, 'from'>) {
    const url = `https://www.ngon.in/`;

    const resp = await this.mailerService.sendMail({
      ...emailOptions,
      from: this.senderEmail,
    });
    console.log(
      'Mail sent suucess ---> ',
      emailOptions.to,
      emailOptions.template,
    );
  }

  async sendForgotPasswordCode({
    toEmail,
    values,
  }: {
    toEmail: string;
    values: {
      fullName: string;
      confirmationCode: string;
    };
  }) {
    return this.sendEmail({
      to: toEmail,
      subject: 'NGON: Reset password',
      template: 'forgot-password',
      context: values,
    });
  }
}
