# Glamease Backend Integration Guide

## Overview
Database design, M-Pesa integration strategy, and EmailJS notification system for Glamease beauty services platform.

## Database Schema

### Core Tables

```sql
-- Users (Admin, Provider, Client)
CREATE TABLE users (
  id VARCHAR(50) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role ENUM('admin', 'provider', 'client'),
  status ENUM('active', 'inactive', 'suspended'),
  location VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services catalog
CREATE TABLE services (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  base_price DECIMAL(10,2),
  duration INT,
  points INT,
  description TEXT,
  status ENUM('active', 'inactive')
);

-- Bookings
CREATE TABLE bookings (
  id VARCHAR(50) PRIMARY KEY,
  client_id VARCHAR(50) REFERENCES users(id),
  provider_id VARCHAR(50) REFERENCES users(id),
  service_id INT REFERENCES services(id),
  booking_date DATE,
  booking_time TIME,
  status ENUM('pending_payment', 'paid', 'confirmed', 'completed', 'cancelled'),
  amount DECIMAL(10,2),
  commission DECIMAL(10,2),
  provider_earning DECIMAL(10,2),
  points_earned INT,
  payment_id VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments (M-Pesa integration)
CREATE TABLE payments (
  id VARCHAR(50) PRIMARY KEY,
  booking_id VARCHAR(50) REFERENCES bookings(id),
  mpesa_checkout_id VARCHAR(100),
  phone_number VARCHAR(20),
  amount DECIMAL(10,2),
  status ENUM('initiated', 'pending', 'completed', 'failed', 'demo_success'),
  demo_mode BOOLEAN DEFAULT true,
  transaction_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL
);

-- Notifications
CREATE TABLE notifications (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) REFERENCES users(id),
  type ENUM('email', 'sms', 'push'),
  status ENUM('pending', 'sent', 'failed'),
  content JSON,
  sent_at TIMESTAMP NULL
);
```

## M-Pesa Demo Strategy

### Problem
- M-Pesa sandbox: STK push works, no real callbacks
- Cannot verify payments in demo
- Need realistic flow without financial risk

### Solution: Simulated Payment Flow

#### Payment Initiation
```javascript
// /api/payments/initiate
const initiatePayment = async (bookingId, amount, phone) => {
  // Real STK push for authenticity
  const stkResponse = await mpesaSTKPush({
    amount, phone, accountReference: bookingId
  });
  
  // Create payment record in demo mode
  const payment = await db.payments.create({
    booking_id: bookingId,
    mpesa_checkout_id: stkResponse.CheckoutRequestID,
    phone_number: phone,
    amount: amount,
    status: 'initiated',
    demo_mode: true
  });
  
  // Auto-simulate callback after 30 seconds
  setTimeout(() => simulatePaymentCallback(payment.id), 30000);
  
  return { success: true, paymentId: payment.id };
};
```

#### Payment Simulation
```javascript
const simulatePaymentCallback = async (paymentId) => {
  // 90% success rate for realistic demo
  const isSuccess = Math.random() > 0.1;
  const status = isSuccess ? 'demo_success' : 'failed';
  
  await db.payments.update(paymentId, { 
    status, completed_at: new Date(),
    transaction_id: isSuccess ? `DEMO${Date.now()}` : null
  });
  
  if (isSuccess) {
    const payment = await db.payments.findById(paymentId);
    await db.bookings.update(payment.booking_id, { status: 'paid' });
    await sendNotifications('payment_success', { paymentId });
  } else {
    await sendNotifications('payment_failed', { paymentId });
  }
};
```

#### Admin Demo Controls
```javascript
// /api/admin/payments/control
const adminPaymentControl = {
  forceSuccess: (paymentId) => simulatePaymentCallback(paymentId, true),
  forceFailure: (paymentId) => simulatePaymentCallback(paymentId, false),
  viewPending: () => db.payments.findWhere({ status: 'initiated' })
};
```

## EmailJS Multi-Actor System

### Problem
- EmailJS free tier limits senders
- Need all 3 actors to send emails
- Want single template system

### Solution: CSS Visibility Toggle

#### Universal Email Template
```html
<div style="font-family: Arial, sans-serif; max-width: 600px;">
  <!-- Header -->
  <div style="background: #F43F5E; color: white; padding: 20px; text-align: center;">
    <h1>Glamease</h1>
  </div>
  
  <!-- Admin Section -->
  <div style="display: {{show_admin}}; padding: 20px;">
    <h2>Admin Notification</h2>
    <p>{{admin_message}}</p>
    <div style="background: #f8f9fa; padding: 15px;">
      Booking ID: {{booking_id}}<br>
      Amount: KES {{amount}}<br>
      Provider: {{provider_name}}
    </div>
  </div>
  
  <!-- Provider Section -->
  <div style="display: {{show_provider}}; padding: 20px;">
    <h2>Provider Update</h2>
    <p>{{provider_message}}</p>
    <div style="background: #f8f9fa; padding: 15px;">
      Service: {{service_name}}<br>
      Date: {{booking_date}}<br>
      Your Earning: KES {{provider_earning}}
    </div>
  </div>
  
  <!-- Client Section -->
  <div style="display: {{show_client}}; padding: 20px;">
    <h2>Booking Confirmation</h2>
    <p>{{client_message}}</p>
    <div style="background: #f8f9fa; padding: 15px;">
      Service: {{service_name}}<br>
      Provider: {{provider_name}}<br>
      Date: {{booking_date}}<br>
      Points Earned: {{points_earned}}
    </div>
  </div>
  
  <!-- Footer -->
  <div style="background: #f8f9fa; padding: 20px; text-align: center;">
    <p>Best regards,<br>The Glamease Team</p>
  </div>
</div>
```

#### Email Service Implementation
```javascript
// /lib/email-service.js
import emailjs from '@emailjs/browser';

const sendEmail = async (actorType, emailData) => {
  const templateParams = {
    // Hide all sections
    show_admin: 'none',
    show_provider: 'none',
    show_client: 'none',
    
    // Show only relevant section
    [`show_${actorType}`]: 'block',
    
    // Data
    to_email: emailData.recipient,
    [`${actorType}_message`]: emailData.message,
    ...emailData.customFields
  };
  
  return await emailjs.send('service_id', 'template_id', templateParams);
};
```

#### Notification Events
```javascript
const NOTIFICATION_TEMPLATES = {
  payment_success: {
    admin: { message: 'New payment received for booking {{booking_id}}' },
    provider: { message: 'Payment confirmed! Your booking is active.' },
    client: { message: 'Payment successful! Booking confirmed.' }
  },
  payment_failed: {
    client: { message: 'Payment failed. Please try again.' }
  },
  booking_reminder: {
    client: { message: 'Reminder: Booking tomorrow at {{booking_time}}' },
    provider: { message: 'Reminder: Client booking tomorrow at {{booking_time}}' }
  }
};

const sendNotifications = async (eventType, data) => {
  const templates = NOTIFICATION_TEMPLATES[eventType];
  
  for (const [actorType, template] of Object.entries(templates)) {
    await sendEmail(actorType, {
      recipient: data[`${actorType}_email`],
      message: template.message,
      ...data
    });
  }
};
```

## API Routes Structure

```
/api/
├── auth/
│   ├── login
│   ├── signup
│   └── logout
├── bookings/
│   ├── create
│   ├── update
│   └── [id]
├── payments/
│   ├── initiate
│   ├── status
│   └── simulate (demo)
├── notifications/
│   └── send
└── admin/
    ├── payments/control
    └── reports/generate
```

## Demo Benefits

1. **Realistic UX**: Users see actual M-Pesa STK push
2. **Controlled Testing**: Admin can force payment outcomes  
3. **Full Notification Flow**: All actors receive emails
4. **No Financial Risk**: Sandbox prevents real charges
5. **Production-Ready**: Easy to swap demo logic for real callbacks

## Production Migration

1. Replace `demo_mode: true` with real M-Pesa callbacks
2. Remove `simulatePaymentCallback` function
3. Implement real callback endpoint `/api/payments/callback`
4. Add error handling and retry logic
5. Enable real SMS notifications

This architecture provides fully functional demo showcasing all features while maintaining production-ready structure.