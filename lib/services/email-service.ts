import nodemailer from 'nodemailer';
import { env } from '@/lib/config/environment';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface RoleChangeEmailData {
  userEmail: string;
  userName: string;
  role: string;
  action: 'added' | 'removed';
  changedBy: string;
  timestamp: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    
    // In development, use mock transporter or configure with test credentials
    if (this.isDevelopment) {
      // Mock transporter for development
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: 'test@example.com',
          pass: 'password',
        },
      });
    } else {
      // Production email configuration
      this.transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_PORT === 465,
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        },
      });
    }
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      if (this.isDevelopment) {
        // In development, log the email instead of sending
        console.log('📧 [DEVELOPMENT] Email notification:');
        console.log(`To: ${options.to}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Text: ${options.text || 'No text version'}`);
        console.log('---');
        return;
      }

      await this.transporter.sendMail({
        from: env.FROM_EMAIL || 'noreply@upskillplatform.com',
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });
    } catch (error) {
      console.error('Failed to send email:', error);
      // In development, don't throw error to avoid breaking the flow
      if (!this.isDevelopment) {
        throw new Error('Failed to send email notification');
      }
    }
  }

  async sendRoleChangeNotification(data: RoleChangeEmailData): Promise<void> {
    const { userEmail, userName, role, action, changedBy, timestamp } = data;
    
    const isAdminRole = role === 'admin';
    const actionText = action === 'added' ? 'granted' : 'revoked';
    const roleDisplayName = role.replace('_', ' ').toUpperCase();
    
    const subject = isAdminRole 
      ? `🔐 Administrator Access ${actionText === 'granted' ? 'Granted' : 'Revoked'} - Upskill Platform`
      : `📋 Role Updated: ${roleDisplayName} Access ${actionText === 'granted' ? 'Granted' : 'Revoked'}`;

    const html = this.generateRoleChangeEmailTemplate(data);
    const text = this.generateRoleChangeEmailText(data);

    await this.sendEmail({
      to: userEmail,
      subject,
      html,
      text,
    });
  }

  private generateRoleChangeEmailTemplate(data: RoleChangeEmailData): string {
    const { userName, role, action, changedBy, timestamp } = data;
    const isAdminRole = role === 'admin';
    const actionText = action === 'added' ? 'granted' : 'revoked';
    const roleDisplayName = role.replace('_', ' ').toUpperCase();
    
    const backgroundColor = isAdminRole ? '#dc2626' : '#3b82f6';
    const actionColor = action === 'added' ? '#059669' : '#dc2626';
    const warningSection = isAdminRole && action === 'added' ? `
      <div style="background: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <h3 style="color: #92400e; margin: 0 0 8px 0; font-size: 16px;">⚠️ Important Security Notice</h3>
        <p style="color: #92400e; margin: 0; font-size: 14px;">
          Administrator access provides full control over the platform including user management, 
          system settings, and sensitive data. Please ensure you understand your responsibilities 
          and follow security best practices.
        </p>
      </div>
    ` : '';

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Role Change Notification</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, ${backgroundColor} 0%, ${backgroundColor}dd 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
            <h1 style="margin: 0; font-size: 28px; font-weight: bold;">
              ${isAdminRole ? '🔐' : '📋'} Role Access ${actionText === 'granted' ? 'Granted' : 'Revoked'}
            </h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
              Upskill Platform Security Notification
            </p>
          </div>

          <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
            <h2 style="color: #333; margin: 0 0 20px 0; font-size: 20px;">Hello ${userName},</h2>
            <p style="margin: 0 0 15px 0; font-size: 16px;">
              Your role access has been updated on the Upskill Platform.
            </p>
            
            <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Role:</td>
                  <td style="padding: 8px 0; color: #333;">${roleDisplayName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Action:</td>
                  <td style="padding: 8px 0; color: ${actionColor}; font-weight: bold;">${actionText.toUpperCase()}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Changed By:</td>
                  <td style="padding: 8px 0; color: #333;">${changedBy}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Date & Time:</td>
                  <td style="padding: 8px 0; color: #333;">${new Date(timestamp).toLocaleString()}</td>
                </tr>
              </table>
            </div>

            ${warningSection}

            <div style="margin-top: 25px;">
              <a href="${appUrl}/dashboard" 
                 style="background: ${backgroundColor}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                Access Dashboard
              </a>
            </div>
          </div>

          <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin-top: 30px;">
            <h3 style="color: #475569; margin: 0 0 12px 0; font-size: 16px;">Security Notice</h3>
            <p style="color: #64748b; margin: 0; font-size: 14px;">
              If you did not expect this role change or have concerns about your account security, 
              please contact the system administrator immediately.
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              This is an automated security notification from the Upskill Platform.<br>
              Please do not reply to this email.
            </p>
          </div>
        </body>
      </html>
    `;
  }

  private generateRoleChangeEmailText(data: RoleChangeEmailData): string {
    const { userName, role, action, changedBy, timestamp } = data;
    const actionText = action === 'added' ? 'granted' : 'revoked';
    const roleDisplayName = role.replace('_', ' ').toUpperCase();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    return `
Hello ${userName},

Your role access has been updated on the Upskill Platform.

ROLE CHANGE DETAILS:
- Role: ${roleDisplayName}
- Action: ${actionText.toUpperCase()}
- Changed By: ${changedBy}
- Date & Time: ${new Date(timestamp).toLocaleString()}

${role === 'admin' && action === 'added' ? `
⚠️ IMPORTANT SECURITY NOTICE:
Administrator access provides full control over the platform including user management, 
system settings, and sensitive data. Please ensure you understand your responsibilities 
and follow security best practices.
` : ''}

Access your dashboard: ${appUrl}/dashboard

SECURITY NOTICE:
If you did not expect this role change or have concerns about your account security, 
please contact the system administrator immediately.

This is an automated security notification from the Upskill Platform.
Please do not reply to this email.
    `;
  }
}

export const emailService = new EmailService();
export default emailService; 