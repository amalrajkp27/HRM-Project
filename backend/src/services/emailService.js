const nodemailer = require('nodemailer');

// Email configuration
const createTransporter = () => {
  // Support multiple email services
  const emailService = process.env.EMAIL_SERVICE || 'gmail';
  
  if (emailService === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, // App Password for Gmail
      },
    });
  } else if (emailService === 'sendgrid') {
    return nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY,
      },
    });
  } else {
    // Custom SMTP
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }
};

// Email templates for different application statuses
const emailTemplates = {
  received: (candidateName, jobTitle, companyName) => ({
    subject: `Application Received - ${jobTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Application Received</h1>
          </div>
          <div class="content">
            <p>Dear ${candidateName},</p>
            <p>Thank you for applying for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>.</p>
            <p>We have successfully received your application and our recruitment team will review it carefully. We appreciate your interest in joining our team.</p>
            <p><strong>What happens next?</strong></p>
            <ul>
              <li>Our team will review your application within 3-5 business days</li>
              <li>If your profile matches our requirements, we'll contact you for the next steps</li>
              <li>You'll receive email updates as your application progresses</li>
            </ul>
            <p>We wish you the best of luck!</p>
            <p>Best regards,<br><strong>${companyName} Recruitment Team</strong></p>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  reviewing: (candidateName, jobTitle, companyName) => ({
    subject: `Application Under Review - ${jobTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .status-badge { display: inline-block; padding: 8px 16px; background: #3b82f6; color: white; border-radius: 20px; font-size: 14px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>👀 Application Under Review</h1>
          </div>
          <div class="content">
            <p>Dear ${candidateName},</p>
            <p><span class="status-badge">Status Update</span></p>
            <p>Great news! Your application for the <strong>${jobTitle}</strong> position is now being reviewed by our hiring team.</p>
            <p>We're carefully evaluating your qualifications and experience to determine if there's a good match for this role.</p>
            <p>We'll keep you updated on the progress of your application.</p>
            <p>Thank you for your patience!</p>
            <p>Best regards,<br><strong>${companyName} Recruitment Team</strong></p>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  shortlisted: (candidateName, jobTitle, companyName) => ({
    subject: `🎉 Congratulations! You've Been Shortlisted - ${jobTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .highlight { background: #d1fae5; padding: 15px; border-left: 4px solid #10b981; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Congratulations!</h1>
          </div>
          <div class="content">
            <p>Dear ${candidateName},</p>
            <div class="highlight">
              <strong>Exciting News!</strong> You've been shortlisted for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>!
            </div>
            <p>After carefully reviewing all applications, we're impressed with your qualifications and would like to move forward with your candidacy.</p>
            <p><strong>Next Steps:</strong></p>
            <ul>
              <li>Our recruitment team will contact you soon to schedule an interview</li>
              <li>Please keep your phone and email accessible</li>
              <li>Prepare to discuss your experience and skills in detail</li>
            </ul>
            <p>We're looking forward to speaking with you!</p>
            <p>Best regards,<br><strong>${companyName} Recruitment Team</strong></p>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  'interview-scheduled': (candidateName, jobTitle, companyName) => ({
    subject: `Interview Scheduled - ${jobTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .interview-box { background: white; padding: 20px; border: 2px solid #8b5cf6; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📅 Interview Scheduled</h1>
          </div>
          <div class="content">
            <p>Dear ${candidateName},</p>
            <div class="interview-box">
              <h3 style="color: #8b5cf6; margin-top: 0;">Your Interview Has Been Scheduled!</h3>
              <p>Position: <strong>${jobTitle}</strong></p>
              <p>Company: <strong>${companyName}</strong></p>
            </div>
            <p>Our recruitment team will contact you shortly with the interview details including:</p>
            <ul>
              <li>Date and time</li>
              <li>Interview format (in-person, video call, or phone)</li>
              <li>Interview duration</li>
              <li>Names of interviewers</li>
              <li>Any preparation materials</li>
            </ul>
            <p><strong>Interview Tips:</strong></p>
            <ul>
              <li>Research our company and the role</li>
              <li>Prepare examples of your past work</li>
              <li>Have questions ready for us</li>
              <li>Test your technology if it's a video interview</li>
            </ul>
            <p>We're excited to meet you!</p>
            <p>Best regards,<br><strong>${companyName} Recruitment Team</strong></p>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  rejected: (candidateName, jobTitle, companyName) => ({
    subject: `Application Update - ${jobTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Application Update</h1>
          </div>
          <div class="content">
            <p>Dear ${candidateName},</p>
            <p>Thank you for your interest in the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong> and for taking the time to apply.</p>
            <p>After careful consideration, we have decided to move forward with other candidates whose qualifications more closely match our current needs for this specific role.</p>
            <p>We were impressed by your background and encourage you to apply for future openings that match your skills and experience. We'll keep your resume on file for consideration.</p>
            <p>We wish you all the best in your job search and future career endeavors.</p>
            <p>Thank you again for your interest in joining our team.</p>
            <p>Best regards,<br><strong>${companyName} Recruitment Team</strong></p>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  hired: (candidateName, jobTitle, companyName) => ({
    subject: `🎊 Congratulations! Job Offer - ${jobTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .celebration { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎊 Congratulations!</h1>
          </div>
          <div class="content">
            <p>Dear ${candidateName},</p>
            <div class="celebration">
              <h2 style="color: #d97706; margin: 0;">Welcome to ${companyName}!</h2>
              <p style="font-size: 18px; margin: 10px 0;">We're thrilled to offer you the position of <strong>${jobTitle}</strong>!</p>
            </div>
            <p>After careful consideration, we're excited to extend this offer to you. Your skills, experience, and enthusiasm impressed us throughout the interview process.</p>
            <p><strong>Next Steps:</strong></p>
            <ul>
              <li>Our HR team will contact you within 24-48 hours with your formal offer letter</li>
              <li>The offer letter will include compensation details, benefits, and start date</li>
              <li>Please review the offer carefully and let us know if you have any questions</li>
              <li>We'll guide you through the onboarding process</li>
            </ul>
            <p>We're looking forward to having you on our team and can't wait to see the great things you'll accomplish!</p>
            <p>Welcome aboard!</p>
            <p>Best regards,<br><strong>${companyName} Recruitment Team</strong></p>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),
};

// Send email function
const sendEmail = async (to, subject, html) => {
  try {
    console.log('\n📧 ===== EMAIL SENDING STARTED =====');
    console.log('📬 To:', to);
    console.log('📝 Subject:', subject);
    console.log('🔧 Email Service:', process.env.EMAIL_SERVICE || 'gmail');
    console.log('👤 From:', `"${process.env.FROM_NAME || 'HRM Recruitment'}" <${process.env.FROM_EMAIL || process.env.EMAIL_USER}>`);
    
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"${process.env.FROM_NAME || 'HRM Recruitment'}" <${process.env.FROM_EMAIL || process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    console.log('⏳ Sending email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ EMAIL SENT SUCCESSFULLY!');
    console.log('📨 Message ID:', info.messageId);
    console.log('📧 ===== EMAIL SENDING COMPLETED =====\n');
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('\n❌ ===== EMAIL SENDING FAILED =====');
    console.error('❌ Error:', error.message);
    console.error('❌ Full Error:', error);
    console.error('📧 ===== EMAIL ERROR END =====\n');
    return { success: false, error: error.message };
  }
};

// Send application status update email
const sendApplicationStatusEmail = async (candidateEmail, candidateName, jobTitle, status, companyName = 'Our Company') => {
  try {
    console.log(`\n🔔 Preparing to send "${status}" email to ${candidateName}`);
    const template = emailTemplates[status];
    
    if (!template) {
      console.warn(`⚠️ No email template found for status: ${status}`);
      return { success: false, error: 'Template not found' };
    }

    const { subject, html } = template(candidateName, jobTitle, companyName);
    
    return await sendEmail(candidateEmail, subject, html);
  } catch (error) {
    console.error('❌ Error sending application status email:', error);
    return { success: false, error: error.message };
  }
};

// Send application received confirmation
const sendApplicationReceivedEmail = async (candidateEmail, candidateName, jobTitle, companyName = 'Our Company') => {
  return await sendApplicationStatusEmail(candidateEmail, candidateName, jobTitle, 'received', companyName);
};

module.exports = {
  sendEmail,
  sendApplicationStatusEmail,
  sendApplicationReceivedEmail,
};
