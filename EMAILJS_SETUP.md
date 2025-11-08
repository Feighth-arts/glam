# EmailJS Setup Guide - Single Template for All Emails

## Overview
This guide shows how to set up EmailJS with a **single dynamic template** that handles all email types (booking confirmations, status updates, reviews, welcome emails, etc.) - perfect for the free tier.

## Why Single Template?
- ✅ Works with EmailJS free tier (limited templates)
- ✅ One template handles all email types
- ✅ Dynamic content via template variables
- ✅ Easy to maintain and update

## Step 1: Create EmailJS Account

1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Add Email Service

1. Go to **Email Services** in dashboard
2. Click **Add New Service**
3. Choose your email provider:
   - **Gmail** (recommended for testing)
   - Outlook
   - Yahoo
   - Custom SMTP
4. Connect your email account
5. Note your **Service ID** (e.g., `service_abc123`)

## Step 3: Create Universal Email Template

1. Go to **Email Templates**
2. Click **Create New Template**
3. Use this template:

### Template Name
`glamease_universal`

### Template Content
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #F43F5E 0%, #E11D48 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
        .details { background: #f7f7f7; padding: 15px; border-radius: 5px; margin: 20px 0; white-space: pre-line; }
        .footer { background: #f7f7f7; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✨ Glamease</h1>
        </div>
        <div class="content">
            <p>Hi {{to_name}},</p>
            <p>{{message}}</p>
            <div class="details">{{details}}</div>
            <p>Thank you for using Glamease!</p>
        </div>
        <div class="footer">
            <p>Glamease - Your Beauty Services Platform</p>
            <p>This email was sent to {{to_email}}</p>
        </div>
    </div>
</body>
</html>
```

### Template Settings

**Subject Line:**
```
{{subject}}
```

**From Name:**
```
{{from_name}}
```

**Template Variables:**
Add these variables in the template settings:
- `to_email` - Recipient email address
- `to_name` - Recipient name
- `from_name` - Sender name (Glamease)
- `subject` - Email subject line
- `message` - Main message text
- `details` - Additional details (formatted)

4. Save the template
5. Note your **Template ID** (e.g., `template_xyz789`)

## Step 4: Get Public Key

1. Go to **Account** → **General**
2. Find your **Public Key** (e.g., `abc123XYZ`)
3. Copy it

## Step 5: Update Environment Variables

Update your `.env` file:

```env
# EmailJS Configuration
NEXT_PUBLIC_EMAILJS_SERVICE_ID="service_abc123"
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID="template_xyz789"
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY="abc123XYZ"
```

Replace with your actual IDs from EmailJS dashboard.

## Step 6: Test Email System

### Test in Browser Console
```javascript
// Test booking confirmation
import { sendBookingConfirmation } from '@/lib/email-service';

sendBookingConfirmation(
  {
    id: 'TEST123',
    serviceName: 'Hair Styling',
    date: '2024-01-20',
    time: '10:00 AM',
    totalAmount: 2500
  },
  'your-email@example.com',
  'Test User'
);
```

## Email Types Supported

### 1. Booking Confirmation
```javascript
sendBookingConfirmation(booking, clientEmail, clientName);
```

### 2. Booking Status Update
```javascript
sendBookingStatusUpdate(booking, clientEmail, clientName, 'CONFIRMED');
```

### 3. Provider Notification
```javascript
sendProviderBookingNotification(booking, providerEmail, providerName);
```

### 4. Welcome Email
```javascript
sendWelcomeEmail(userEmail, userName, 'CLIENT');
```

### 5. Review Notification
```javascript
sendReviewNotification(providerEmail, providerName, clientName, 5, 'Great service!');
```

### 6. Password Reset
```javascript
sendPasswordResetEmail(userEmail, userName, resetLink);
```

## How It Works

### Single Template, Multiple Uses
The template uses dynamic variables:
- `{{from_name}}` - Sender name (always "Glamease")
- `{{subject}}` - Email subject line
- `{{to_name}}` - Personalized greeting
- `{{message}}` - Main message (changes per email type)
- `{{details}}` - Formatted details (booking info, review, etc.)

### Example: Booking Confirmation
```javascript
{
  to_email: "client@example.com",
  to_name: "John Doe",
  from_name: "Glamease",
  subject: "Booking Confirmation - Glamease",
  message: "Your booking has been confirmed! Here are the details:",
  details: "Booking ID: ABC123\nService: Hair Styling\nDate: 2024-01-20..."
}
```

### Example: Review Notification
```javascript
{
  to_email: "provider@example.com",
  to_name: "Jane Smith",
  from_name: "Glamease",
  subject: "New Review Received - Glamease",
  message: "You have received a new review from a client!",
  details: "Client: John Doe\nRating: ⭐⭐⭐⭐⭐ (5/5)\nComment: Excellent service!"
}
```

## Troubleshooting

### Emails Not Sending
1. Check environment variables are set correctly
2. Verify EmailJS service is connected
3. Check browser console for errors
4. Ensure email service is active in EmailJS dashboard

### Template Not Found
1. Verify Template ID matches `.env`
2. Check template is published (not draft)
3. Ensure template has all required variables

### Rate Limiting
EmailJS free tier limits:
- 200 emails/month
- 2 emails/second

For production, consider upgrading or using alternative service.

## Production Considerations

### For Production
1. Upgrade EmailJS plan for higher limits
2. Add email queue system
3. Implement retry logic
4. Add email delivery tracking
5. Consider alternatives:
   - SendGrid
   - AWS SES
   - Mailgun
   - Postmark

### Current Implementation
- ✅ Single template for all emails
- ✅ Dynamic content
- ✅ Graceful fallback if not configured
- ✅ Console logging for debugging
- ✅ Error handling

## Testing Checklist

- [ ] EmailJS account created
- [ ] Email service connected
- [ ] Universal template created
- [ ] Environment variables set
- [ ] Test booking confirmation sent
- [ ] Test status update sent
- [ ] Test provider notification sent
- [ ] Test welcome email sent
- [ ] Test review notification sent
- [ ] Emails received successfully

## Template Customization

### Add Your Branding
1. Update header colors in template
2. Add your logo URL
3. Customize footer text
4. Add social media links

### Example with Logo
```html
<div class="header">
    <img src="https://yourdomain.com/logo.png" alt="Glamease" style="height: 50px;">
    <h1>Glamease</h1>
</div>
```

## Summary

✅ **Single template** handles all email types
✅ **Free tier compatible** (200 emails/month)
✅ **Easy to maintain** - one template to update
✅ **Dynamic content** - personalized for each use case
✅ **Production ready** - with proper error handling

The email system is now fully functional with a single dynamic template!
