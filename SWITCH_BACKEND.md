# Backend Switch Karne Ka Guide

## Current Configuration
- **Primary**: Local backend `http://192.168.1.48:5000/api`
- **Fallback**: Render production `https://passo-backend.onrender.com/api`

## Agar Sirf Render Use Karna Hai

`PaasoWork/src/config/api.config.js` me ye change karo:

```javascript
const API_CONFIG = {
  BASE_URL: 'https://passo-backend.onrender.com/api', // Render production
  TIMEOUT: 30000,
  FALLBACK_URLS: [
    'https://passo-backend.onrender.com/api',
  ],
};
```

## Agar Sirf Local Use Karna Hai

```javascript
const API_CONFIG = {
  BASE_URL: 'http://192.168.1.48:5000/api', // Local backend
  TIMEOUT: 30000,
  FALLBACK_URLS: [
    'http://192.168.1.48:5000/api',
  ],
};
```

## Hybrid Mode (Current - Recommended)

```javascript
const API_CONFIG = {
  BASE_URL: 'http://192.168.1.48:5000/api', // Try local first
  TIMEOUT: 30000,
  FALLBACK_URLS: [
    'http://192.168.1.48:5000/api',
    'https://passo-backend.onrender.com/api', // Fallback to Render
  ],
};
```

## "Not Authorized" Error Fix

Ye error tab aata hai jab:

1. **Backend nahi chal raha**: Backend start karo
   ```bash
   cd Passo_backend
   npm start
   ```

2. **Database connection issue**: Check karo MongoDB Atlas connected hai
   - Backend logs me "MongoDB Connected" dikhna chahiye

3. **Route issue**: `/workers/check-mobile` PUBLIC route hai, auth nahi chahiye
   - Agar phir bhi error aaye to backend restart karo

4. **CORS issue**: Backend me CORS properly configured hai
   - `.env` me: `CORS_ORIGIN=http://localhost:5173,https://paaso.netlify.app,http://192.168.1.48:8081`

## Testing Backend Connection

### Test 1: Health Check
```bash
curl http://192.168.1.48:5000/health
```

Expected:
```json
{
  "success": true,
  "message": "Server is running"
}
```

### Test 2: Check Mobile (Public Route)
```bash
curl -X POST http://192.168.1.48:5000/api/workers/check-mobile \
  -H "Content-Type: application/json" \
  -d '{"mobile":"9876543210"}'
```

Expected:
```json
{
  "success": true,
  "exists": false,
  "worker": null
}
```

## Render Backend Wake Up

Render free tier me backend sleep mode me chala jata hai. First request me 30-50 seconds lag sakte hain.

**Solution**: 
- Pehle browser me `https://passo-backend.onrender.com/health` open karo
- Wait karo jab tak "Server is running" dikhe
- Phir app use karo

## Common Issues

### Issue: "Unable to connect to database"
**Fix**: Backend start karo aur MongoDB connection check karo

### Issue: "Not authorized to access this router"
**Fix**: 
1. Backend logs check karo
2. Route `/workers/check-mobile` PUBLIC hai, auth nahi chahiye
3. Backend restart karo

### Issue: "Network Error"
**Fix**:
1. Phone aur PC same WiFi par hain?
2. PC ka IP `192.168.1.48` sahi hai? (`ipconfig` se check karo)
3. Windows Firewall port 5000 allow kar raha hai?

### Issue: Timeout
**Fix**: Timeout already 30 seconds hai, agar phir bhi issue hai to:
- Backend logs check karo
- Database connection slow ho sakta hai
- Render backend cold start ho sakta hai (wait karo)
