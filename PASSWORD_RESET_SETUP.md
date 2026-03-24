# Forgot Password API - Quick Start Guide

## What Was Implemented

A complete forgot password and password reset system with email verification using Nodemailer. Users can request password reset links via email and securely reset their passwords.

## Key Files Added/Modified

### New Files:
1. **`config/email.js`** - Email configuration and template functions
2. **`migrations/20260302160000-add-password-reset-fields.js`** - Database migration for password reset fields
3. **`FORGOT_PASSWORD.md`** - Complete documentation
4. **`POSTMAN_PASSWORD_RESET.json`** - Postman collection for testing

### Modified Files:
1. **`package.json`** - Added `nodemailer` dependency
2. **`models/User.model.js`** - Added `passwordResetToken` and `passwordResetExpires` fields
3. **`controllers/auth.controller.js`** - Added `forgotPassword` and `resetPassword` methods
4. **`routes/auth.routes.js`** - Added 2 new routes with validation
5. **`constants/messages.js`** - Added password reset related messages
6. **`.env.example`** - Added email configuration variables

## Setup Steps

### 1. Install Nodemailer
```bash
cd server
npm install
```

### 2. Configure Environment Variables
Update your `.env` file with email credentials:

```env
# Email Configuration
EMAIL_SERVICE=gmail  # or your email service provider
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=noreply@yourdomain.com

# Frontend URL (for reset links)
CLIENT_URL=http://localhost:3000
```

**For Gmail Users:**
- Use an [App Password](https://myaccount.google.com/apppasswords) instead of your regular password
- Enable 2-Step Verification first if not already enabled

### 3. Run Database Migration
```bash
npm run db:migrate
```

This will add the password reset fields to the users table.

### 4. Start the Server
```bash
npm run dev
```

## API Endpoints

### 1. Forgot Password
Send a password reset link to user's email:
```
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### 2. Reset Password
Reset password using the token from email:
```
POST /api/auth/reset-password
Content-Type: application/json

{
  "resetToken": "token-from-email-link",
  "password": "newpassword123",
  "passwordConfirm": "newpassword123"
}
```

## Frontend Integration

### Step 1: Create Forgot Password Form
```jsx
async function handleForgotPassword(email) {
  try {
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await response.json();
    
    if (response.ok) {
      alert('Reset link sent to your email!');
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### Step 2: Create Reset Password Page
The reset link in the email has this format:
```
http://localhost:3000/reset-password/RESET_TOKEN
```

Extract the token from the URL and create a form:
```jsx
import { useParams } from 'react-router-dom';

function ResetPassword() {
  const { token } = useParams(); // Get token from URL
  const [formData, setFormData] = useState({
    password: '',
    passwordConfirm: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resetToken: token,
          password: formData.password,
          passwordConfirm: formData.passwordConfirm
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert('Password reset successful! You can now login.');
        // Redirect to login
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        placeholder="New Password"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
        required
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={formData.passwordConfirm}
        onChange={(e) => setFormData({...formData, passwordConfirm: e.target.value})}
        required
      />
      <button type="submit">Reset Password</button>
    </form>
  );
}
```

## Testing with Postman

1. Import `POSTMAN_PASSWORD_RESET.json` into Postman
2. Set base URL to `http://localhost:5000`
3. **Request Password Reset**:
   - Fill in your test email
   - Send POST request to `/api/auth/forgot-password`
   - Check email for reset link

4. **Reset Password**:
   - Copy token from the email link
   - Replace `PASTE_TOKEN_FROM_EMAIL_HERE` with actual token
   - Send POST request to `/api/auth/reset-password`
   - Verify success message

## Security Features

✅ Reset tokens are cryptographically hashed before storing in database
✅ Tokens expire after 15 minutes
✅ Tokens are one-time use (cleared after password reset)
✅ Passwords are hashed with bcrypt (10 salt rounds)
✅ Email verification prevents unauthorized password changes
✅ Success confirmation email sent after password reset

## Troubleshooting

### Email Not Sending?
- Verify `EMAIL_USER` and `EMAIL_PASSWORD` in `.env`
- For Gmail, use an App Password, not your regular password
- Check that email service is properly configured
- Check server logs for error messages

### Token Expired?
- Tokens are valid for 15 minutes
- Request a new password reset link

### Database Error?
- Run `npm run db:migrate`
- Ensure PostgreSQL is running
- Check database connection settings

## Database Schema

The users table now includes:
- `passwordResetToken` (STRING) - Hashed reset token
- `passwordResetExpires` (DATE) - Token expiration time

```sql
ALTER TABLE users ADD COLUMN passwordResetToken VARCHAR;
ALTER TABLE users ADD COLUMN passwordResetExpires TIMESTAMP;
```

## Next Steps

Consider implementing:
- Rate limiting for forgot password endpoint (prevent abuse)
- Password strength validation
- Customizable email templates
- Support for multiple email providers
- Audit logging for password changes
- Two-factor authentication

## Support

For more detailed information, see [FORGOT_PASSWORD.md](./FORGOT_PASSWORD.md)
