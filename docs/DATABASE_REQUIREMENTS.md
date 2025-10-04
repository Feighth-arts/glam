# Database Requirements Analysis

## Route Analysis & DB Needs

### Authentication Routes
- `/login` - User authentication
- `/signup` - User registration
- Password reset (future)

### Public Routes
- `/` - Home page (service stats)
- `/services` - Browse services
- `/about` - Company info
- `/contact` - Contact form submissions

### Protected Routes Analysis

## ADMIN Routes & DB Needs

### `/admin/dashboard`
**Data Required:**
- Platform statistics (total users, bookings, revenue)
- Recent activity feed
- System alerts

**DB Operations:**
```sql
-- Platform stats
SELECT COUNT(*) FROM users WHERE role = 'CLIENT';
SELECT COUNT(*) FROM users WHERE role = 'PROVIDER';
SELECT COUNT(*) FROM bookings;
SELECT SUM(amount) FROM bookings WHERE status = 'COMPLETED';
SELECT SUM(commission) FROM bookings WHERE status = 'COMPLETED';

-- Recent activity
SELECT * FROM bookings ORDER BY created_at DESC LIMIT 10;
SELECT * FROM users ORDER BY created_at DESC LIMIT 5;
```

### `/admin/users`
**Data Required:**
- All users with filters (role, status, date)
- User statistics and activity
- User management actions

**DB Operations:**
```sql
SELECT * FROM users WHERE role = ? AND status = ?;
UPDATE users SET status = ? WHERE id = ?;
DELETE FROM users WHERE id = ?;
```

### `/admin/bookings`
**Data Required:**
- All bookings with filters
- Booking details with relations
- Booking status management

**DB Operations:**
```sql
SELECT b.*, u1.name as client_name, u2.name as provider_name, s.name as service_name
FROM bookings b
JOIN users u1 ON b.client_id = u1.id
JOIN users u2 ON b.provider_id = u2.id
JOIN services s ON b.service_id = s.id;
```

### `/admin/services`
**Data Required:**
- Service catalog management
- Service statistics
- Provider-service relationships

**DB Operations:**
```sql
SELECT * FROM services;
INSERT INTO services (name, category, base_price, duration, points, description);
UPDATE services SET status = ? WHERE id = ?;
```

### `/admin/finances`
**Data Required:**
- Revenue analytics
- Commission tracking
- Payment status overview

**DB Operations:**
```sql
SELECT SUM(amount) as total_revenue, SUM(commission) as total_commission
FROM bookings WHERE status = 'COMPLETED';

SELECT DATE(created_at) as date, SUM(amount) as daily_revenue
FROM bookings GROUP BY DATE(created_at);
```

### `/admin/reports`
**Data Required:**
- Comprehensive analytics
- Export data
- Trend analysis

### `/admin/support`
**Data Required:**
- Support tickets/messages
- User issues
- System logs

### `/admin/settings`
**Data Required:**
- Platform configuration
- Commission rates
- System settings

## PROVIDER Routes & DB Needs

### `/provider/dashboard`
**Data Required:**
- Provider statistics (bookings, revenue, ratings)
- Today's schedule
- Performance metrics

**DB Operations:**
```sql
SELECT COUNT(*) as total_bookings, SUM(provider_earning) as total_revenue
FROM bookings WHERE provider_id = ? AND status = 'COMPLETED';

SELECT * FROM bookings 
WHERE provider_id = ? AND booking_date = CURRENT_DATE;
```

### `/provider/services`
**Data Required:**
- Provider's services
- Service availability
- Pricing management

**DB Operations:**
```sql
SELECT ps.*, s.name, s.category, s.base_price
FROM provider_services ps
JOIN services s ON ps.service_id = s.id
WHERE ps.provider_id = ?;
```

### `/provider/bookings`
**Data Required:**
- Provider's bookings
- Client information
- Booking management

### `/provider/earnings`
**Data Required:**
- Earnings breakdown
- Commission details
- Payment history

### `/provider/profile`
**Data Required:**
- Provider information
- Business details
- Working hours/availability

## CLIENT Routes & DB Needs

### `/client/dashboard`
**Data Required:**
- Client statistics (bookings, points, spending)
- Upcoming appointments
- Recommendations

**DB Operations:**
```sql
SELECT COUNT(*) as total_bookings, SUM(amount) as total_spent
FROM bookings WHERE client_id = ? AND status = 'COMPLETED';

SELECT current_points, lifetime_points, tier
FROM user_points WHERE user_id = ?;
```

### `/client/services`
**Data Required:**
- Available services
- Provider information
- Booking availability

### `/client/bookings`
**Data Required:**
- Client's booking history
- Upcoming appointments
- Booking management

### `/client/rewards`
**Data Required:**
- Points balance
- Available rewards
- Redemption history

### `/client/notifications`
**Data Required:**
- User notifications
- Booking updates
- System messages

## Additional DB Requirements

### Authentication & Security
```sql
-- Password reset tokens
CREATE TABLE password_reset_tokens (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) REFERENCES users(id),
  token VARCHAR(255) UNIQUE,
  expires_at TIMESTAMP,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User sessions
CREATE TABLE user_sessions (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) REFERENCES users(id),
  token VARCHAR(255) UNIQUE,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Contact & Support
```sql
-- Contact form submissions
CREATE TABLE contact_messages (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  subject VARCHAR(255),
  message TEXT,
  status ENUM('new', 'read', 'replied') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Support tickets
CREATE TABLE support_tickets (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) REFERENCES users(id),
  subject VARCHAR(255),
  description TEXT,
  status ENUM('open', 'in_progress', 'resolved', 'closed') DEFAULT 'open',
  priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Reviews & Ratings
```sql
-- Service reviews
CREATE TABLE reviews (
  id VARCHAR(50) PRIMARY KEY,
  booking_id VARCHAR(50) REFERENCES bookings(id),
  client_id VARCHAR(50) REFERENCES users(id),
  provider_id VARCHAR(50) REFERENCES users(id),
  service_id INT REFERENCES services(id),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### System Logs
```sql
-- Activity logs
CREATE TABLE activity_logs (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) REFERENCES users(id),
  action VARCHAR(255),
  entity_type VARCHAR(100),
  entity_id VARCHAR(50),
  details JSON,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints Needed

### Authentication
- `POST /api/auth/login`
- `POST /api/auth/signup`
- `POST /api/auth/logout`
- `POST /api/auth/reset-password`

### Users
- `GET /api/users/profile`
- `PUT /api/users/profile`
- `GET /api/admin/users`
- `PUT /api/admin/users/[id]`

### Bookings
- `GET /api/bookings`
- `POST /api/bookings`
- `PUT /api/bookings/[id]`
- `DELETE /api/bookings/[id]`

### Services
- `GET /api/services`
- `POST /api/services`
- `PUT /api/services/[id]`

### Payments
- `POST /api/payments/initiate`
- `POST /api/payments/callback`
- `GET /api/payments/status/[id]`

### Notifications
- `GET /api/notifications`
- `POST /api/notifications/send`
- `PUT /api/notifications/[id]/read`

### Reports
- `GET /api/reports/dashboard`
- `GET /api/reports/revenue`
- `GET /api/reports/bookings`

This analysis shows we need to extend our current schema with authentication, support, reviews, and logging tables.