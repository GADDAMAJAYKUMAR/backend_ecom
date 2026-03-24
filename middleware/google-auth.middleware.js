const { OAuth2Client } = require('google-auth-library');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const messages = require('../constants/messages');

const verifyGoogleToken = catchAsync(async (req, res, next) => {
  const { idToken } = req.body;

  if (!idToken) {
    return next(new AppError(messages.ERROR.GOOGLE_TOKEN_REQUIRED, 400));
  }

  if (!process.env.GOOGLE_CLIENT_ID) {
    return next(new AppError(messages.ERROR.GOOGLE_AUTH_NOT_CONFIGURED, 500));
  }

  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  let ticket;
  try {
    ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });
  } catch (error) {
    return next(new AppError(messages.ERROR.INVALID_GOOGLE_TOKEN, 401));
  }

  const payload = ticket.getPayload();

  if (!payload || !payload.email || !payload.sub) {
    return next(new AppError(messages.ERROR.INVALID_GOOGLE_TOKEN, 401));
  }

  if (!payload.email_verified) {
    return next(new AppError(messages.ERROR.GOOGLE_EMAIL_NOT_VERIFIED, 401));
  }

  req.googleUser = {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name || payload.email.split('@')[0],
    picture: payload.picture || null
  };

  next();
});

module.exports = {
  verifyGoogleToken
};
