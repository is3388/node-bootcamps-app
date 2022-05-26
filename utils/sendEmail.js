/*const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail; */

const sgMail = require('@sendgrid/mail')
const dotenv = require('dotenv')

dotenv.config()
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const resetPasswordEmail = async ({email, subject, message}) =>
{
    
    const msg = {
        to:email,
        from: process.env.EMAIL,
        subject,
        text: message
    }

	await sgMail.send(msg)
}

module.exports = resetPasswordEmail