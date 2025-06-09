'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('PricingPlans', [
      {
        id: 1,
        name: 'Free Plan',
        price: 0.00,
        pricePercentage: null,
        description: 'Basic plan with limited features.',
        features: JSON.stringify(['Up to 3 listings', 'Basic support']),
        maxPhotosN: 3,
        additionalPhotosM: 0,
        sponsoredAdType: 'NONE',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'Standard Plan',
        price: 9.99,
        pricePercentage: null,
        description: 'Standard plan with more features.',
        features: JSON.stringify(['Up to 10 listings', 'Priority support', 'Featured listings (limited)']),
        maxPhotosN: 10,
        additionalPhotosM: 5,
        sponsoredAdType: 'LOCAL',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        name: 'Premium Plan',
        price: 19.99,
        pricePercentage: null,
        description: 'Premium plan with all features.',
        features: JSON.stringify(['Unlimited listings', '24/7 priority support', 'Top featured listings', 'Advanced analytics']),
        maxPhotosN: 20,
        additionalPhotosM: 10,
        sponsoredAdType: 'SPECIAL',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('PricingPlans', null, {});
  }
};
