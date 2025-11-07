# Anytime Pooja - Integration Guide

## 🔗 Third-Party Service Integrations

---

## 📞 AGORA SDK Integration (Voice/Video Calls)

### Setup Steps
1. **Create Agora Account**: Sign up at [Agora.io](https://www.agora.io)
2. **Get Credentials**: App ID, App Certificate, Customer ID, Customer Secret
3. **Install SDK**: Already included in dependencies

### Implementation

#### Backend Token Generation
```javascript
// utils/agoraToken.js
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

const generateAgoraToken = (channelName, uid, role = RtcRole.PUBLISHER) => {
  const appId = process.env.AGORA_APP_ID;
  const appCertificate = process.env.AGORA_APP_CERTIFICATE;
  const expirationTimeInSeconds = 3600; // 1 hour
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  return RtcTokenBuilder.buildTokenWithUid(
    appId,
    appCertificate,
    channelName,
    uid,
    role,
    privilegeExpiredTs
  );
};

module.exports = { generateAgoraToken };
```

#### Frontend Integration
```javascript
// hooks/useAgoraCall.js
import AgoraRTC from 'agora-rtc-sdk-ng';

export const useAgoraCall = () => {
  const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
  
  const joinCall = async (channelName, token, uid) => {
    await client.join(process.env.NEXT_PUBLIC_AGORA_APP_ID, channelName, token, uid);
    
    // For voice call
    const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    await client.publish([audioTrack]);
    
    // For video call
    const videoTrack = await AgoraRTC.createCameraVideoTrack();
    await client.publish([audioTrack, videoTrack]);
  };
  
  const leaveCall = async () => {
    await client.leave();
  };
  
  return { joinCall, leaveCall, client };
};
```

---

## 🗺️ OpenStreetMap Integration (Location Services)

### Nearby Astrologers Query
```javascript
// services/locationService.js
const findNearbyAstrologers = async (userLat, userLng, radiusKm = 10) => {
  const query = `
    SELECT 
      a.*,
      ST_Distance(
        ST_GeogFromText('POINT(${userLng} ${userLat})'),
        a.location
      ) / 1000 as distance_km
    FROM astrologers a
    WHERE 
      a.status = 'active' 
      AND a.is_online = true
      AND ST_DWithin(
        ST_GeogFromText('POINT(${userLng} ${userLat})'),
        a.location,
        ${radiusKm * 1000}
      )
    ORDER BY distance_km ASC
    LIMIT 20;
  `;
  
  return await supabase.rpc('find_nearby_astrologers', {
    user_lat: userLat,
    user_lng: userLng,
    radius_km: radiusKm
  });
};
```

### Geocoding with Nominatim
```javascript
// utils/geocoding.js
const geocodeAddress = async (address) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
  );
  
  const data = await response.json();
  if (data.length > 0) {
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
      displayName: data[0].display_name
    };
  }
  
  throw new Error('Address not found');
};
```

---

## 🌟 Horoscope API Integration

### AstrologyAPI.com Integration
```javascript
// services/horoscopeService.js
const axios = require('axios');

class HoroscopeService {
  constructor() {
    this.baseURL = process.env.ASTROLOGY_API_BASE_URL;
    this.userId = process.env.ASTROLOGY_API_USER_ID;
    this.apiKey = process.env.ASTROLOGY_API_KEY;
  }

  async getDailyHoroscope(sign) {
    try {
      // Check cache first
      const cached = await this.getCachedHoroscope(sign, 'daily');
      if (cached) return cached;

      const response = await axios.post(
        `${this.baseURL}/sun_sign_prediction/daily/${sign}`,
        {},
        {
          auth: {
            username: this.userId,
            password: this.apiKey
          }
        }
      );

      const horoscope = response.data;
      
      // Cache the result
      await this.cacheHoroscope(sign, 'daily', horoscope);
      
      return horoscope;
    } catch (error) {
      console.error('Horoscope API Error:', error);
      return this.getFallbackHoroscope(sign);
    }
  }

  async getCachedHoroscope(sign, period) {
    const today = new Date().toISOString().split('T')[0];
    
    const { data } = await supabase
      .from('horoscope_cache')
      .select('content')
      .eq('zodiac_sign', sign)
      .eq('period', period)
      .eq('date', today)
      .gt('expires_at', new Date().toISOString())
      .single();

    return data?.content ? JSON.parse(data.content) : null;
  }

  async cacheHoroscope(sign, period, content) {
    const today = new Date().toISOString().split('T')[0];
    const expiresAt = new Date();
    expiresAt.setHours(23, 59, 59, 999); // Expire at end of day

    await supabase
      .from('horoscope_cache')
      .upsert({
        zodiac_sign: sign,
        period: period,
        date: today,
        content: JSON.stringify(content),
        expires_at: expiresAt.toISOString()
      });
  }

  getFallbackHoroscope(sign) {
    const fallbacks = {
      aries: "Today brings new opportunities. Stay focused on your goals.",
      taurus: "Financial matters require attention. Trust your instincts.",
      // ... more fallbacks
    };
    
    return {
      prediction: fallbacks[sign.toLowerCase()] || "The stars are aligned in your favor today.",
      sign: sign,
      date: new Date().toISOString().split('T')[0]
    };
  }
}

module.exports = new HoroscopeService();
```

---

## 💳 Payment Gateway Integration (Razorpay)

### Backend Order Creation
```javascript
// services/paymentService.js
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (amount, currency = 'INR', receipt) => {
  const options = {
    amount: amount * 100, // Amount in paise
    currency,
    receipt,
    payment_capture: 1,
  };

  try {
    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    throw new Error('Payment order creation failed');
  }
};

const verifyPayment = (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
  const crypto = require('crypto');
  const body = razorpayOrderId + '|' + razorpayPaymentId;
  
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  return expectedSignature === razorpaySignature;
};
```

### Frontend Payment Integration
```javascript
// components/PaymentModal.jsx
import { useRazorpay } from 'react-razorpay';

const PaymentModal = ({ amount, onSuccess, onError }) => {
  const { Razorpay } = useRazorpay();

  const handlePayment = async () => {
    // Create order on backend
    const order = await fetch('/api/user/wallet/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount })
    }).then(res => res.json());

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Anytime Pooja',
      description: 'Wallet Recharge',
      order_id: order.id,
      handler: async (response) => {
        // Verify payment on backend
        const verification = await fetch('/api/user/wallet/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(response)
        }).then(res => res.json());

        if (verification.success) {
          onSuccess(verification.data);
        } else {
          onError('Payment verification failed');
        }
      },
      prefill: {
        name: user.fullName,
        email: user.email,
        contact: user.phone
      },
      theme: {
        color: '#FF6B1A'
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();
  };

  return (
    <button onClick={handlePayment}>
      Pay ₹{amount}
    </button>
  );
};
```

---

## 📱 SMS Integration (Twilio)

### OTP Service
```javascript
// services/smsService.js
const twilio = require('twilio');

class SMSService {
  constructor() {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }

  async sendOTP(phoneNumber, otp) {
    try {
      const message = await this.client.messages.create({
        body: `Your Anytime Pooja verification code is: ${otp}. Valid for 5 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber
      });

      return { success: true, messageId: message.sid };
    } catch (error) {
      console.error('SMS Error:', error);
      return { success: false, error: error.message };
    }
  }

  async sendConsultationReminder(phoneNumber, astrologerName, scheduledTime) {
    const message = `Reminder: Your consultation with ${astrologerName} is scheduled at ${scheduledTime}. Join via Anytime Pooja app.`;
    
    try {
      await this.client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber
      });
    } catch (error) {
      console.error('Reminder SMS Error:', error);
    }
  }
}

module.exports = new SMSService();
```

---

## 🔔 Push Notifications (Firebase)

### Setup
```javascript
// services/notificationService.js
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FCM_PROJECT_ID,
    privateKey: process.env.FCM_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.FCM_CLIENT_EMAIL,
  }),
});

class NotificationService {
  async sendPushNotification(fcmToken, title, body, data = {}) {
    const message = {
      notification: { title, body },
      data,
      token: fcmToken,
      android: {
        notification: {
          icon: 'ic_notification',
          color: '#FF6B1A',
          sound: 'default',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          },
        },
      },
    };

    try {
      const response = await admin.messaging().send(message);
      return { success: true, messageId: response };
    } catch (error) {
      console.error('Push notification error:', error);
      return { success: false, error: error.message };
    }
  }

  async sendToTopic(topic, title, body, data = {}) {
    const message = {
      notification: { title, body },
      data,
      topic,
    };

    try {
      const response = await admin.messaging().send(message);
      return { success: true, messageId: response };
    } catch (error) {
      console.error('Topic notification error:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new NotificationService();
```

---

## 📧 Email Service (SendGrid)

### Email Templates
```javascript
// services/emailService.js
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class EmailService {
  async sendWelcomeEmail(userEmail, userName) {
    const msg = {
      to: userEmail,
      from: process.env.SENDGRID_FROM_EMAIL,
      templateId: 'd-welcome-template-id',
      dynamicTemplateData: {
        name: userName,
        loginUrl: `${process.env.NEXT_PUBLIC_APP_URL}/login`
      },
    };

    try {
      await sgMail.send(msg);
      return { success: true };
    } catch (error) {
      console.error('Email error:', error);
      return { success: false, error: error.message };
    }
  }

  async sendConsultationConfirmation(userEmail, consultationDetails) {
    const msg = {
      to: userEmail,
      from: process.env.SENDGRID_FROM_EMAIL,
      templateId: 'd-consultation-confirmation-id',
      dynamicTemplateData: {
        astrologerName: consultationDetails.astrologerName,
        scheduledTime: consultationDetails.scheduledTime,
        type: consultationDetails.type,
        amount: consultationDetails.amount
      },
    };

    await sgMail.send(msg);
  }
}

module.exports = new EmailService();
```

---

## 🔄 Real-time Updates (Supabase Realtime)

### Backend Subscription Setup
```javascript
// services/realtimeService.js
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

class RealtimeService {
  subscribeToConsultationUpdates(consultationId, callback) {
    return supabase
      .channel(`consultation:${consultationId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'consultations',
        filter: `id=eq.${consultationId}`
      }, callback)
      .subscribe();
  }

  subscribeToMessages(consultationId, callback) {
    return supabase
      .channel(`messages:${consultationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `consultation_id=eq.${consultationId}`
      }, callback)
      .subscribe();
  }

  async broadcastTyping(consultationId, userId, isTyping) {
    await supabase
      .channel(`consultation:${consultationId}`)
      .send({
        type: 'broadcast',
        event: 'typing',
        payload: { userId, isTyping }
      });
  }
}

module.exports = new RealtimeService();
```

---

## 🛡️ Security Best Practices

### Rate Limiting
```javascript
// middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Different limits for different endpoints
const authLimiter = createRateLimiter(15 * 60 * 1000, 5, 'Too many auth attempts');
const apiLimiter = createRateLimiter(15 * 60 * 1000, 100, 'Too many requests');
const paymentLimiter = createRateLimiter(60 * 1000, 3, 'Too many payment attempts');

module.exports = { authLimiter, apiLimiter, paymentLimiter };
```

### Input Validation
```javascript
// middleware/validation.js
const { body, validationResult } = require('express-validator');

const validateRegistration = [
  body('email').isEmail().normalizeEmail(),
  body('phone').isMobilePhone('en-IN'),
  body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
  body('fullName').isLength({ min: 2, max: 100 }).trim(),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

module.exports = { validateRegistration };
```

This integration guide provides comprehensive setup instructions for all major third-party services. Each service includes error handling, caching strategies, and security considerations.