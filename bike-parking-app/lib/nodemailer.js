import nodemailer from "nodemailer";

const email = process.env.EMAIL;
const pass = process.env.EMAIL_PASS;
let recipients = process.env.EMAIL_RECIPIENTS
  ? process.env.EMAIL_RECIPIENTS.includes(",")
    ? process.env.EMAIL_RECIPIENTS.split(",")
    : [process.env.EMAIL_RECIPIENTS]
  : [];
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: email,
    pass,
  },
});

export const mailOptions = {
  from: email,
  // to: email,
  to: recipients,
};
