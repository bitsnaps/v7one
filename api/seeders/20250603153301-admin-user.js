'use strict';
const crypto = require('crypto');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        id: crypto.randomUUID(),
        displayName: 'admin',
        email: 'admin@example.com',
        passwordHash: '8408dd9c2311bd608517bd62827439a8:16443aa8eb03758e2b9866e562f14cc101182b6463b4798a09a926f50da26abe1bba2e53a7691aab075c5fd8338f20c8e23292fb7d5c668880bd42e755ba3153',
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
