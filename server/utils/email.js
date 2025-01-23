const nodemailer = require('nodemailer');

// Create transporter once and reuse it
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // INPUT_REQUIRED {Brevo SMTP username}
    pass: process.env.SMTP_PASSWORD, // INPUT_REQUIRED {Brevo SMTP password}
  },
});

/**
 * Sends an email using Brevo SMTP service
 * @param {Object} options Email options
 * @param {string} options.to Recipient email
 * @param {string} options.subject Email subject
 * @param {string} options.text Email text content
 * @param {string} options.html Email HTML content
 * @returns {Promise<Object>} Send result
 */
const sendEmail = async ({ to, subject, text, html }) => {
  try {
    console.log('Attempting to send email via Brevo SMTP...');
    console.log('Email details:', { to, subject });

    const mailOptions = {
      from: process.env.SMTP_FROM || '"Affworld" <noreply@affworld.com>', // INPUT_REQUIRED {Sender email address}
      to,
      subject,
      text,
      html
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent successfully');
    console.log('Message ID:', info.messageId);
    return info;
  } catch (error) {
    console.error('Failed to send email:', error);
    console.error('Error stack:', error.stack);
    throw error;
  }
};

// Verify SMTP connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP connection error:', error);
  } else {
    console.log('SMTP server is ready to send emails');
  }
});

module.exports = {
  sendEmail
};