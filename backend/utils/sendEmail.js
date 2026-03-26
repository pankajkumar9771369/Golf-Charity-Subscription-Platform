const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `${process.env.EMAIL_FROM_NAME || 'Golf Charity Platform'} <onboarding@resend.dev>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
    });

    if (error) throw error;

    console.log('Email sent to:', options.email);
    return data;
  } catch (error) {
    console.error('Email failed:', error);
  }
};

module.exports = sendEmail;
