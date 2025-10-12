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
- **Payment Integration**: Secure payment processing with M-Pesa integration ready
- **Rewards System**: Points-based loyalty program with tier management
- **Review System**: Client feedback and provider ratings
- **Notification System**: Real-time updates for all user actions
- **Reporting**: PDF generation for earnings, services, and client analytics

### 🛠 Technical Stack
- **Frontend**: Next.js 15.4.6, React 19.1.0, Tailwind CSS 4.0
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL with comprehensive schema
- **Authentication**: Development bypass system (production-ready structure)
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
DEV_MODE=true
DEV_USER_ID=prov_001  # or client_001, admin_001
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

## Features Status

✅ **Completed**
- Multi-role dashboard system
- Database integration with Prisma
- Service management (CRUD)
- Booking system with status tracking
- Notification system
- User profile management
- PDF report generation
- Rewards/points system
- Review and rating system

🚧 **In Development**
- Payment integration (M-Pesa)
- Real-time notifications
- Advanced analytics
- Mobile responsiveness optimization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and ensure code quality
5. Submit a pull request

## License

This project is licensed under the MIT License.
