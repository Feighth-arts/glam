# Glamease - Beauty Services Platform

A comprehensive beauty services booking platform built with Next.js, featuring provider, client, and admin dashboards with full database integration.

## Features

### 🎯 Multi-Role System
- **Providers**: Manage services, bookings, earnings, and client interactions
- **Clients**: Browse services, book appointments, earn rewards, track history
- **Admins**: Platform oversight, user management, financial tracking, analytics

### 💎 Core Functionality
- **Service Management**: CRUD operations for beauty services with availability scheduling
- **Booking System**: Real-time booking with status tracking and notifications
- **Payment Integration**: M-Pesa simulation with STK push flow (demo mode)
- **Email Notifications**: EmailJS integration for booking confirmations and updates
- **Rewards System**: Points-based loyalty program with tier management
- **Review System**: Client feedback and provider ratings
- **Notification System**: Real-time updates for all user actions
- **Reporting**: PDF generation for earnings, services, and client analytics

### 🛠 Technical Stack
- **Frontend**: Next.js 15.4.6, React 19.1.0, Tailwind CSS 4.0
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL with comprehensive schema
- **Authentication**: localStorage-based session management
- **Payments**: M-Pesa simulation modal
- **Email**: EmailJS for notifications
- **File Generation**: PDF reports with jsPDF
- **Icons**: Lucide React, React Icons

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm/yarn/pnpm

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd glamease
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

Configure your `.env.local`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/glamease"

# EmailJS Configuration (optional - for email notifications)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

4. Set up the database
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
app/
├── (open)/                 # Public routes
│   ├── services/          # Service browsing
│   └── auth/              # Authentication
├── (protected)/           # Authenticated routes
│   ├── provider/          # Provider dashboard
│   ├── client/            # Client dashboard
│   └── admin/             # Admin dashboard
├── api/                   # API endpoints
│   ├── bookings/          # Booking management
│   ├── services/          # Service operations
│   ├── dashboard/         # Dashboard data
│   ├── notifications/     # Notification system
│   └── users/             # User management
lib/
├── prisma.js             # Database client
├── auth-helper.js        # Authentication utilities
├── api-client.js         # API client utilities
└── pdf-generator.js      # Report generation
prisma/
├── schema.prisma         # Database schema
└── seed.js              # Database seeding
```

## Database Schema

The application uses a comprehensive PostgreSQL schema with:
- **Users**: Multi-role user management (Admin, Provider, Client)
- **Services**: Service catalog with categories and provider relationships
- **Bookings**: Complete booking lifecycle with status tracking
- **Payments**: Payment processing with M-Pesa integration
- **Reviews**: Rating and feedback system
- **Notifications**: Multi-channel notification system
- **Rewards**: Points-based loyalty program
- **Analytics**: Comprehensive tracking and reporting

## Development Authentication

The project includes a development authentication system:
- Set `DEV_MODE=true` in environment variables
- Use `DEV_USER_ID` to switch between user roles:
  - `admin_001` - Admin access
  - `prov_001` - Provider access  
  - `client_001` - Client access

## API Endpoints

### Core APIs
- `GET/POST /api/services` - Service management
- `GET/POST/PUT /api/bookings` - Booking operations
- `GET /api/dashboard` - Role-specific dashboard data
- `GET/PUT /api/users/profile` - User profile management
- `GET/PATCH/DELETE /api/notifications` - Notification system

### Provider-Specific
- `GET/POST /api/provider/services` - Provider service management
- `PUT/DELETE /api/provider/services/[id]` - Individual service operations

## EmailJS Setup (Optional)

To enable email notifications:

1. Create a free account at [EmailJS](https://www.emailjs.com/)
2. Create an email service (Gmail, Outlook, etc.)
3. Create an email template with these variables:
   - `{{to_name}}`, `{{to_email}}`, `{{subject}}`, `{{message}}`
   - `{{booking_id}}`, `{{service_name}}`, `{{booking_date}}`, `{{booking_time}}`
   - `{{total_amount}}`, `{{status}}`
4. Add your credentials to `.env.local`

## M-Pesa Simulation

The platform includes a simulated M-Pesa STK push flow:
- Enter phone number (10 digits)
- Enter PIN (4 digits)
- 90% success rate simulation
- Generates transaction IDs automatically
- No actual M-Pesa API integration required

## Features Status

✅ **Completed**
- Multi-role dashboard system
- Database integration with Prisma
- Service management (CRUD)
- Booking system with status tracking
- M-Pesa payment simulation
- Email notifications (EmailJS)
- Notification system
- User profile management
- PDF report generation
- Rewards/points system
- Review and rating system

🚧 **Future Enhancements**
- Real M-Pesa API integration
- Real-time notifications (WebSockets)
- Advanced analytics
- Mobile app

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and ensure code quality
5. Submit a pull request

## License

This project is licensed under the MIT License.
