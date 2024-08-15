// src/utils/email.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // You can use any email service
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

export const sendResetPasswordEmail = async (
  email: string,
  resetToken: string
) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Request",
    text: `To reset your password, please click the following link: ${resetUrl}`,
    html: `<p>To reset your password, please click the following link: <a href="${resetUrl}">Reset Password</a></p>`,
  });
};
