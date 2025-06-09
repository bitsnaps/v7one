'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        id: 1,
        displayName: 'admin',
        email: 'admin@example.com',
        passwordHash: 'YOUR_HASHED_PASSWORD_HERE', // IMPORTANT: Replace with a securely hashed password
        isAdmin: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // {
        // id: 2,
      //   displayName: 'testuser',
      //   email: 'testuser@example.com',
      //   passwordHash: 'YOUR_HASHED_PASSWORD_HERE', // IMPORTANT: Replace with a securely hashed password
      //   is_admin: false,
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
