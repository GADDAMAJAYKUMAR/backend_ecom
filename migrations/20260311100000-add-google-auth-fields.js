const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('users');

    if (!table.googleId) {
      await queryInterface.addColumn('users', 'googleId', {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
      });
    }

    if (!table.authProvider) {
      await queryInterface.addColumn('users', 'authProvider', {
        type: DataTypes.ENUM('local', 'google'),
        allowNull: false,
        defaultValue: 'local'
      });
    }

    if (!table.avatar) {
      await queryInterface.addColumn('users', 'avatar', {
        type: DataTypes.STRING,
        allowNull: true
      });
    }

    if (table.password && table.password.allowNull === false) {
      await queryInterface.changeColumn('users', 'password', {
        type: DataTypes.STRING,
        allowNull: true
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('users');

    if (table.avatar) {
      await queryInterface.removeColumn('users', 'avatar');
    }

    if (table.authProvider) {
      await queryInterface.removeColumn('users', 'authProvider');
    }

    if (table.googleId) {
      await queryInterface.removeColumn('users', 'googleId');
    }

    if (table.password) {
      await queryInterface.changeColumn('users', 'password', {
        type: DataTypes.STRING,
        allowNull: false
      });
    }

    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_users_authProvider";');
  }
};
