# Comprehensive Database Analysis - Missing Pieces & Redundancies

## Critical Missing Models

### 1. **Reward Redemptions** (Missing)
```sql
-- Track actual reward redemptions and usage
CREATE TABLE reward_redemptions (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) REFERENCES users(id),
  reward_type ENUM('discount', 'free_service'),
  reward_name VARCHAR(255),
  points_used INT,
  discount_percentage INT,
  max_discount_amount DECIMAL(10,2),
  min_spend DECIMAL(10,2),
  status ENUM('active', 'used', 'expired') DEFAULT 'active',
  expires_at TIMESTAMP,
  used_at TIMESTAMP,
  booking_id VARCHAR(50) REFERENCES bookings(id), -- when used
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. **Points Transactions** (Missing)
```sql
-- Detailed points history for transparency
CREATE TABLE points_transactions (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) REFERENCES users(id),
  type ENUM('earned', 'redeemed', 'expired', 'bonus'),
  points INT,
  source VARCHAR(255), -- 'booking', 'review', 'referral', 'first_booking'
  reference_id VARCHAR(50), -- booking_id, review_id, etc.
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. **Platform Settings** (Missing)
```sql
-- Dynamic platform configuration
CREATE TABLE platform_settings (
  id VARCHAR(50) PRIMARY KEY,
  category VARCHAR(100), -- 'commission', 'points', 'notifications'
  key VARCHAR(100),
  value JSON,
  description TEXT,
  updated_by VARCHAR(50) REFERENCES users(id),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. **Provider Availability** (Missing)
```sql
-- Detailed provider availability management
CREATE TABLE provider_availability (
  id VARCHAR(50) PRIMARY KEY,
  provider_id VARCHAR(50) REFERENCES users(id),
  day_of_week INT, -- 0=Sunday, 1=Monday, etc.
  start_time TIME,
  end_time TIME,
  is_available BOOLEAN DEFAULT true,
  break_start TIME,
  break_end TIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Special dates (holidays, vacations)
CREATE TABLE provider_special_dates (
  id VARCHAR(50) PRIMARY KEY,
  provider_id VARCHAR(50) REFERENCES users(id),
  date DATE,
  is_available BOOLEAN DEFAULT false,
  reason VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. **Booking Time Slots** (Missing)
```sql
-- Available time slots for bookings
CREATE TABLE booking_time_slots (
  id VARCHAR(50) PRIMARY KEY,
  provider_id VARCHAR(50) REFERENCES users(id),
  service_id INT REFERENCES services(id),
  date DATE,
  start_time TIME,
  end_time TIME,
  is_booked BOOLEAN DEFAULT false,
  booking_id VARCHAR(50) REFERENCES bookings(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 6. **Referral System** (Missing)
```sql
-- User referral tracking
CREATE TABLE referrals (
  id VARCHAR(50) PRIMARY KEY,
  referrer_id VARCHAR(50) REFERENCES users(id),
  referred_id VARCHAR(50) REFERENCES users(id),
  referral_code VARCHAR(20) UNIQUE,
  status ENUM('pending', 'completed', 'rewarded') DEFAULT 'pending',
  points_awarded INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);
```

### 7. **Service Categories** (Missing)
```sql
-- Proper service categorization
CREATE TABLE service_categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) UNIQUE,
  description TEXT,
  icon VARCHAR(100),
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Update services table to reference categories
ALTER TABLE services ADD COLUMN category_id INT REFERENCES service_categories(id);
```

### 8. **Booking Status History** (Missing)
```sql
-- Track booking status changes
CREATE TABLE booking_status_history (
  id VARCHAR(50) PRIMARY KEY,
  booking_id VARCHAR(50) REFERENCES bookings(id),
  old_status BookingStatus,
  new_status BookingStatus,
  changed_by VARCHAR(50) REFERENCES users(id),
  reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 9. **Provider Earnings Tracking** (Missing)
```sql
-- Detailed earnings breakdown
CREATE TABLE provider_earnings (
  id VARCHAR(50) PRIMARY KEY,
  provider_id VARCHAR(50) REFERENCES users(id),
  booking_id VARCHAR(50) REFERENCES bookings(id),
  gross_amount DECIMAL(10,2),
  commission_amount DECIMAL(10,2),
  net_amount DECIMAL(10,2),
  payout_status ENUM('pending', 'processing', 'paid', 'failed') DEFAULT 'pending',
  payout_date TIMESTAMP,
  payout_reference VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 10. **Email Templates** (Missing)
```sql
-- Dynamic email template management
CREATE TABLE email_templates (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) UNIQUE,
  subject VARCHAR(255),
  template_html TEXT,
  template_text TEXT,
  variables JSON, -- Available template variables
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Schema Redundancies to Fix

### 1. **Payment-User Relation Issue**
```sql
-- PROBLEM: Payment references user by phone, but phone can be null
-- FIX: Remove this relation or make it optional
-- Current: user User @relation(fields: [phoneNumber], references: [phone])
-- Fix: Remove this relation entirely
```

### 2. **Booking Time Storage**
```sql
-- PROBLEM: Separate date and time fields
-- FIX: Use single datetime field
-- Current: bookingDate DATE, bookingTime TIME
-- Better: booking_datetime TIMESTAMP
```

### 3. **Service Category Redundancy**
```sql
-- PROBLEM: Category stored as string in services table
-- FIX: Normalize with service_categories table
-- Current: category VARCHAR(100)
-- Better: category_id INT REFERENCES service_categories(id)
```

## Updated Prisma Schema Additions

```prisma
model RewardRedemption {
  id                String   @id @default(cuid())
  userId            String
  rewardType        RewardType
  rewardName        String
  pointsUsed        Int
  discountPercentage Int?
  maxDiscountAmount Decimal? @db.Decimal(10, 2)
  minSpend          Decimal? @db.Decimal(10, 2)
  status            RedemptionStatus @default(ACTIVE)
  expiresAt         DateTime
  usedAt            DateTime?
  bookingId         String?
  createdAt         DateTime @default(now())

  user    User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  booking Booking? @relation(fields: [bookingId], references: [id])

  @@map("reward_redemptions")
}

model PointsTransaction {
  id          String              @id @default(cuid())
  userId      String
  type        PointsTransactionType
  points      Int
  source      String
  referenceId String?
  description String?
  createdAt   DateTime            @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("points_transactions")
}

model PlatformSetting {
  id          String   @id @default(cuid())
  category    String
  key         String
  value       Json
  description String?
  updatedBy   String
  updatedAt   DateTime @default(now())

  updater User @relation(fields: [updatedBy], references: [id])

  @@unique([category, key])
  @@map("platform_settings")
}

model ProviderAvailability {
  id          String  @id @default(cuid())
  providerId  String
  dayOfWeek   Int     // 0=Sunday, 1=Monday, etc.
  startTime   String  // "09:00"
  endTime     String  // "17:00"
  isAvailable Boolean @default(true)
  breakStart  String?
  breakEnd    String?
  createdAt   DateTime @default(now())

  provider User @relation(fields: [providerId], references: [id], onDelete: Cascade)

  @@map("provider_availability")
}

model Referral {
  id           String        @id @default(cuid())
  referrerId   String
  referredId   String
  referralCode String        @unique
  status       ReferralStatus @default(PENDING)
  pointsAwarded Int          @default(0)
  createdAt    DateTime      @default(now())
  completedAt  DateTime?

  referrer User @relation("UserReferrals", fields: [referrerId], references: [id])
  referred User @relation("UserReferred", fields: [referredId], references: [id])

  @@map("referrals")
}

model ServiceCategory {
  id          Int      @id @default(autoincrement())
  name        String   @unique
  description String?
  icon        String?
  sortOrder   Int      @default(0)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())

  services Service[]

  @@map("service_categories")
}

// Additional Enums
enum RewardType {
  DISCOUNT
  FREE_SERVICE
}

enum RedemptionStatus {
  ACTIVE
  USED
  EXPIRED
}

enum PointsTransactionType {
  EARNED
  REDEEMED
  EXPIRED
  BONUS
}

enum ReferralStatus {
  PENDING
  COMPLETED
  REWARDED
}
```

## API Endpoints Still Needed

### Missing Critical Endpoints:
1. `POST /api/rewards/redeem` - Redeem points for rewards
2. `GET /api/provider/availability` - Get/set availability
3. `POST /api/bookings/time-slots` - Check available slots
4. `GET /api/points/history` - Points transaction history
5. `POST /api/referrals/create` - Generate referral codes
6. `GET /api/admin/settings` - Platform settings management
7. `POST /api/provider/earnings/payout` - Process payouts

## Data Integrity Issues to Address

1. **Orphaned Records**: Ensure cascade deletes work properly
2. **Booking Conflicts**: Prevent double-booking same time slot
3. **Points Balance**: Ensure points can't go negative
4. **Commission Calculation**: Validate commission amounts
5. **Reward Expiry**: Auto-expire unused rewards
6. **Provider Verification**: Ensure only verified providers can receive bookings

This analysis reveals significant gaps in the current schema that need to be addressed for a production-ready system.