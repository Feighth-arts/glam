// M-Pesa Daraja API Integration

const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
const MPESA_PASSKEY = process.env.MPESA_PASSKEY;
const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE;
const MPESA_ENVIRONMENT = process.env.MPESA_ENVIRONMENT || 'sandbox'; // sandbox or production
const CALLBACK_URL = process.env.MPESA_CALLBACK_URL || 'https://yourdomain.com/api/mpesa/callback';

const BASE_URL = MPESA_ENVIRONMENT === 'production'
  ? 'https://api.safaricom.co.ke'
  : 'https://sandbox.safaricom.co.ke';

// Get OAuth token
async function getAccessToken() {
  const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');
  
  const response = await fetch(`${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: {
      'Authorization': `Basic ${auth}`
    }
  });
  
  const data = await response.json();
  return data.access_token;
}

// Generate password for STK push
function generatePassword() {
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
  const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString('base64');
  return { password, timestamp };
}

// Initiate STK Push
export async function initiateSTKPush(phoneNumber, amount, accountReference, transactionDesc) {
  try {
    const accessToken = await getAccessToken();
    const { password, timestamp } = generatePassword();
    
    // Format phone number (remove leading 0, add 254)
    let formattedPhone = phoneNumber.replace(/\s/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.slice(1);
    } else if (!formattedPhone.startsWith('254')) {
      formattedPhone = '254' + formattedPhone;
    }
    
    const response = await fetch(`${BASE_URL}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        BusinessShortCode: MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.ceil(amount),
        PartyA: formattedPhone,
        PartyB: MPESA_SHORTCODE,
        PhoneNumber: formattedPhone,
        CallBackURL: CALLBACK_URL,
        AccountReference: accountReference,
        TransactionDesc: transactionDesc
      })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('STK Push error:', error);
    throw error;
  }
}

// Query STK Push status
export async function querySTKStatus(checkoutRequestID) {
  try {
    const accessToken = await getAccessToken();
    const { password, timestamp } = generatePassword();
    
    const response = await fetch(`${BASE_URL}/mpesa/stkpushquery/v1/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        BusinessShortCode: MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestID
      })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Query STK status error:', error);
    throw error;
  }
}
