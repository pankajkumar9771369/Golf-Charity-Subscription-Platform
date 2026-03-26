const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    let transporterConfig;

    if (process.env.SMTP_HOST) {
      transporterConfig = {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_PORT == '465',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      };
    } else {
      transporterConfig = {
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false // Required for Gmail on cloud hosts like Render
        }
      };
    }

    const transporter = nodemailer.createTransport(transporterConfig);

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
