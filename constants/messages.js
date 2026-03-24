module.exports = {

  SUCCESS: {
    REGISTRATION: 'User registered successfully',
    LOGIN: 'Login successful',
    GOOGLE_LOGIN: 'Google login successful',
    LOGOUT: 'Logout successful',
    TOKEN_REFRESH: 'Token refreshed successfully',
    PROFILE_FETCHED: 'Profile fetched successfully',
    PROFILE_UPDATED: 'Profile updated successfully',
    PASSWORD_RESET_EMAIL_SENT: 'Password reset email sent successfully',
    PASSWORD_RESET_SUCCESSFUL: 'Password has been reset successfully'
  },

 
  ERROR: {
    // Authentication
    INVALID_CREDENTIALS: 'Invalid email or password',
    EMAIL_EXISTS: 'Email already exists',
    USER_NOT_FOUND: 'User not found',
    UNAUTHORIZED: 'You are not authorized to access this resource',
    TOKEN_EXPIRED: 'Token has expired, please login again',
    INVALID_TOKEN: 'Invalid token',
    NO_TOKEN: 'No token provided',
    INVALID_REFRESH_TOKEN: 'Invalid refresh token',
    INVALID_RESET_TOKEN: 'Invalid or expired password reset token',
    PASSWORD_RESET_TOKEN_EXPIRED: 'Password reset token has expired',

    
    VALIDATION_ERROR: 'Validation error',
    REQUIRED_FIELDS: 'Please provide all required fields',
    INVALID_EMAIL: 'Please provide a valid email address',
    PASSWORD_LENGTH: 'Password must be at least 8 characters long',
    PASSWORD_MISMATCH: 'Passwords do not match',
    ACCOUNT_USES_GOOGLE_AUTH: 'This account uses Google sign in. Please continue with Google.',
    GOOGLE_TOKEN_REQUIRED: 'Google token is required',
    INVALID_GOOGLE_TOKEN: 'Invalid Google token',
    INVALID_GOOGLE_ACCOUNT: 'Google account does not match this user',
    GOOGLE_EMAIL_NOT_VERIFIED: 'Google email is not verified',
    GOOGLE_AUTH_NOT_CONFIGURED: 'Google authentication is not configured on server',
    PAGE_NOT_FOUND:'Page Not Found',

    
    INTERNAL_SERVER: 'Internal server error',
    DATABASE_ERROR: 'Database error occurred',
    EMAIL_SEND_ERROR: 'Failed to send email. Please try again later',
    
   
    NOT_FOUND: 'Resource not found',
    BAD_REQUEST: 'Bad request'
  }
};
