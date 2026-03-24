const jwt = require('jsonwebtoken');
const { User } = require('../models');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const messages = require('../constants/messages');


const protect = catchAsync(async (req, res, next) => {
  let token;

  // Check if token exists in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError(messages.ERROR.NO_TOKEN, 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists
    const user = await User.findByPk(decoded.userId);
    
    if (!user) {
      return next(new AppError(messages.ERROR.USER_NOT_FOUND, 401));
    }

    if (!user.isActive) {
      return next(new AppError(messages.ERROR.UNAUTHORIZED, 401));
    }

    // Grant access to protected route
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new AppError(messages.ERROR.TOKEN_EXPIRED, 401));
    }
    return next(new AppError(messages.ERROR.INVALID_TOKEN, 401));
  }
});

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(messages.ERROR.UNAUTHORIZED, 403)
      );
    }
    next();
  };
};

module.exports = {
  protect,
  restrictTo
};
