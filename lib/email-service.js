import emailjs from '@emailjs/browser';

// EmailJS Configuration
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_glamease';
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_glamease';
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'your_public_key';

export const sendBookingEmail = async (emailData) => {
  try {
    const templateParams = {
      to_email: emailData.toEmail,
      to_name: emailData.toName,
      subject: emailData.subject,
      message: emailData.message,
      booking_id: emailData.bookingId,
      service_name: emailData.serviceName,
      booking_date: emailData.bookingDate,
      booking_time: emailData.bookingTime,
      total_amount: emailData.totalAmount,
      status: emailData.status,
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

export const sendBookingConfirmation = (booking, clientEmail, clientName) => {
  return sendBookingEmail({
    toEmail: clientEmail,
    toName: clientName,
    subject: 'Booking Confirmation - Glamease',
    message: `Your booking has been confirmed!`,
    bookingId: booking.id,
    serviceName: booking.serviceName,
    bookingDate: booking.date,
    bookingTime: booking.time,
    totalAmount: booking.totalAmount,
    status: 'CONFIRMED',
  });
};

export const sendBookingStatusUpdate = (booking, clientEmail, clientName, newStatus) => {
  const statusMessages = {
    PAID: 'Payment confirmed for your booking',
    CONFIRMED: 'Your booking has been confirmed by the provider',
    COMPLETED: 'Your booking has been completed. Thank you!',
    CANCELLED: 'Your booking has been cancelled',
  };

  return sendBookingEmail({
    toEmail: clientEmail,
    toName: clientName,
    subject: `Booking Update - ${newStatus}`,
    message: statusMessages[newStatus] || 'Your booking status has been updated',
    bookingId: booking.id,
    serviceName: booking.serviceName,
    bookingDate: booking.date,
    bookingTime: booking.time,
    totalAmount: booking.totalAmount,
    status: newStatus,
  });
};
