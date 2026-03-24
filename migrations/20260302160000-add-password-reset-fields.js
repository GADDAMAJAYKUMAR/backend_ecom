const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if columns already exist
    const table = await queryInterface.describeTable('users');
    
    if (!table.passwordResetToken) {
      await queryInterface.addColumn('users', 'passwordResetToken', {
        type: DataTypes.STRING,
        allowNull: true
      });
    }

    if (!table.passwordResetExpires) {
      await queryInterface.addColumn('users', 'passwordResetExpires', {
        type: DataTypes.DATE,
        allowNull: true
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('users');
    
    if (table.passwordResetToken) {
      await queryInterface.removeColumn('users', 'passwordResetToken');
    }
    
    if (table.passwordResetExpires) {
      await queryInterface.removeColumn('users', 'passwordResetExpires');
    }
  }
};
