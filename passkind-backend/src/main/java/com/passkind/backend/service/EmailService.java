package com.passkind.backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otpCode) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setTo(toEmail);
        helper.setSubject("🔐 Your PassKind Verification Code");
        helper.setFrom("PassKind <noreply@passkind.com>");

        String htmlContent = """
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>PassKind Verification</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #0891b2 0%%, #06b6d4 100%%); min-height: 100vh;">
                    <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%%; max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15); overflow: hidden;">
                        <!-- Header -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #0891b2 0%%, #06b6d4 100%%); padding: 40px 20px; text-align: center;">
                                <div style="display: inline-block; background-color: rgba(255, 255, 255, 0.2); padding: 12px 24px; border-radius: 50px; backdrop-filter: blur(10px); margin-bottom: 16px;">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" stroke-width="2"/>
                                        <path d="M12 6V12L16 14" stroke="white" stroke-width="2" stroke-linecap="round"/>
                                    </svg>
                                </div>
                                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">PassKind</h1>
                                <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px; font-weight: 500;">Your Digital Life, Secured</p>
                            </td>
                        </tr>

                        <!-- Content -->
                        <tr>
                            <td style="padding: 48px 32px;">
                                <h2 style="margin: 0 0 16px 0; color: #111827; font-size: 24px; font-weight: 600;">Verification Code</h2>
                                <p style="margin: 0 0 32px 0; color: #6b7280; font-size: 16px; line-height: 1.6;">
                                    We received a request to verify your email address. Use the code below to complete the verification:
                                </p>

                                <!-- OTP Code Box -->
                                <div style="background: linear-gradient(135deg, #f0f9ff 0%%, #e0f2fe 100%%); border: 2px solid #0891b2; border-radius: 12px; padding: 24px; text-align: center; margin: 0 0 32px 0;">
                                    <div style="font-size: 14px; color: #0891b2; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">Your Verification Code</div>
                                    <div style="font-size: 36px; font-weight: 700; color: #0891b2; letter-spacing: 8px; font-family: 'Courier New', monospace;">%s</div>
                                </div>

                                <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 8px; margin-bottom: 32px;">
                                    <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5;">
                                        <strong>⏰ This code expires in 5 minutes.</strong><br>
                                        For your security, do not share this code with anyone.
                                    </p>
                                </div>

                                <p style="margin: 0 0 16px 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                                    If you didn't request this code, you can safely ignore this email. Your account remains secure.
                                </p>

                                <div style="margin-top: 32px; padding-top: 32px; border-top: 1px solid #e5e7eb;">
                                    <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 13px;">
                                        Need help? Contact us at <a href="mailto:support@passkind.com" style="color: #0891b2; text-decoration: none;">support@passkind.com</a>
                                    </p>
                                </div>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #f9fafb; padding: 32px; text-align: center; border-top: 1px solid #e5e7eb;">
                                <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 13px; line-height: 1.5;">
                                    This is an automated message from PassKind.<br>
                                    Please do not reply to this email.
                                </p>
                                <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                                    © 2025 PassKind. All rights reserved.
                                </p>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
                                """
                .formatted(otpCode);

        helper.setText(htmlContent, true);
        mailSender.send(message);
    }

}
