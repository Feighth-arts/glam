# New User Guide - Glamease

## ✅ YES - You Can Create New Accounts and Use Everything!

---

## Creating a New Account

### 1. Go to Signup Page
```
http://localhost:3000/signup
```

### 2. Fill in Details
- **Full Name**: Your name
- **Email**: Your email address
- **Password**: Minimum 6 characters
- **Phone**: Your phone number (optional)
- **I am a**: Select CLIENT or PROVIDER

### 3. Click "Sign Up"
- Account created automatically
- Logged in immediately
- Redirected to your dashboard

---

## As a NEW CLIENT

### What You Get:
✅ Account created
✅ UserPoints record created (0 points, BRONZE tier)
✅ Access to all client features

### What You Can Do:

**1. Browse Services**
- Go to `/client/services`
- See all providers offering Manicure & Pedicure
- View prices, ratings, duration

**2. Book a Service**
- Click "Book Now"
- Select date & time
- Enter location (optional)
- Add notes (optional)
- Redeem points (if you have any)
- Pay with M-Pesa simulation

**3. Manage Bookings**
- View all bookings in `/client/bookings`
- Pay for pending bookings
- Cancel bookings (PAID/CONFIRMED status)
- Submit reviews (COMPLETED bookings only)

**4. Earn Points**
- Manicure: 15 points
- Pedicure: 20 points
- Points awarded when booking COMPLETED

**5. Redeem Points**
- Use points at booking
- Max 30% discount
- Provider-specific (can only use points earned from that provider)

**6. Track Progress**
- View dashboard stats
- Check points balance
- See tier (Bronze/Gold/Platinum)
- View booking history

---

## As a NEW PROVIDER

### What You Get:
✅ Account created
✅ Access to all provider features
✅ Empty services list (need to add services)

### What You MUST Do First:

**1. Add Services**
- Go to `/provider/services`
- Click "Add Service"
- Select from available:
  - **Manicure** (Default: KES 1,500, 15 points, 45 min)
  - **Pedicure** (Default: KES 2,000, 20 points, 60 min)
- Set your custom price (optional)
- Set availability days & time slots
- Click "Save Service"

**Important:** You can only offer Manicure and/or Pedicure. These are the only services in the system.

### What You Can Do:

**2. Manage Bookings**
- View bookings in `/provider/bookings`
- Verify payment (PENDING_PAYMENT → PAID)
- Confirm booking (PAID → CONFIRMED)
- Complete booking (CONFIRMED → COMPLETED)
- Cancel bookings

**3. Track Earnings**
- View earnings in `/provider/earnings`
- See commission (15% platform fee)
- Track net earnings

**4. View Dashboard**
- Total bookings
- Total earnings
- Upcoming appointments
- Recent activity

**5. Manage Profile**
- Update personal info
- Set location
- Add experience details

---

## Complete Flow for New Users

### CLIENT FLOW:

```
1. Signup as CLIENT
   ↓
2. Redirected to /client/services
   ↓
3. Browse providers (may be empty if no providers have added services yet)
   ↓
4. Book a service
   ↓
5. Pay with M-Pesa (simulation)
   ↓
6. Wait for provider confirmation
   ↓
7. Service completed
   ↓
8. Points awarded
   ↓
9. Submit review
```

### PROVIDER FLOW:

```
1. Signup as PROVIDER
   ↓
2. Redirected to /provider/dashboard
   ↓
3. Go to /provider/services
   ↓
4. Click "Add Service"
   ↓
5. Select Manicure or Pedicure
   ↓
6. Set custom price (optional)
   ↓
7. Set availability
   ↓
8. Save service
   ↓
9. Now visible to clients!
   ↓
10. Receive bookings
   ↓
11. Confirm & complete bookings
   ↓
12. Earn money (85% after commission)
```

---

## Important Notes

### For Clients:
- ✅ Can book immediately after signup
- ✅ Start with 0 points (BRONZE tier)
- ✅ Earn points on completed bookings
- ✅ Points are provider-specific
- ✅ Can redeem up to 30% discount
- ✅ Can review completed bookings

### For Providers:
- ⚠️ **MUST add services first** before clients can book
- ✅ Can only offer Manicure & Pedicure
- ✅ Can set custom prices
- ✅ Can set availability schedule
- ✅ Receive 85% of booking amount (15% commission)
- ✅ Receive email when client pays
- ✅ Can manage all bookings

---

## Service Restrictions

### Why Only Manicure & Pedicure?

This is a **demo/MVP system** focused on nail services:
- Service IDs 1 (Manicure) and 2 (Pedicure) are hardcoded
- Cannot create new service types
- Cannot delete these services
- All providers can offer these same services
- Prices can be customized per provider

### Default Service Details:

**Manicure (ID: 1)**
- Base Price: KES 1,500
- Duration: 45 minutes
- Points: 15
- Category: Nails

**Pedicure (ID: 2)**
- Base Price: KES 2,000
- Duration: 60 minutes
- Points: 20
- Category: Nails

---

## Points System

### Earning Points:
- Points awarded when booking status = COMPLETED
- Manicure: 15 points
- Pedicure: 20 points
- Added to currentPoints and lifetimePoints

### Tier System:
- **Bronze**: 0-999 lifetime points
- **Gold**: 1,000-4,999 lifetime points
- **Platinum**: 5,000+ lifetime points

### Redeeming Points:
- 1 point = KES 1 discount
- Maximum 30% discount per booking
- Provider-specific (can only use points earned from that provider)
- Example: Earned 50 points from Provider A, can redeem max 50 points with Provider A

### Provider-Specific Validation:
```javascript
// Client has 100 total points
// 60 from Provider A, 40 from Provider B

// Booking with Provider A:
// Can redeem: max 60 points (or 30% of price, whichever is lower)

// Booking with Provider B:
// Can redeem: max 40 points (or 30% of price, whichever is lower)
```

---

## Payment System

### M-Pesa Simulation:
1. Enter phone number (10 digits, e.g., 0712345678)
2. System sends STK push (simulated)
3. Wait 21 seconds for polling
4. Automatically succeeds (demo mode)
5. Payment status → COMPLETED
6. Booking status → PAID
7. Provider receives email

### No Real Money:
- This is a **simulation only**
- No actual M-Pesa API calls
- No real money transactions
- Safe for testing

---

## Email Notifications

### Who Gets Emails:

**Provider receives email when:**
- Client completes payment

**Client receives email when:**
- Provider confirms booking
- (Not when payment completes)

**Provider receives email when:**
- Client submits review

### Email Content:
- Booking details (ID, service, date, time, amount)
- Client/Provider name
- Location
- Status updates

### Setup Required:
- EmailJS must be configured in `.env`
- If not configured, emails are skipped (system still works)

---

## Testing New Accounts

### Test as Client:
```bash
1. Signup: newclient@test.com / password123
2. Go to /client/services
3. If no providers visible: Wait for providers to add services
4. Book Manicure with any provider
5. Pay with M-Pesa (0712345678)
6. Check /client/bookings
7. Wait for provider to confirm
8. After completion, submit review
```

### Test as Provider:
```bash
1. Signup: newprovider@test.com / password123
2. Go to /provider/services
3. Click "Add Service"
4. Select Manicure
5. Set price: KES 1,500
6. Set availability: Mon-Fri, 9:00-17:00
7. Save service
8. Now visible to clients!
9. Wait for bookings
10. Confirm & complete bookings
```

---

## Common Issues

### "No services found" (Client)
**Cause:** No providers have added services yet
**Solution:** Wait for providers to add Manicure/Pedicure, or login as provider and add services

### "You have already added all available services" (Provider)
**Cause:** You've already added both Manicure and Pedicure
**Solution:** This is normal - you can only offer these 2 services

### "Only Manicure and Pedicure services are allowed"
**Cause:** Trying to add other services
**Solution:** System only supports Manicure & Pedicure

### "You can only redeem X points with this provider"
**Cause:** Trying to redeem more points than earned from that provider
**Solution:** Use only points earned from that specific provider

### Payment fails
**Cause:** M-Pesa sandbox API unreliable
**Solution:** System automatically falls back to simulation - just wait 21 seconds

---

## Database Records Created

### For New Client:
```sql
-- User record
INSERT INTO users (email, password, name, phone, role)

-- UserPoints record
INSERT INTO user_points (userId, currentPoints=0, lifetimePoints=0, tier='BRONZE')
```

### For New Provider:
```sql
-- User record only
INSERT INTO users (email, password, name, phone, role)

-- No automatic records
-- Provider must manually add services via UI
```

---

## Conclusion

✅ **YES - New users can:**
- Create accounts (client or provider)
- Login immediately
- Access all features
- Book services (clients)
- Offer services (providers)
- Complete full booking flow
- Earn/redeem points
- Submit reviews
- Track everything

⚠️ **Providers must:**
- Add services first (Manicure/Pedicure)
- Set availability
- Then clients can book

🎯 **System is fully functional for new users!**

---

## Quick Start Commands

```bash
# Start server
npm run dev

# Access app
http://localhost:3000

# Signup
http://localhost:3000/signup

# Login
http://localhost:3000/login
```

**Everything works end-to-end for new users!** 🚀
