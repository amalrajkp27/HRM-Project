# 📧 Email Notification Setup Guide

This guide will help you set up email notifications for the HRM Application Tracking System.

## 🎯 What Gets Emailed?

The system automatically sends professional HTML emails to candidates when:
- ✅ They submit an application (confirmation email)
- 👀 Their application is being reviewed
- 🎉 They get shortlisted
- 📅 An interview is scheduled
- 📧 Their application is rejected (professional & respectful)
- 🎊 They receive a job offer

## 🚀 Quick Setup (Gmail - Recommended for Testing)

### Step 1: Enable 2-Factor Authentication

1. Go to your Google Account: https://myaccount.google.com
2. Click on **Security** in the left sidebar
3. Find **2-Step Verification** and click on it
4. Follow the steps to enable 2FA (you'll need your phone)

### Step 2: Generate App Password

1. After enabling 2FA, go to: https://myaccount.google.com/apppasswords
2. You might need to sign in again
3. Under "Select app", choose **Mail**
4. Under "Select device", choose **Other (Custom name)**
5. Type: `HRM Application`
6. Click **Generate**
7. Google will show you a 16-digit password like: `abcd efgh ijkl mnop`
8. **Copy this password** (you can ignore the spaces)

### Step 3: Update Your .env File

Open the `.env` file in the root directory of your project and add/update these lines:

```env
# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-actual-email@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop  # Paste the 16-digit password (remove spaces)
FROM_EMAIL=your-actual-email@gmail.com
FROM_NAME=HRM Recruitment Team
COMPANY_NAME=Your Company Name
```

**Replace:**
- `your-actual-email@gmail.com` with your Gmail address
- `abcdefghijklmnop` with the 16-digit app password you copied
- `Your Company Name` with your actual company name

### Step 4: Restart Backend Server

1. Stop your backend server (Ctrl+C in the terminal)
2. Start it again:
   ```bash
   cd backend
   npm run dev
   ```

### Step 5: Test It!

1. Go to your application
2. Apply for a job
3. Check your email - you should receive a confirmation email!
4. As a recruiter, change the application status
5. The candidate should receive status update emails

## 🔧 Troubleshooting

### "Invalid login" or "Username and Password not accepted"
- Make sure 2-Factor Authentication is enabled
- Make sure you're using the App Password, NOT your regular Gmail password
- Remove any spaces from the app password
- Try generating a new app password

### Emails not sending
- Check your `.env` file has the correct values
- Restart your backend server after changing `.env`
- Check backend terminal logs for error messages
- Make sure `EMAIL_SERVICE=gmail` is set

### Emails going to spam
- This is normal for testing
- For production, use SendGrid or verify your domain
- Ask recipients to mark emails as "Not Spam"

## 🏢 Production Setup (SendGrid)

For production environments, use SendGrid instead of Gmail:

### Step 1: Create SendGrid Account
1. Sign up at https://sendgrid.com
2. Free tier: 100 emails/day (perfect for small businesses)
3. Verify your email address

### Step 2: Generate API Key
1. Go to Settings → API Keys
2. Click "Create API Key"
3. Name it "HRM Application"
4. Choose "Full Access"
5. Copy the API key (starts with `SG.`)

### Step 3: Update .env
```env
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=SG.your_actual_api_key_here
FROM_EMAIL=your-verified-email@yourdomain.com
FROM_NAME=HRM Recruitment Team
COMPANY_NAME=Your Company Name
```

### Step 4: Verify Sender Email
- In SendGrid, go to Settings → Sender Authentication
- Verify your email address or domain
- Use the verified email in `FROM_EMAIL`

## 📊 Email Templates

All emails are professionally designed with:
- Modern HTML design with gradients
- Responsive layout (works on mobile)
- Company branding (uses your `COMPANY_NAME`)
- Clear call-to-action
- Professional tone

### Example Email Preview

**Subject:** Application Received - Software Engineer

```
┌─────────────────────────────────┐
│   ✅ Application Received       │
│                                 │
│   Dear John Doe,                │
│                                 │
│   Thank you for applying for    │
│   the Software Engineer         │
│   position at Your Company.     │
│                                 │
│   What happens next?            │
│   • Review within 3-5 days      │
│   • Email updates on progress   │
│   • Contact if shortlisted      │
│                                 │
│   Best regards,                 │
│   Your Company Recruitment Team │
└─────────────────────────────────┘
```

## 🎨 Customization

Want to customize the emails? Edit:
- `/backend/src/services/emailService.js`
- Modify the `emailTemplates` object
- Change colors, text, or structure
- Restart backend to see changes

## 📝 Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `EMAIL_SERVICE` | Yes | Email provider | `gmail`, `sendgrid`, or `smtp` |
| `EMAIL_USER` | For Gmail | Your Gmail address | `yourname@gmail.com` |
| `EMAIL_PASSWORD` | For Gmail | Gmail App Password | `abcdefghijklmnop` |
| `SENDGRID_API_KEY` | For SendGrid | SendGrid API key | `SG.xxxxxxxxxxxxx` |
| `FROM_EMAIL` | Yes | Sender email address | `noreply@company.com` |
| `FROM_NAME` | Yes | Sender display name | `HRM Recruitment Team` |
| `COMPANY_NAME` | Yes | Your company name | `Your Company Name` |

## 🔐 Security Notes

- **Never commit** your `.env` file to Git
- App Passwords are safer than regular passwords
- Revoke app passwords if compromised
- Use SendGrid for production (more reliable)
- Monitor email sending logs

## 📞 Need Help?

If you're stuck:
1. Check backend terminal logs for errors
2. Verify all environment variables are set
3. Make sure 2FA is enabled (for Gmail)
4. Try generating a new app password
5. Test with a different email address

---

**Happy Emailing! 📧**
