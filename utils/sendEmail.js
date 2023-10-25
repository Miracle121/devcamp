const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  //   secure: true,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});


const sendEmail = async (options) => {
  const messages = {
    from: `${process.env.FROM_NAME}<${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.text
  };

  const info = await transporter.sendMail(messages)
  console.log("Message sent: %s", info.messageId);

}

module.exports = sendEmail