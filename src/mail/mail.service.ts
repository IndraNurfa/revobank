import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Handlebars from 'handlebars';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  constructor(private readonly configService: ConfigService) {}

  emailTransport() {
    const transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('PORT'),
      secure: true,
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });

    return transporter;
  }

  async sendEmail(subject: string, recipients: string, name: string) {
    const transport = this.emailTransport();

    const htmlTemplate = `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Welcome — Registration</title><style>body,html{margin:0;padding:0;background:#f2f4f7;font-family:Arial,Helvetica,sans-serif;color:#333;}a{color:#1a73e8;text-decoration:none;}img{border:0;display:block;max-width:100%;}.email-wrap{max-width:640px;margin:28px auto;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 6px 18px rgba(23,23,23,0.08);}.email-top{background:linear-gradient(90deg,#4f46e5,#06b6d4);color:#fff;padding:28px 24px;text-align:center;}.logo{font-weight:700;letter-spacing:0.4px;font-size:20px;}.hero{padding:28px 24px;border-bottom:1px solid #f0f2f5;}.greeting{font-size:20px;margin:0 0 10px;}.lead{color:#54606e;margin:0 0 18px;line-height:1.45;}.details{background:#fbfdff;border:1px solid #eef6ff;padding:14px;border-radius:6px;margin:14px 0;}.details p{margin:6px 0;font-size:14px;color:#1f2937;}.cta{display:inline-block;margin-top:12px;padding:12px 18px;background:#06b6d4;color:#fff;border-radius:6px;font-weight:600;}.footer{padding:18px 24px;font-size:13px;color:#98a0ab;text-align:center;}.small{font-size:12px;color:#7b8794;}@media (max-width:480px){.email-top{padding:20px 16px;}.hero{padding:20px 16px;}}</style></head><body><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2f4f7;"><tr><td align="center"><div class="email-wrap" role="article" aria-label="Welcome email"><div class="email-top"><div class="logo">Your Company</div><div style="font-size:13px;margin-top:6px;opacity:0.95;">Welcome to the family</div></div><div class="hero"><h1 class="greeting">Hi {{name}},</h1><p class="lead">Thanks for registering with us. We're thrilled to have you on board. Below are the details for your new account.</p><div class="details" aria-live="polite"><p><strong>Account name:</strong> {{name}}</p><p><strong>Email:</strong> {{recipients}}</p></div><p style="margin:0;">To get started, verify your email and complete your profile.</p><a href="#" class="cta" role="button" aria-label="Verify your email">Verify your email</a></div><div class="footer"><div class="small">If you didn't create an account using this email, please ignore this message or contact support.</div><div style="margin-top:8px;font-size:12px;color:#b0b9c6;">© <span id="year">2025</span> Your Company. All rights reserved.</div></div></div></td></tr></table></body></html>`;

    const template = Handlebars.compile(htmlTemplate);
    const personalizedHtml = template({ name, recipients });

    const options: nodemailer.SendMailOptions = {
      from: this.configService.get<string>('EMAIL_USER'),
      to: recipients,
      subject: subject,
      html: personalizedHtml,
    };

    try {
      await transport.sendMail(options);
      console.log('--- MOCK EMAIL SEND ---');
      console.log('Email sent successfully');
      console.log('To:', recipients);
      console.log('Subject:', subject);
      console.log('Generated HTML:\n', personalizedHtml);
    } catch (error) {
      console.log('Error sending mail: ', error);
    }
  }
}
