const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 465,
      secure: process.env.SMTP_PORT == '465',
      auth: {
        user: process.env.SMTP_USER || process.env.EMAIL,
        pass: process.env.SMTP_PASS || process.env.EMAIL_PASSWORD,
      },
    });

    const message = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Golf Charity Platform'}" <${process.env.SMTP_USER || process.env.EMAIL}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
    };

    const info = await transporter.sendMail(message);
    console.log("Message sent to: %s via SMTP", options.email);
    return info;

  } catch (error) {
    console.error('Email could not be sent. Check SMTP credentials.', error);
  }
};

module.exports = sendEmail;
