const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User } = require('../models');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { generateTokens, generateAccessToken } = require('../utils/generateToken');
const { sendPasswordResetEmail, sendPasswordResetSuccessEmail } = require('../config/email');
const messages = require('../constants/messages');


const register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

 
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return next(new AppError(messages.ERROR.EMAIL_EXISTS, 400));
  }

  
  const user = await User.create({
    name,
    email,
    password
  });


  const { accessToken, refreshToken } = generateTokens(user.id);

  await user.update({ refreshToken });

  res.status(201).json({
    status: 'success',
    message: messages.SUCCESS.REGISTRATION,
    data: {
      user,
      accessToken,
      refreshToken
    }
  });
});

/**
 * Google authentication
 * POST /api/auth/google
 */
const googleAuth = catchAsync(async (req, res, next) => {
  const { email, name, picture, googleId } = req.googleUser;

  let user = await User.findOne({ where: { email } });

  if (user) {
    if (!user.isActive) {
      return next(new AppError(messages.ERROR.UNAUTHORIZED, 401));
    }

    if (user.googleId && user.googleId !== googleId) {
      return next(new AppError(messages.ERROR.INVALID_GOOGLE_ACCOUNT, 401));
    }

    await user.update({
      googleId: user.googleId || googleId,
      authProvider: 'google',
      avatar: picture || user.avatar,
      name: name || user.name,
      lastLogin: new Date()
    });
  } else {
    user = await User.create({
      name,
      email,
      password: null,
      googleId,
      authProvider: 'google',
      avatar: picture,
      lastLogin: new Date()
    });
  }

  const { accessToken, refreshToken } = generateTokens(user.id);

  await user.update({ refreshToken });

  res.status(200).json({
    status: 'success',
    message: messages.SUCCESS.GOOGLE_LOGIN,
    data: {
      user,
      accessToken,
      refreshToken
    }
  });
});

/**
 * Login user
 * POST /api/auth/login
 */
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  
  if (!email || !password) {
    return next(new AppError(messages.ERROR.REQUIRED_FIELDS, 400));
  }

  
  const user = await User.findOne({ 
    where: { email },
    attributes: { include: ['password'] }
  });


  if (user && !user.password && user.authProvider === 'google') {
    return next(new AppError(messages.ERROR.ACCOUNT_USES_GOOGLE_AUTH, 400));
  }


  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError(messages.ERROR.INVALID_CREDENTIALS, 401));
  }

  
  if (!user.isActive) {
    return next(new AppError(messages.ERROR.UNAUTHORIZED, 401));
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user.id);

  
  await user.update({ 
    refreshToken,
    lastLogin: new Date()
  });

  
  user.password = undefined;

  res.status(200).json({
    status: 'success',
    message: messages.SUCCESS.LOGIN,
    data: {
      user,
      accessToken,
      refreshToken
    }
  });
});

/**
 * Refresh access token using refresh token
 * POST /api/auth/refresh-token
 */
const refreshToken = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next(new AppError(messages.ERROR.NO_TOKEN, 401));
  }

  try {
    
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Find user and check if refresh token matches
    const user = await User.findOne({
      where: { id: decoded.userId },
      attributes: { include: ['refreshToken'] }
    });

    if (!user || user.refreshToken !== refreshToken) {
      return next(new AppError(messages.ERROR.INVALID_REFRESH_TOKEN, 401));
    }

    if (!user.isActive) {
      return next(new AppError(messages.ERROR.UNAUTHORIZED, 401));
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user.id);

    res.status(200).json({
      status: 'success',
      message: messages.SUCCESS.TOKEN_REFRESH,
      data: {
        accessToken: newAccessToken
      }
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new AppError(messages.ERROR.TOKEN_EXPIRED, 401));
    }
    return next(new AppError(messages.ERROR.INVALID_REFRESH_TOKEN, 401));
  }
});

/**
 * Logout user
 * POST /api/auth/logout
 */
const logout = catchAsync(async (req, res, next) => {
  const user = req.user;

  // Clear refresh token from database
  await user.update({ refreshToken: null });

  res.status(200).json({
    status: 'success',
    message: messages.SUCCESS.LOGOUT
  });
});

/**
 * Get current user profile
 * GET /api/auth/me
 */
const getMe = catchAsync(async (req, res, next) => {
  const user = req.user;

  res.status(200).json({
    status: 'success',
    message: messages.SUCCESS.PROFILE_FETCHED,
    data: {
      user
    }
  });
});

/**
 * Forgot password - Send reset token to email
 * POST /api/auth/forgot-password
 */
const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return next(new AppError(messages.ERROR.USER_NOT_FOUND, 404));
  }

  
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  
  await user.update({
    passwordResetToken: hashedToken,
    passwordResetExpires: new Date(Date.now() + 15 * 60 * 1000)
  });

 
  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

  try {
    
    await sendPasswordResetEmail(email, resetUrl);

    res.status(200).json({
      status: 'success',
      message: messages.SUCCESS.PASSWORD_RESET_EMAIL_SENT,
      data: {
        message: 'Reset link sent to email',
        resetToken
      }
    });
  } catch (error) {
    
    await user.update({
      passwordResetToken: null,
      passwordResetExpires: null
    });
    return next(new AppError(messages.ERROR.EMAIL_SEND_ERROR, 500));
  }
});

/**
 * Reset password - Update password with token
 * POST /api/auth/reset-password
 */
const resetPassword = catchAsync(async (req, res, next) => {
  const { resetToken, password, passwordConfirm } = req.body;

 
  if (password !== passwordConfirm) {
    return next(new AppError(messages.ERROR.PASSWORD_MISMATCH, 400));
  }

 
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  
  const user = await User.findOne({
    where: {
      passwordResetToken: hashedToken
    }
  });

  if (!user) {
    return next(new AppError(messages.ERROR.INVALID_RESET_TOKEN, 400));
  }

  
  if (user.passwordResetExpires < new Date()) {
    return next(new AppError(messages.ERROR.PASSWORD_RESET_TOKEN_EXPIRED, 400));
  }

  
  await user.update({
    password,
    passwordResetToken: null,
    passwordResetExpires: null
  });

  try {
    await sendPasswordResetSuccessEmail(user.email);
  } catch (error) {
    console.log('Error sending success email:', error);
  }

  res.status(200).json({
    status: 'success',
    message: messages.SUCCESS.PASSWORD_RESET_SUCCESSFUL,
    data: {
      message: 'Password has been reset successfully. You can now login with your new password.'
    }
  });
});

module.exports = {
  register,
  googleAuth,
  login,
  refreshToken,
  logout,
  getMe,
  forgotPassword,
  resetPassword
};
