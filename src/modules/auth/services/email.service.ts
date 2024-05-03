import { Transporter } from 'nodemailer';
import * as hbs from 'nodemailer-express-handlebars';
import * as path from 'path';
import * as nodemailer from 'nodemailer';

import { emailTemplates } from '../constants/email.constant';
import { EmailActionEnum } from '../enums/email-action.enum';
import { Injectable } from '@nestjs/common';
import {
  Config,
  frontURLConfig,
  SMTPConfig,
} from '../../../configs/config.type';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: Transporter;
  private smtpConfig: SMTPConfig;
  private frontURLConfig: frontURLConfig;

  constructor(private configService: ConfigService<Config>) {
    this.smtpConfig = this.configService.get<SMTPConfig>('smtp');
    this.frontURLConfig = this.configService.get<frontURLConfig>('frontURL');

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      from: 'No reply',
      auth: {
        user: this.smtpConfig.userSmtp,
        pass: this.smtpConfig.passSmtp,
      },
    });

    const hbsOptions = {
      viewEngine: {
        extname: '.hbs',
        defaultLayout: 'main',
        layoutsDir: path.join(process.cwd(), 'src', 'templates', 'layouts'),
        partialsDir: path.join(process.cwd(), 'src', 'templates', 'partials'),
      },
      viewPath: path.join(process.cwd(), 'src', 'templates', 'views'),
      extName: '.hbs',
    };

    this.transporter.use('compile', hbs(hbsOptions));
  }

  public async sendMail(
    email: string | string[],
    emailAction: EmailActionEnum.FORGOT_PASSWORD,
    context: Record<string, string | number> = {},
  ) {
    const { subject, templateName } = emailTemplates[emailAction];

    context.frontUrl = this.frontURLConfig.frontURL;
    const mailOptions = {
      to: email,
      subject,
      template: templateName,
      context,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
