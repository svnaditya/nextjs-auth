import nodemailer from "nodemailer";
import user from "@/models/userModel";
import bcrypt from "bcryptjs";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST!,
  port: Number(process.env.EMAIL_PORT!),
  auth: {
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASS!,
  },
});

export const sendMail = async ({ email, emailType, userId }: any) => {
  try {
    const hashedToken = await bcrypt.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await user.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      await user.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    const resp = await transporter.sendMail({
      from: '"ADMIN APP 👻" <admin@gmail.com>',
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your account" : "Reset your password",
      html: `<p>click <a href="${process.env.DOMAIN}/verifyEmail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "Verify Your Email" : "reset your password"}</p>`,
    });

    console.log("Message sent: %s", resp);
  } catch (error: any) {
    throw new Error(error.message);
  }
};
