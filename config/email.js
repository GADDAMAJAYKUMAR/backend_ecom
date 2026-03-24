const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});


transporter.verify((error, success) => {
  if (error) {
    console.log('Email service error:', error);
  } else {
    console.log('Email service is ready to send messages');
  }
});

/**
 * Send password reset email
 * @param {string} email - User email
 * @param {string} resetToken - Reset token
 * @param {string} resetUrl - Reset URL for the frontend
 */
const sendPasswordResetEmail = async (email, resetUrl) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Request',
    html: `
      <h2>Password Reset Request</h2>
      <p>You requested a password reset. Please click the link below to reset your password:</p>
      <p><a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a></p>
      <p>Or copy and paste this link in your browser:</p>
      <p>${resetUrl}</p>
      <p>This link will expire in 15 minutes.</p>
      <p>If you did not request a password reset, please ignore this email.</p>
      <hr>
      <p style="color: #666; font-size: 12px;">Do not reply to this email. This is an automated message.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.log('Error sending email:', error);
    throw error;
  }
};

/**
 * Send password reset success email
 * @param {string} email - User email
 */
const sendPasswordResetSuccessEmail = async (email) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Successful',
    html: `
      <h2>Password Reset Successful</h2>
      <p>Your password has been successfully reset.</p>
      <p>If you did not make this change, please contact our support team immediately.</p>
      <hr>
      <p style="color: #666; font-size: 12px;">Do not reply to this email. This is an automated message.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.log('Error sending email:', error);
    throw error;
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendPasswordResetSuccessEmail
};
