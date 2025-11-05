import emailjs from '@emailjs/browser';

// EmailJS Configuration
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

// Check if EmailJS is configured
const isEmailConfigured = () => {
  return EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY && 
         EMAILJS_SERVICE_ID !== 'your_service_id';
};

/**
 * Universal email sender using single EmailJS template
 * Template variables: to_email, to_name, from_name, subject, message, details
 */
export const sendEmail = async (emailData) => {
  if (!isEmailConfigured()) {
    console.log('EmailJS not configured - Email would be sent:', emailData);
    return { success: true, message: 'Email skipped (not configured)' };
  }

  try {
    const templateParams = {
      to_email: emailData.toEmail,
      to_name: emailData.toName,
      from_name: 'Glamease',
      subject: emailData.subject,
      message: emailData.message,
      details: emailData.details || '',
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    return { success: true, response };
  } catch (error) {
    console.error('Email send failed:', error);
    return { success: false, error: error.message };
  }
};

// Booking Confirmation Email
export const sendBookingConfirmation = (booking, clientEmail, clientName) => {
  const details = `
Booking ID: ${booking.id}
Service: ${booking.serviceName}
Date: ${booking.date}
Time: ${booking.time}
Amount: KES ${booking.totalAmount}
  `.trim();

  return sendEmail({
    toEmail: clientEmail,
    toName: clientName,
    subject: 'Booking Confirmation - Glamease',
    message: 'Your booking has been confirmed! Here are the details:',
    details
  });
};

// Booking Status Update Email
export const sendBookingStatusUpdate = (booking, clientEmail, clientName, newStatus) => {
  const statusMessages = {
    PAID: 'Payment confirmed for your booking',
    CONFIRMED: 'Your booking has been confirmed by the provider',
    COMPLETED: 'Your booking has been completed. Thank you for choosing Glamease!',
    CANCELLED: 'Your booking has been cancelled',
  };

  const details = `
Booking ID: ${booking.id}
Service: ${booking.serviceName}
Date: ${booking.date}
Time: ${booking.time}
Amount: KES ${booking.totalAmount}
Status: ${newStatus}
  `.trim();

  return sendEmail({
    toEmail: clientEmail,
    toName: clientName,
    subject: `Booking Update - ${newStatus}`,
    message: statusMessages[newStatus] || 'Your booking status has been updated',
    details
  });
};

// New Booking Notification (for Provider)
export const sendProviderBookingNotification = (booking, providerEmail, providerName) => {
  const details = `
Booking ID: ${booking.id}
Client: ${booking.clientName}
Service: ${booking.serviceName}
Date: ${booking.date}
Time: ${booking.time}
Amount: KES ${booking.totalAmount}
Location: ${booking.location || 'Not specified'}
  `.trim();

  return sendEmail({
    toEmail: providerEmail,
    toName: providerName,
    subject: 'New Booking Received - Glamease',
    message: 'You have received a new booking request!',
    details
  });
};

// Welcome Email
export const sendWelcomeEmail = (userEmail, userName, userRole) => {
  const roleMessages = {
    CLIENT: 'Start browsing our amazing beauty services and book your first appointment!',
    PROVIDER: 'Set up your profile and start offering your services to clients.',
    ADMIN: 'You have full access to manage the platform.'
  };

  return sendEmail({
    toEmail: userEmail,
    toName: userName,
    subject: 'Welcome to Glamease!',
    message: `Welcome to Glamease! ${roleMessages[userRole] || 'Thank you for joining us.'}`,
    details: 'Visit your dashboard to get started.'
  });
};

// Review Notification (for Provider)
export const sendReviewNotification = (providerEmail, providerName, clientName, rating, comment) => {
  const stars = '⭐'.repeat(rating);
  const details = `
Client: ${clientName}
Rating: ${stars} (${rating}/5)
Comment: ${comment || 'No comment provided'}
  `.trim();

  return sendEmail({
    toEmail: providerEmail,
    toName: providerName,
    subject: 'New Review Received - Glamease',
    message: 'You have received a new review from a client!',
    details
  });
};

// Password Reset Email
export const sendPasswordResetEmail = (userEmail, userName, resetLink) => {
  return sendEmail({
    toEmail: userEmail,
    toName: userName,
    subject: 'Password Reset Request - Glamease',
    message: 'You requested to reset your password. Click the link below to proceed:',
    details: resetLink
  });
};
