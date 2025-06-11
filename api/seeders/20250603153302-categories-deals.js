'use strict';
const crypto = require('crypto');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories', [
      {
        id: crypto.randomUUID(),
        name: 'Real Estate',
        slug: 'real-estate',
        iconUrl: 'icon-house.svg',
        description: 'Properties for sale and rent.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: crypto.randomUUID(),
        name: 'Vehicles',
        slug: 'vehicles',
        iconUrl: 'icon-car-sedan.svg',
        description: 'Cars, motorcycles, and other vehicles.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: crypto.randomUUID(),
        name: 'Electronics',
        slug: 'electronics',
        iconUrl: 'icon-electronics.svg',
        description: 'Gadgets, computers, and home appliances.',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {});
  }
};
