'use strict';

const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Hash passwords
    const userPassword = await bcrypt.hash('user12345', 12);
    const adminPassword = await bcrypt.hash('admin12345', 12);

    await queryInterface.bulkInsert('users', [
      {
        id: uuidv4(),
        name: 'John Doe',
        email: 'john@example.com',
        password: userPassword,
        authProvider: 'local',
        role: 'user',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Admin Ravi',
        email: 'ravi.admin@example.com',
        password: adminPassword,
        authProvider: 'local',
        role: 'admin',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: userPassword,
        authProvider: 'local',
        role: 'user',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
