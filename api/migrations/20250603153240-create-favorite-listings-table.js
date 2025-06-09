'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('FavoriteListings', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      listingId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Listings',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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

    // Add a unique constraint for userId and listingId combination
    await queryInterface.addConstraint('FavoriteListings', {
      fields: ['userId', 'listingId'],
      type: 'unique',
      name: 'user_listing_favorite_unique'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('FavoriteListings', 'user_listing_favorite_unique');
    await queryInterface.dropTable('FavoriteListings');
  }
};