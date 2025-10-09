# 📧 Email Service Limits & Quotas

## ⚠️ **YES, there are limits!** Here's what you need to know:

---

## 🔴 **Current Configuration: Gmail**

Your system is currently using **Gmail** for sending emails. Gmail has **strict daily limits**.

### **Gmail Sending Limits:**

| Account Type | Daily Limit | Per Minute | Per Hour |
|--------------|-------------|------------|----------|
| **Free Gmail Account** | **500 emails/day** | ~2 emails/min | ~20 emails/hour |
| **Google Workspace (Paid)** | **2,000 emails/day** | ~10 emails/min | ~100 emails/hour |

---

## 📊 **Your Current Email Usage:**

### **When Emails Are Sent:**
1. ✅ **Application Received** - Sent to candidate immediately after applying
2. ✅ **Interview Link** - Sent with the application confirmation (if interview generated)
3. ✅ **Status Update** - Sent when recruiter changes application status
4. ❌ **Reminder Email** - Not implemented yet (72-hour deadline reminder)
5. ❌ **Auto-Rejection** - Sent when candidate fails interview (planned)

### **Estimated Daily Volume:**
```
If you receive 100 applications/day:
- 100 confirmation emails (application received)
- 100 interview emails (included in confirmation)
- ~50 status update emails (recruiter actions)
---------------------------------------------
Total: ~150 emails/day
```

**✅ With a free Gmail account (500/day limit), you can handle ~300 applications/day before hitting the limit.**

---

## 🚨 **What Happens When You Hit the Limit?**

### **Gmail Behavior:**
1. **Temporary Block** - Gmail will refuse to send more emails
2. **Error Message** - "Daily sending quota exceeded"
3. **24-Hour Wait** - Limit resets at midnight PST (Google's timezone)
4. **No Permanent Ban** - Your account won't be banned (unless you spam)

### **Your App Behavior:**
✅ **Application Still Accepted** - The application is saved to database
❌ **Email Fails** - Candidate won't receive confirmation email
⚠️ **Error Logged** - Backend console shows email failure
🔔 **No Retry** - Email is not automatically resent later

---

## 💡 **Solutions to Scale:**

### **Option 1: Upgrade to Google Workspace (Recommended)**
**Cost:** $6-12/user/month  
**Benefit:** 2,000 emails/day (4x increase)  
**Setup:** Change Gmail account to Workspace account

**Steps:**
1. Sign up for Google Workspace
2. Update `.env` file with new credentials
3. Restart backend

---

### **Option 2: Use SendGrid (Best for Production)**
**Cost:** FREE tier = 100 emails/day, Paid starts at $20/month for 50,000/month  
**Benefit:** High volume, better deliverability, analytics  
**Setup:** 10 minutes

**Steps:**
1. Create SendGrid account: https://sendgrid.com
2. Get API key
3. Update `.env`:
```env
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=HRM Recruitment Team
```
4. Restart backend

**SendGrid Pricing:**
- **FREE:** 100 emails/day forever
- **Essentials:** $20/month = 50,000 emails/month (~1,666/day)
- **Pro:** $90/month = 100,000 emails/month (~3,333/day)

---

### **Option 3: Use AWS SES (Cheapest for High Volume)**
**Cost:** $0.10 per 1,000 emails (almost free!)  
**Benefit:** Unlimited scale, very cheap  
**Drawback:** Requires AWS setup, domain verification

**Pricing:**
- First 62,000 emails/month: **FREE** (if hosted on AWS EC2)
- After that: **$0.10 per 1,000 emails**
- Example: 100,000 emails/month = **$10/month**

---

### **Option 4: Use Mailgun**
**Cost:** FREE tier = 5,000 emails/month, Paid starts at $35/month  
**Benefit:** Developer-friendly, good API  
**Setup:** Similar to SendGrid

---

## 🔧 **How to Switch Email Service:**

### **Current Service: Gmail**
File: `/backend/.env`
```env
EMAIL_SERVICE=gmail
EMAIL_USER=amalrajkp998@gmail.com
EMAIL_PASSWORD=your_app_password
FROM_EMAIL=amalrajkp998@gmail.com
FROM_NAME=HRM Recruitment Team
```

### **Switch to SendGrid:**
```env
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxx
FROM_EMAIL=noreply@yourcompany.com
FROM_NAME=HRM Recruitment Team
```

### **Switch to Custom SMTP:**
```env
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.yourdomain.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_smtp_username
SMTP_PASSWORD=your_smtp_password
FROM_EMAIL=noreply@yourcompany.com
FROM_NAME=HRM Recruitment Team
```

**✅ No code changes needed!** The system automatically detects the service from `.env`

---

## 📈 **Monitoring Email Usage:**

### **Check Gmail Quota:**
1. Go to: https://mail.google.com/mail/u/0/#settings/accounts
2. Look for "Send mail as" section
3. Check for any warnings or limits

### **Check SendGrid Usage:**
1. Login to SendGrid dashboard
2. Go to "Activity" tab
3. See real-time sending stats

### **Backend Logs:**
```bash
# Watch for email sending in real-time
cd /Users/instavc/hrm_project/backend
npm start

# Look for these logs:
✅ EMAIL SENT SUCCESSFULLY!
❌ EMAIL SENDING FAILED
```

---

## 🚀 **Recommended Setup for Production:**

### **For Small Scale (< 100 applications/day):**
✅ **Gmail** (free) - Current setup is fine

### **For Medium Scale (100-500 applications/day):**
✅ **Google Workspace** ($6/month) or **SendGrid Essentials** ($20/month)

### **For Large Scale (500+ applications/day):**
✅ **SendGrid Pro** ($90/month) or **AWS SES** ($10/month)

---

## ⚠️ **Important Notes:**

### **1. Deliverability:**
- Gmail free accounts may be marked as spam
- Use a custom domain email (e.g., `noreply@yourcompany.com`) for better deliverability
- SendGrid/AWS SES have better reputation than Gmail

### **2. Email Queue (Not Implemented):**
Currently, emails are sent **immediately**. If sending fails, it's lost.

**Future Enhancement:**
- Implement email queue (Redis/Bull)
- Retry failed emails automatically
- Track email status (sent/failed/pending)

### **3. Rate Limiting:**
Gmail enforces rate limits:
- Max 2 emails/second
- If you send too fast, Gmail may throttle

**Solution:**
- Add delays between emails (currently not implemented)
- Use job queue to control sending rate

---

## 🛠️ **Code Location:**

Email service is configured in:
```
/backend/src/services/emailService.js
```

To add new email service:
```javascript
// In createTransporter() function
else if (emailService === 'mailgun') {
  return nodemailer.createTransport({
    host: 'smtp.mailgun.org',
    port: 587,
    auth: {
      user: process.env.MAILGUN_USER,
      pass: process.env.MAILGUN_PASSWORD,
    },
  });
}
```

---

## 📊 **Current Status:**

✅ **Gmail Configured** - Using `amalrajkp998@gmail.com`  
✅ **500 emails/day limit** - Sufficient for ~300 applications/day  
⚠️ **No queue system** - Failed emails are not retried  
⚠️ **No rate limiting** - May hit Gmail's per-second limit  
⚠️ **No deliverability tracking** - Don't know if emails are opened

---

## 🎯 **Quick Decision Guide:**

**Just testing/demo?**  
→ Keep Gmail (current setup) ✅

**Building MVP for small company?**  
→ Upgrade to Google Workspace ($6/month) 📧

**Scaling to 100+ applications/day?**  
→ Switch to SendGrid ($20-90/month) 🚀

**Need cheapest for high volume?**  
→ Use AWS SES ($0.10/1000 emails) 💰

---

## 📞 **Need Help Switching?**

Let me know which service you want to use, and I can:
1. ✅ Update the `.env` configuration
2. ✅ Test the email sending
3. ✅ Verify deliverability
4. ✅ Set up email templates for the new service

---

**Bottom Line:** You're currently using **Gmail with 500 emails/day limit**. For production with high volume, consider switching to **SendGrid** or **AWS SES**. 🚀

