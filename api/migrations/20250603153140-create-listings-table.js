'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Listings', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      listType: {
        type: Sequelize.ENUM('FOR_SALE', 'FOR_RENT', 'FOR_EXCHANGE', 'SERVICE', 'COMMUNITY'),
        allowNull: false,
        defaultValue: 'FOR_SALE',
      },
      imageUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      priceType: {
        type: Sequelize.ENUM('FIXED', 'NEGOTIABLE', 'CONTACT_FOR_PRICE', 'FREE'),
        defaultValue: 'FIXED',
      },
      condition: {
        type: Sequelize.ENUM('NEW', 'USED_LIKE_NEW', 'USED_GOOD', 'USED_FAIR', 'REFURBISHED', 'FOR_PARTS'),
        allowNull: true,
      },
      locationCity: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      locationRegion: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      locationLatitude: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      locationLongitude: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('ACTIVE', 'PENDING_APPROVAL', 'SOLD', 'EXPIRED', 'REMOVED_BY_ADMIN', 'DRAFT'),
        defaultValue: 'ACTIVE',
      },
      isFeatured: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      viewCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
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
      categoryId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Categories',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // Or 'SET NULL' if listings can exist without a category
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
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Listings');
  }
};