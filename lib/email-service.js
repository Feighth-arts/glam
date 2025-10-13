import emailjs from '@emailjs/browser';

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

// Dynamic email template builder
const buildEmailContent = (type, data) => {
  const templates = {
    booking_confirmation: {
      subject: 'Booking Confirmation',
      title: 'Your Booking is Confirmed!',
      message: `Hi ${data.clientName},\n\nYour booking for ${data.serviceName} with ${data.providerName} has been confirmed.\n\nDate: ${data.date}\nTime: ${data.time}\nLocation: ${data.location}\nAmount: KES ${data.amount}\n\nThank you for choosing Glamease!`,
      color: '#10B981'
    },
    booking_cancelled: {
      subject: 'Booking Cancelled',
      title: 'Booking Cancelled',
      message: `Hi ${data.clientName},\n\nYour booking for ${data.serviceName} has been cancelled.\n\nIf you didn't request this, please contact us immediately.`,
      color: '#EF4444'
    },
    booking_reminder: {
      subject: 'Booking Reminder',
      title: 'Upcoming Appointment Reminder',
      message: `Hi ${data.clientName},\n\nThis is a reminder for your upcoming appointment:\n\nService: ${data.serviceName}\nProvider: ${data.providerName}\nDate: ${data.date}\nTime: ${data.time}\nLocation: ${data.location}\n\nSee you soon!`,
      color: '#3B82F6'
    },
    new_booking_provider: {
      subject: 'New Booking Request',
      title: 'New Booking Request',
      message: `Hi ${data.providerName},\n\nYou have a new booking request:\n\nClient: ${data.clientName}\nService: ${data.serviceName}\nDate: ${data.date}\nTime: ${data.time}\nAmount: KES ${data.amount}\n\nPlease confirm or decline this booking.`,
      color: '#8B5CF6'
    },
    welcome: {
      subject: 'Welcome to Glamease',
      title: 'Welcome to Glamease!',
      message: `Hi ${data.name},\n\nWelcome to Glamease - Your Beauty Services Platform!\n\nWe're excited to have you on board. ${data.role === 'PROVIDER' ? 'Start adding your services and connect with clients.' : 'Browse our services and book your first appointment.'}\n\nGet started now!`,
      color: '#F43F5E'
    }
  };

  return templates[type] || templates.welcome;
};

export const sendEmail = async (type, recipientEmail, data) => {
  try {
    const emailContent = buildEmailContent(type, data);
    
    const templateParams = {
      to_email: recipientEmail,
      to_name: data.clientName || data.providerName || data.name,
      subject: emailContent.subject,
      title: emailContent.title,
      message: emailContent.message,
      color: emailContent.color,
      year: new Date().getFullYear()
    };

    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );

    return { success: true, response };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error };
  }
};

// Notification wrapper that creates DB notification and sends email
export const sendNotificationWithEmail = async (userId, type, data, userEmail) => {
  try {
    // Create notification in DB
    await fetch('/api/notifications/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        type: type.toUpperCase(),
        title: buildEmailContent(type, data).title,
        message: buildEmailContent(type, data).message
      })
    });

    // Send email
    if (userEmail) {
      await sendEmail(type, userEmail, data);
    }

    return { success: true };
  } catch (error) {
    console.error('Notification error:', error);
    return { success: false, error };
  }
};
