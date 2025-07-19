'use strict';
const crypto = require('crypto');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('PricingPlans', [
      {
        id: crypto.randomUUID(),
        name: 'Basic',
        price: 0,
        pricePercentage: null,
        description: 'Basic plan with essential features.',
        features: JSON.stringify([
          'Upload photos',
          'Free ad on social media platforms',
          'Normal pricing',
        ]),
        sponsoredAdType: 'NONE',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: crypto.randomUUID(),
        name: 'Silver',
        price: 20000,
        pricePercentage: null,
        description: 'Silver plan with additional benefits.',
        features: JSON.stringify([
          'All in Basic package plus:',
          'Upload M additional photos',
          'Professional video',
          'Documentation',
        ]),
        sponsoredAdType: 'LOCAL',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: crypto.randomUUID(),
        name: 'Gold',
        price: 30000,
        pricePercentage: null,
        description: 'Gold plan for advanced users.',
        features: JSON.stringify([
          'All in Silver package plus:',
          'Special professional video',
          'Special documentation',
        ]),
        sponsoredAdType: 'INTERNATIONAL',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: crypto.randomUUID(),
        name: 'Special',
        price: null,
        pricePercentage: 1,
        description: 'Special plan with premium services.',
        features: JSON.stringify([
          'All in Gold package plus:',
          'Consulting services',
        ]),
        sponsoredAdType: 'SPECIAL',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('PricingPlans', null, {});
  }
};
