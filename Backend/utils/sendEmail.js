import sgMail from '@sendgrid/mail';

// Only set API key if it's a valid SendGrid key
const apiKey = process.env.SENDGRID_API_KEY;
if (apiKey && apiKey.startsWith('SG.')) {
  sgMail.setApiKey(apiKey);
} else {
  console.log('⚠️ No valid SendGrid API key found, email sending will be simulated');
}

const sendEmail = async (to, subject, html) => {
  try {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey || !apiKey.startsWith('SG.')) {
      // Simulate email sending for demo purposes
      console.log('📧 Demo Email (not actually sent):');
      console.log('  To:', to);
      console.log('  Subject:', subject);
      console.log('  Content:', html.substring(0, 100) + '...');
      return;
    }

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
    // Don't throw error in demo mode
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }
  }
};

export default sendEmail;