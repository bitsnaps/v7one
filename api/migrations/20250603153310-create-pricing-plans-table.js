'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PricingPlans', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      pricePercentage: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      features: {
        type: Sequelize.JSONB, // Use JSON for SQLite
        allowNull: true,
      },
      maxPhotosN: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      additionalPhotosM: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      sponsoredAdType: {
        type: Sequelize.ENUM('NONE', 'LOCAL', 'INTERNATIONAL', 'SPECIAL'),
        defaultValue: 'NONE',
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PricingPlans');
  }
};