import nodemailer from "nodemailer";
import "dotenv/config";
async function sendMail(options) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  return await transporter.sendMail({
    from: `"Admin Goyal" ${process.env.SMTP_MAIL}`, // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.message,
  });
}

export default sendMail;
