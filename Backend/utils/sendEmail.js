import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY || 'test_key');

const sendEmail = async (to, subject, html) => {
  try {
    const msg = {
      to,
      from: process.env.FROM_EMAIL || 'noreply@bcoder.com',
      subject,
      html
    };
    
    await sgMail.send(msg);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

export default sendEmail;