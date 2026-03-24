# Password Reset API - Testing Guide

## 🧪 Complete Testing Walkthrough

This guide provides step-by-step instructions for testing the forgot password and password reset functionality.

## Prerequisites

- Node.js running
- PostgreSQL database running
- Mail service configured (Gmail/SendGrid/etc)
- Postman installed (optional but recommended)

## Setup Before Testing

### 1. Configure Environment Variables

Create/update `.env` in the server folder:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce_db
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=noreply@yourdomain.com
CLIENT_URL=http://localhost:3000

# Server
NODE_ENV=development
PORT=5000
```

### 2. Install Dependencies

```bash
cd server
npm install
```

### 3. Run Database Migration

```bash
npm run db:migrate
```

### 4. Start the Server

```bash
npm run dev
```

You should see:
```
Email service is ready to send messages
Server is running on port 5000
```

## Testing Methods

### Method 1: Using Postman (Recommended)

#### Step 1: Import Collection
1. Open Postman
2. Click "Import"
3. Select `POSTMAN_PASSWORD_RESET.json` from the server folder
4. Click "Import"

#### Step 2: Test Forgot Password Endpoint

1. Open the "Request Password Reset" request
2. Update the email in the body:
```json
{
  "email": "user@example.com"
}
```
3. Click "Send"
4. You should receive a response:
```json
{
  "status": "success",
  "message": "Password reset email sent successfully",
  "data": {
    "message": "Reset link sent to email"
  }
}
```

#### Step 3: Check Your Email

1. Go to your email account (Gmail, etc)
2. Look for email from `noreply@yourdomain.com`
3. Subject should be: "Password Reset Request"
4. Copy the reset token from the link in the email
5. The link format is: `http://localhost:3000/reset-password/TOKEN`

#### Step 4: Test Reset Password Endpoint

1. Open the "Reset Password with Token" request in Postman
2. Replace `PASTE_TOKEN_FROM_EMAIL_HERE` with the actual token
3. Update the password fields:
```json
{
  "resetToken": "ACTUAL_TOKEN_HERE",
  "password": "newpassword123",
  "passwordConfirm": "newpassword123"
}
```
4. Click "Send"
5. You should receive a response:
```json
{
  "status": "success",
  "message": "Password has been reset successfully",
  "data": {
    "message": "Password has been reset successfully. You can now login with your new password."
  }
}
```

#### Step 5: Verify Password Changed

1. Go back to login endpoint
2. Try logging in with the new password
3. You should get a successful login response

### Method 2: Using cURL

#### Test Forgot Password

```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com"}'
```

Expected response:
```json
{
  "status": "success",
  "message": "Password reset email sent successfully",
  "data": {
    "message": "Reset link sent to email"
  }
}
```

#### Test Reset Password

```bash
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "resetToken": "token-from-email",
    "password": "newpassword123",
    "passwordConfirm": "newpassword123"
  }'
```

Expected response:
```json
{
  "status": "success",
  "message": "Password has been reset successfully",
  "data": {
    "message": "Password has been reset successfully. You can now login with your new password."
  }
}
```

### Method 3: Using Frontend

#### Step 1: Create Forgot Password Form

Create a simple HTML form to test:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Test Password Reset</title>
</head>
<body>
    <h1>Forgot Password Test</h1>
    
    <h2>Step 1: Request Reset</h2>
    <form id="forgotForm">
        <input type="email" id="email" placeholder="Email" required>
        <button type="submit">Send Reset Link</button>
    </form>
    <div id="forgotResponse"></div>

    <h2>Step 2: Reset Password</h2>
    <form id="resetForm">
        <input type="text" id="token" placeholder="Token from email" required>
        <input type="password" id="password" placeholder="New Password" required>
        <input type="password" id="passwordConfirm" placeholder="Confirm Password" required>
        <button type="submit">Reset Password</button>
    </form>
    <div id="resetResponse"></div>

    <script>
        document.getElementById('forgotForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            
            try {
                const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });
                
                const data = await response.json();
                document.getElementById('forgotResponse').innerHTML = 
                    `<pre>${JSON.stringify(data, null, 2)}</pre>`;
                
                if (response.ok) {
                    alert('Reset link sent to email! Check your inbox.');
                }
            } catch (error) {
                document.getElementById('forgotResponse').innerHTML = 
                    `<p style="color: red;">Error: ${error.message}</p>`;
            }
        });

        document.getElementById('resetForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const token = document.getElementById('token').value;
            const password = document.getElementById('password').value;
            const passwordConfirm = document.getElementById('passwordConfirm').value;
            
            try {
                const response = await fetch('http://localhost:5000/api/auth/reset-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        resetToken: token, 
                        password, 
                        passwordConfirm 
                    })
                });
                
                const data = await response.json();
                document.getElementById('resetResponse').innerHTML = 
                    `<pre>${JSON.stringify(data, null, 2)}</pre>`;
                
                if (response.ok) {
                    alert('Password reset successful! You can now login.');
                }
            } catch (error) {
                document.getElementById('resetResponse').innerHTML = 
                    `<p style="color: red;">Error: ${error.message}</p>`;
            }
        });
    </script>
</body>
</html>
```

Save as `test.html` and open in browser.

## Error Scenarios to Test

### 1. User Not Found
**Request:**
```json
{
  "email": "nonexistent@example.com"
}
```

**Expected Response (404):**
```json
{
  "status": "error",
  "message": "User not found"
}
```

### 2. Invalid Email Format
**Request:**
```json
{
  "email": "invalid-email"
}
```

**Expected Response (422):**
```json
{
  "status": "error",
  "message": "Please provide a valid email"
}
```

### 3. Expired Token
**Request (after 15 minutes):**
```json
{
  "resetToken": "old-token",
  "password": "newpassword123",
  "passwordConfirm": "newpassword123"
}
```

**Expected Response (400):**
```json
{
  "status": "error",
  "message": "Password reset token has expired"
}
```

### 4. Invalid Token
**Request:**
```json
{
  "resetToken": "invalid-or-wrong-token",
  "password": "newpassword123",
  "passwordConfirm": "newpassword123"
}
```

**Expected Response (400):**
```json
{
  "status": "error",
  "message": "Invalid or expired password reset token"
}
```

### 5. Password Mismatch
**Request:**
```json
{
  "resetToken": "valid-token",
  "password": "newpassword123",
  "passwordConfirm": "differentpassword"
}
```

**Expected Response (400):**
```json
{
  "status": "error",
  "message": "Passwords do not match"
}
```

### 6. Password Too Short
**Request:**
```json
{
  "resetToken": "valid-token",
  "password": "short",
  "passwordConfirm": "short"
}
```

**Expected Response (422):**
```json
{
  "status": "error",
  "message": "Password must be at least 8 characters long"
}
```

### 7. Missing Required Fields
**Request:**
```json
{
  "email": ""
}
```

**Expected Response (422):**
```json
{
  "status": "error",
  "message": "Email is required"
}
```

## Database Verification

### Check Password Reset Fields Created

```sql
-- Connect to your PostgreSQL database
psql -U postgres -d ecommerce_db

-- Check users table structure
\d users;

-- You should see:
-- passwordResetToken | character varying | (nullable)
-- passwordResetExpires | timestamp | (nullable)
```

### Verify Token Stored in Database

```sql
-- After requesting password reset
SELECT id, email, passwordResetToken, passwordResetExpires 
FROM users 
WHERE email = 'user@example.com';

-- Should show:
-- - Non-null passwordResetToken (hashed)
-- - Non-null passwordResetExpires (date in future)
```

### Verify Token Cleared After Reset

```sql
-- After resetting password
SELECT id, email, passwordResetToken, passwordResetExpires 
FROM users 
WHERE email = 'user@example.com';

-- Should show:
-- - NULL passwordResetToken
-- - NULL passwordResetExpires
```

## Email Testing Services

### Option 1: Gmail (Free)

1. Enable 2-Step Verification: https://myaccount.google.com/security
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use App Password in `EMAIL_PASSWORD`

```env
EMAIL_SERVICE=gmail
EMAIL_USER=your@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
```

### Option 2: Mailosaur (Testing)

For testing without real email:

1. Sign up at https://mailosaur.com
2. Get your test email domain
3. Use SMTP credentials in `.env`

```env
EMAIL_SERVICE=smtp
EMAIL_HOST=smtp.mailosaur.net
EMAIL_USER=your-username
EMAIL_PASSWORD=your-password
```

### Option 3: Mailtrap (Free Testing)

1. Sign up at https://mailtrap.io
2. Get SMTP credentials
3. Use in `.env`

```env
EMAIL_SERVICE=smtp
EMAIL_HOST=smtp.mailtrap.io
EMAIL_USER=your-username
EMAIL_PASSWORD=your-password
```

## Load Testing

### Test Token Generation Speed

```bash
# Run this multiple times to ensure tokens are generated quickly
time curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

Should complete in < 500ms

### Test Multiple Resets

```bash
# Request multiple resets in sequence
for i in {1..10}; do
  curl -X POST http://localhost:5000/api/auth/forgot-password \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"user${i}@example.com\"}"
  echo "Request $i sent"
done
```

## Security Testing

### 1. Test Token Expiration
- Request password reset
- Wait 15 minutes
- Try to use the token
- Should get "Token expired" error

### 2. Test One-Time Token Usage
- Request password reset
- Use token to reset password
- Try to use same token again
- Should get "Invalid token" error

### 3. Test Email Verification
- Request reset for email that doesn't exist
- Should not reveal if account exists
- Should get generic "User not found" error

### 4. Test Token Hash
- Check database for stored token
- Token should be hashed (not plain text)
- Verify with: `SELECT passwordResetToken FROM users;`

## Performance Testing

### Measure Response Times

```bash
# Forgot password endpoint
curl -w "\nTime: %{time_total}s\n" -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'

# Reset password endpoint
curl -w "\nTime: %{time_total}s\n" -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"resetToken":"token","password":"pass","passwordConfirm":"pass"}'
```

Expected: < 1 second (depending on email service)

## Logging & Monitoring

### Check Server Logs

The server logs should show:
```
Email service is ready to send messages
POST /api/auth/forgot-password - 200 OK
Sending password reset email to: user@example.com
POST /api/auth/reset-password - 200 OK
Password reset for user: user@example.com
```

## Testing Checklist

- [ ] Forgot password endpoint accessible
- [ ] Email successfully sent
- [ ] Reset email received
- [ ] Reset token valid for 15 minutes
- [ ] Reset password endpoint accepts valid token
- [ ] Password successfully updated in database
- [ ] Token cleared after successful reset
- [ ] Cannot reuse same token
- [ ] Cannot reset with expired token
- [ ] Cannot reset with invalid token
- [ ] Password confirmation validation works
- [ ] Error messages are appropriate
- [ ] Email sent confirmation on success
- [ ] Nonexistent user returns proper error
- [ ] Invalid email format rejected
- [ ] Empty fields rejected
- [ ] Password strength requirements enforced
- [ ] Login works with new password
- [ ] Old password no longer works

## Completion

Once all tests pass, the forgot password API is ready for:
- ✅ Development use
- ✅ Staging deployment
- ✅ Production deployment

---

**Last Updated:** March 2, 2026
**Status:** Ready for Testing ✅
