'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Listings', 'price', {
      type: Sequelize.DECIMAL(20, 8),
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Listings', 'price', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    });
  }
};
