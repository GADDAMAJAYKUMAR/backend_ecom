const { DataTypes, Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/sequelize');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Name cannot be empty'
      },
      len: {
        args: [2, 100],
        msg: 'Name must be between 2 and 100 characters'
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: 'Email already exists'
    },
    validate: {
      isEmail: {
        msg: 'Please provide a valid email address'
      },
      notEmpty: {
        msg: 'Email cannot be empty'
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: {
        args: [8, 100],
        msg: 'Password must be at least 8 characters long'
      },
      isRequiredForLocalAuth(value) {
        if ((this.authProvider === 'local' || !this.authProvider) && !value) {
          throw new Error('Password is required for local authentication');
        }
      }
    }
  },
  googleId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  authProvider: {
    type: DataTypes.ENUM('local', 'google'),
    defaultValue: 'local',
    allowNull: false
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true
  },
  refreshToken: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user',
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  },
  passwordResetToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  passwordResetExpires: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Instance method to compare passwords
User.prototype.comparePassword = async function(candidatePassword) {
  if (!this.password) {
    return false;
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to hide password in JSON responses
User.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.password;
  delete values.refreshToken;
  return values;
};

module.exports = User;
