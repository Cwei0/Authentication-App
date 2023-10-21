import { createTransport } from "nodemailer";
import { Options } from "nodemailer/lib/mailer";
import log from "./logger";
import { env } from "process";
import { CustomError } from "../middlewares/errorMiddleware";

let transporter = createTransport({
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT),
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
});

function sendResetEmail(email: string, token: string, userId: any) {
  const resetRoute = "http://localhost:7050/auth/local/reset-password";

  let mailOptions: Options = {
    from: "My Application <noreply@myapp.com>",
    to: email,
    subject: "Password Reset",
    text: `Hello,

        You have requested to reset your password.
        
        Please use the following code: ${token}
        
        If you did not request this password reset, please ignore this email.
        
        To reset your password, click on the following button:
        
        <a href="${resetRoute}/${userId}/${token}" style="text-decoration: none;">
          <button style="background-color: #3f51b5; color: white; padding: 10px 20px; border: none; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.1); font-size: 16px;">
            Reset Password
          </button>
        </a>
        
        Best regards,
        The Example Team`,
    html: `<p>Hello,</p>
        <p>You have requested to reset your password.</p>
        <p>Please use the following code: <strong>${token}</strong></p>
        <p>If you did not request this password reset, please ignore this email.</p>
        <p>To reset your password, click on the following button:</p>
        <p>
          <a href="${resetRoute}/${userId}/${token}" style="text-decoration: none;">
            <button style="background-color: #3f51b5; color: white; padding: 10px 20px; border: none; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.1); font-size: 16px;">
              Reset Password
            </button>
          </a>
        </p>
        <p>Best regards,<br>The Example Team</p>`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      log.info(`Failed to send email to ${email || info.rejected}`);
      throw new CustomError("Email sending failed");
    } else {
      log.info(`Email sent: ${info}`);
    }
  });
}

export { sendResetEmail };
