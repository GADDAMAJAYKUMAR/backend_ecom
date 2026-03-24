# Forgot Password API Implementation

## Overview
This document describes the implementation of the forgot password and password reset functionality with email verification using Nodemailer.

## Features
- **Forgot Password Endpoint**: Users can request a password reset link
- **Email Verification**: Reset links are sent via email using Nodemailer
- **Reset Password Endpoint**: Users can reset their password using the token
- **Token Expiration**: Reset tokens expire after 15 minutes for security
- **Email Notifications**: Users receive success confirmation emails after password reset

## Setup Instructions

### 1. Environment Variables
Add the following variables to your `.env` file:

```env
# Email Configuration
EMAIL_SERVICE=gmail  # or your email service
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password  # For Gmail, use App Password
EMAIL_FROM=noreply@yourdomain.com

# Frontend URL (for reset link)
CLIENT_URL=http://localhost:3000
```

### 2. Gmail App Password Setup (if using Gmail)
1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification if not already enabled
3. Go to App Passwords section
4. Select "Mail" and "Windows Computer"
5. Copy the generated password and use it as `EMAIL_PASSWORD` in `.env`

### 3. Install Dependencies
```bash
npm install nodemailer
```

### 4. Run Migration
```bash
npm run db:migrate
```

This will add `passwordResetToken` and `passwordResetExpires` columns to the users table.

## API Endpoints

### 1. Forgot Password
**POST** `/api/auth/forgot-password`

Request body:
```json
{
  "email": "user@example.com"
}
```

Response (Success):
```json
{
  "status": "success",
  "message": "Password reset email sent successfully",
  "data": {
    "message": "Reset link sent to email"
  }
}
```

Response (Error):
```json
{
  "status": "error",
  "message": "User not found"
}
```

### 2. Reset Password
**POST** `/api/auth/reset-password`

Request body:
```json
{
  "resetToken": "token-received-in-email",
  "password": "newpassword123",
  "passwordConfirm": "newpassword123"
}
```

Response (Success):
```json
{
  "status": "success",
  "message": "Password has been reset successfully",
  "data": {
    "message": "Password has been reset successfully. You can now login with your new password."
  }
}
```

Response (Error - Token Expired):
```json
{
  "status": "error",
  "message": "Password reset token has expired"
}
```

Response (Error - Invalid Token):
```json
{
  "status": "error",
  "message": "Invalid or expired password reset token"
}
```

## User Flow

### Frontend Implementation Example

1. **Forgot Password Form**:
```javascript
async function handleForgotPassword(email) {
  const response = await fetch('/api/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  return response.json();
}
```

2. **Extract Token from URL**:
The reset link in the email has this format:
```
http://localhost:3000/reset-password/RESET_TOKEN_HERE
```

3. **Reset Password Form**:
```javascript
async function handleResetPassword(resetToken, password, passwordConfirm) {
  const response = await fetch('/api/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      resetToken,
      password,
      passwordConfirm
    })
  });
  return response.json();
}
```

## Database Schema Updates

### User Model Changes
The User model now includes:
- `passwordResetToken` (STRING): Hashed reset token
- `passwordResetExpires` (DATE): Token expiration timestamp

```javascript
User.update({
  passwordResetToken: hashedToken,
  passwordResetExpires: expiryDate
});
```

## Security Considerations

1. **Token Hashing**: Reset tokens are hashed before being stored in the database
2. **Token Expiration**: Tokens expire after 15 minutes
3. **One-Time Use**: After password reset, the token is cleared from the database
4. **Password Hashing**: New passwords are hashed using bcrypt before storage
5. **Email Verification**: Only the correct email account receives the reset link
6. **HTTPS Recommended**: Use HTTPS in production for secure token transmission

## File Structure
```
server/
├── config/
│   ├── email.js                    # Email configuration & templates
│   └── ...
├── controllers/
│   ├── auth.controller.js          # Updated with forgotPassword & resetPassword methods
│   └── ...
├── models/
│   ├── User.model.js               # Updated with password reset fields
│   └── ...
├── routes/
│   ├── auth.routes.js              # Updated routes
│   └── ...
├── migrations/
│   ├── 20260302160000-add-password-reset-fields.js  # New migration
│   └── ...
└── constants/
    ├── messages.js                 # Updated with password reset messages
    └── ...
```

## Testing the API

### Using Postman

1. **Forgot Password**:
   - Method: POST
   - URL: `http://localhost:3000/api/auth/forgot-password`
   - Body (JSON):
   ```json
   {
     "email": "user@example.com"
   }
   ```

2. **Reset Password**:
   - Method: POST
   - URL: `http://localhost:3000/api/auth/reset-password`
   - Body (JSON):
   ```json
   {
     "resetToken": "token-from-email",
     "password": "newpassword123",
     "passwordConfirm": "newpassword123"
   }
   ```

## Troubleshooting

### Email Not Sending
- Check that environment variables are set correctly
- Verify Gmail App Password if using Gmail
- Check email service credentials
- Review server logs for error messages

### Token Expired Error
- Ensure token hasn't been used already
- Check token expiration time (15 minutes)
- Request a new password reset link

### Database Migration Fails
- Ensure database is running
- Check database connection in `config/sequelize.js`
- Run `npm run db:migrate` to apply migrations

## Next Steps
1. Implement frontend reset password page
2. Add email templates customization
3. Consider implementing password strength requirements
4. Add rate limiting for forgot password endpoint
5. Add audit logging for password changes
