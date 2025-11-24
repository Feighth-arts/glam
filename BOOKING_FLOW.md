# Complete Booking Flow - Glamease

## Booking Lifecycle States

```
PENDING_PAYMENT → PAID → CONFIRMED → COMPLETED → [REVIEW]
                    ↓
                CANCELLED (can happen from PAID or CONFIRMED)
```

## Detailed Flow

### 1. BOOKING CREATION (PENDING_PAYMENT)
**Trigger:** Client clicks "Book Now" on service
**Location:** `/client/services` → BookingModal
**API:** `POST /api/bookings/create`

**Actions:**
- ✅ Validate service ID (only 1=Manicure or 2=Pedicure)
- ✅ Check provider-specific points availability
- ✅ Calculate discount (max 30% using points)
- ✅ Create booking with status `PENDING_PAYMENT`
- ✅ Create payment record with status `INITIATED`
- ✅ Deduct redeemed points from client
- ✅ Create points transaction record

**Database Changes:**
- Booking: status=PENDING_PAYMENT, amount, commission, providerEarning, pointsEarned
- Payment: status=INITIATED, amount, phoneNumber
- UserPoints: currentPoints decremented by pointsToRedeem
- PointsTransaction: type=REDEEMED, points=-X

**Notifications:** None

---

### 2. PAYMENT (PAID)
**Trigger:** Client completes M-Pesa payment
**Location:** `MpesaSimulation` component
**API:** 
- `POST /api/mpesa/stk-push` (initiate)
- `POST /api/mpesa/query` (poll status)
- `POST /api/mpesa/simulate-success` (demo fallback)

**Actions:**
- ✅ Send STK push to client phone
- ✅ Poll payment status (7 attempts, 21 seconds)
- ✅ Fallback to simulate-success (demo mode)
- ✅ Update payment status to `COMPLETED`
- ✅ Update booking status to `PAID`
- ✅ Send email to provider

**Database Changes:**
- Payment: status=COMPLETED, transactionId=MpesaReceiptNumber, completedAt
- Booking: status=PAID

**Notifications:**
- ✅ Email to provider (new booking notification)

**Email Content:**
```
To: Provider
Subject: New Booking Received - Glamease
Body: Booking details (ID, client, service, date, time, amount, location)
```

---

### 3. PROVIDER CONFIRMATION (CONFIRMED)
**Trigger:** Provider clicks "Confirm" button
**Location:** `/provider/bookings`
**API:** `PUT /api/bookings/[id]` with status='CONFIRMED'

**Actions:**
- ✅ Verify provider owns booking
- ✅ Update booking status to `CONFIRMED`
- ✅ Send email to client

**Database Changes:**
- Booking: status=CONFIRMED

**Notifications:**
- ✅ Email to client (booking confirmed)

**Email Content:**
```
To: Client
Subject: Booking Update - CONFIRMED
Body: Your booking has been confirmed by the provider
Details: Booking ID, service, date, time, amount
```

---

### 4. SERVICE COMPLETION (COMPLETED)
**Trigger:** Provider clicks "Complete" button
**Location:** `/provider/bookings`
**API:** `PUT /api/bookings/[id]` with status='COMPLETED'

**Actions:**
- ✅ Verify provider owns booking
- ✅ Update booking status to `COMPLETED`
- ✅ Award points to client (currentPoints + lifetimePoints)
- ✅ Update client tier (Bronze/Gold/Platinum)
- ✅ Create points transaction
- ✅ Create notification for client

**Database Changes:**
- Booking: status=COMPLETED
- UserPoints: currentPoints += pointsEarned, lifetimePoints += pointsEarned, tier updated
- PointsTransaction: type=EARNED, points=+X
- Notification: type=PUSH, subject="Points Awarded"

**Tier Thresholds:**
- Bronze: 0-999 lifetime points
- Gold: 1000-4999 lifetime points
- Platinum: 5000+ lifetime points

**Notifications:**
- ✅ Push notification to client (points awarded)

---

### 5. CLIENT REVIEW (REVIEW)
**Trigger:** Client clicks "Rate" button on completed booking
**Location:** `/client/bookings`
**API:** `POST /api/reviews`

**Validation:**
- ✅ Booking must be COMPLETED
- ✅ Client must own booking
- ✅ No existing review
- ✅ Rating 1-5 required

**Actions:**
- ✅ Create review record
- ✅ Link to booking, client, provider, service
- ✅ Create notification for provider
- ✅ Send email to provider

**Database Changes:**
- Review: bookingId, clientId, providerId, serviceId, rating, comment
- Notification: type=PUSH, subject="New Review Received"

**Notifications:**
- ✅ Push notification to provider
- ✅ Email to provider (review notification)

**Email Content:**
```
To: Provider
Subject: New Review Received - Glamease
Body: You have received a new review from a client!
Details: Client name, rating (stars), comment
```

---

### 6. CANCELLATION (CANCELLED)
**Trigger:** Client or provider clicks "Cancel"
**Location:** `/client/bookings` or `/provider/bookings`
**API:** `PUT /api/bookings/[id]` with status='CANCELLED'

**Allowed From:**
- PAID (client or provider can cancel)
- CONFIRMED (client or provider can cancel)

**Actions:**
- ✅ Update booking status to `CANCELLED`
- ✅ Clear caches

**Database Changes:**
- Booking: status=CANCELLED

**Notifications:** None (could be added)

**Note:** Points are NOT refunded on cancellation

---

## Points System

### Earning Points
- **When:** Booking status changes to COMPLETED
- **Amount:** Service-specific (Manicure=15pts, Pedicure=20pts)
- **Calculation:** Defined in service.points field
- **Storage:** UserPoints.currentPoints and UserPoints.lifetimePoints

### Redeeming Points
- **When:** During booking creation
- **Restriction:** Can only redeem points earned from same provider
- **Max Discount:** 30% of service price
- **Validation:** 
  - Points earned from provider (sum of completed bookings)
  - Minus points already redeemed with provider
  - Must have sufficient available points

### Provider-Specific Points
```javascript
// Example: Client has 100 total points
// Earned 50 from Provider A, 50 from Provider B
// Can redeem max 50 with Provider A
// Can redeem max 50 with Provider B
```

---

## Email Notifications Summary

| Event | Recipient | Trigger | Location |
|-------|-----------|---------|----------|
| Payment Complete | Provider | Client pays | Client-side (bookings/services) |
| Booking Confirmed | Client | Provider confirms | Client-side (provider bookings) |
| Review Submitted | Provider | Client reviews | Client-side (client bookings) |

---

## Cache Invalidation

**When payment succeeds:**
- client-bookings
- client-dashboard
- client-services
- provider-bookings
- provider-dashboard
- admin-bookings
- admin-dashboard

**When booking status changes:**
- provider-bookings
- provider-dashboard
- client-bookings
- client-dashboard
- admin-bookings
- admin-dashboard

**When review submitted:**
- client-bookings
- client-dashboard
- provider-bookings
- provider-dashboard

---

## Status Transition Rules

| From | To | Who | Validation |
|------|-----|-----|------------|
| PENDING_PAYMENT | PAID | System | Payment completed |
| PAID | CONFIRMED | Provider | Provider owns booking |
| PAID | CANCELLED | Client/Provider | - |
| CONFIRMED | COMPLETED | Provider | Provider owns booking |
| CONFIRMED | CANCELLED | Client/Provider | - |
| COMPLETED | - | - | Final state (except review) |

---

## Commission & Earnings

**Commission Rate:** 15%

**Calculation:**
```javascript
finalAmount = basePrice - pointsDiscount
commission = finalAmount * 0.15
providerEarning = finalAmount - commission
```

**Example:**
- Base Price: KES 2,000
- Points Discount: KES 200 (10 points redeemed)
- Final Amount: KES 1,800
- Commission: KES 270 (15%)
- Provider Earning: KES 1,530

---

## Coordination Checklist

✅ **Booking Creation**
- Service validation (only IDs 1, 2)
- Provider-specific points validation
- Payment record created
- Points deducted if redeemed

✅ **Payment Flow**
- STK push initiated
- Status polling
- Fallback to simulation
- Provider email sent
- Cache cleared

✅ **Provider Confirmation**
- Client email sent
- Cache cleared

✅ **Service Completion**
- Points awarded (no duplication)
- Tier updated
- Notification created
- Cache cleared

✅ **Review Submission**
- Validation (completed only, no duplicates)
- Provider notification created
- Provider email sent
- Cache cleared

✅ **Cancellation**
- Status updated
- Cache cleared

---

## Known Issues & Limitations

1. **M-Pesa Sandbox:** Returns HTML errors, system uses simulate-success fallback
2. **Callback URL:** Points to webhook.site, won't work in production
3. **Points Refund:** Not implemented on cancellation
4. **Email Reliability:** Client-side sending, may fail silently
5. **Duplicate Endpoint:** `/api/bookings/complete` deprecated, use PUT `/api/bookings/[id]`

---

## Testing Flow

1. **Login as Client** (DEV_USER_ID=client_001)
2. **Browse Services** → /client/services
3. **Book Manicure** → Select date/time, optionally redeem points
4. **Pay with M-Pesa** → Enter phone (0712345678), wait for simulation
5. **Check Provider Email** → Should receive booking notification
6. **Login as Provider** (DEV_USER_ID=prov_001)
7. **View Bookings** → /provider/bookings
8. **Confirm Booking** → Click "Confirm" button
9. **Check Client Email** → Should receive confirmation
10. **Complete Booking** → Click "Complete" button
11. **Login as Client** → Check points awarded
12. **Submit Review** → Rate 5 stars, add comment
13. **Check Provider Email** → Should receive review notification

---

## Database Schema Relationships

```
Booking
├── client (User)
├── provider (User)
├── service (Service)
├── payment (Payment) 1:1
└── review (Review) 1:1

Review
├── booking (Booking)
├── client (User)
├── provider (User)
└── service (Service)

UserPoints
└── user (User) 1:1

PointsTransaction
└── user (User)
```

---

## API Endpoints Summary

| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
| /api/bookings/create | POST | Create booking | Client |
| /api/bookings/[id] | GET | Get booking details | Any |
| /api/bookings/[id] | PUT | Update booking status | Client/Provider |
| /api/mpesa/stk-push | POST | Initiate payment | Any |
| /api/mpesa/query | POST | Check payment status | Any |
| /api/mpesa/simulate-success | POST | Demo payment success | Any |
| /api/reviews | POST | Submit review | Client |

---

## Conclusion

The booking flow is fully coordinated with:
- ✅ Proper status transitions
- ✅ Email notifications at key points
- ✅ Points awarding without duplication
- ✅ Provider-specific points validation
- ✅ Cache invalidation on all changes
- ✅ Review system with notifications
- ✅ Tier management
- ✅ Commission calculations

All components work together seamlessly from booking creation through payment, confirmation, completion, and review submission.
