# M-Pesa Integration Setup Guide

## Current Setup (Development with webhook.site)

### Credentials (Already in .env)
- **Consumer Key**: `p9BFg0Bx5tfyTi2VTxyWDnxsMnr17zEXK5iOgOzLQIARKULg`
- **Consumer Secret**: `U2Ddfg7Jo1PUKHglE1mHaqRePBqeJ7ZCxB7iG1o3nYVZQYpCCUidAX049jLQAUgc`
- **Shortcode**: `174379`
- **Passkey**: `bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919`
- **Environment**: `sandbox`
- **Callback URL**: `https://webhook.site/39712331-a3e7-4a29-8f9f-a5ac6758430c`

### Test Phone Numbers
Use these in sandbox mode:
- `254708374149`
- `254711XXXYYY` (any valid Kenyan number format)

## How It Works

### 1. Payment Flow
```
Client clicks "Pay Now" 
  → STK push sent to phone (via Daraja API)
  → User enters PIN on phone
  → M-Pesa sends callback to webhook.site
  → Frontend polls status every 3 seconds
  → Payment confirmed/failed
```

### 2. Webhook.site Usage (Current)

**View Callbacks:**
1. Open: https://webhook.site/#!/39712331-a3e7-4a29-8f9f-a5ac6758430c
2. When payment happens, you'll see the callback JSON
3. Copy the JSON payload

**Process Callback Manually:**
```bash
# Edit scripts/process-mpesa-callback.js
# Paste the JSON from webhook.site
# Run:
node scripts/process-mpesa-callback.js
```

### 3. Testing Steps

**Test Payment:**
1. Login as client
2. Book a service
3. Enter phone: `254708374149`
4. STK push will be simulated in sandbox
5. Check webhook.site for callback
6. Run manual processor script if needed

**Expected Callback (Success):**
```json
{
  "Body": {
    "stkCallback": {
      "MerchantRequestID": "29115-34620561-1",
      "CheckoutRequestID": "ws_CO_191220191020363925",
      "ResultCode": 0,
      "ResultDesc": "The service request is processed successfully.",
      "CallbackMetadata": {
        "Item": [
          { "Name": "Amount", "Value": 1000 },
          { "Name": "MpesaReceiptNumber", "Value": "NLJ7RT61SV" },
          { "Name": "TransactionDate", "Value": 20191219102115 },
          { "Name": "PhoneNumber", "Value": 254708374149 }
        ]
      }
    }
  }
}
```

## Production Setup (Later with Vercel)

### Deploy to Vercel
```bash
# Install Vercel CLI
pnpm install -g vercel

# Deploy
vercel

# Get URL: https://glamease.vercel.app
```

### Update Callback URL
```env
MPESA_CALLBACK_URL="https://glamease.vercel.app/api/mpesa/callback"
```

### Switch to Production
```env
MPESA_ENVIRONMENT="production"
# Get production credentials from Safaricom Daraja Portal
MPESA_CONSUMER_KEY="your_production_key"
MPESA_CONSUMER_SECRET="your_production_secret"
MPESA_SHORTCODE="your_paybill_number"
MPESA_PASSKEY="your_production_passkey"
```

## API Endpoints

- **POST /api/mpesa/stk-push** - Initiate payment
- **POST /api/mpesa/callback** - Receive M-Pesa callbacks
- **POST /api/mpesa/query** - Check payment status

## Troubleshooting

**STK Push Not Received:**
- Check phone number format (254XXXXXXXXX)
- Verify credentials in .env
- Check Daraja API sandbox status

**Callback Not Working:**
- Verify webhook.site URL is correct
- Check webhook.site for incoming requests
- Use manual processor script

**Payment Status Not Updating:**
- Frontend polls for 60 seconds
- Check browser console for errors
- Verify payment record exists in database

## Notes

- Sandbox doesn't send actual STK push to phone
- Callbacks are simulated by Safaricom sandbox
- Use webhook.site to see callback payloads
- Switch to Vercel for automatic callback processing
