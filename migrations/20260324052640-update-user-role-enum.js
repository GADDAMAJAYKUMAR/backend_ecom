'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // First, update any 'customer' roles to 'user'
    await queryInterface.sequelize.query("UPDATE users SET role = 'user' WHERE role = 'customer'");

    // Then, change the enum to 'user', 'admin'
    await queryInterface.changeColumn('users', 'role', {
      type: Sequelize.ENUM('user', 'admin'),
      defaultValue: 'user',
      allowNull: false
    });
  },

  async down (queryInterface, Sequelize) {
    // Revert to 'customer', 'admin'
    await queryInterface.sequelize.query("UPDATE users SET role = 'customer' WHERE role = 'user'");

    await queryInterface.changeColumn('users', 'role', {
      type: Sequelize.ENUM('customer', 'admin'),
      defaultValue: 'customer',
      allowNull: false
    });
  }
};
  }
};
