'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop the old table if it exists
    await queryInterface.dropTable('ListingAttributes').catch(() => {
      console.log('ListingAttributes table did not exist, skipping drop.');
    });

    // Create the new Attributes table
    await queryInterface.createTable('Attributes', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('TEXT', 'NUMBER', 'BOOLEAN', 'DATE'),
        allowNull: false,
        defaultValue: 'TEXT',
      },
      isRequired: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      categoryId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Categories',
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

    // Create the new ListingAttributeValues table
    await queryInterface.createTable('ListingAttributeValues', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      value: {
        type: Sequelize.TEXT,
        allowNull: false,
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
      attributeId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Attributes',
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ListingAttributeValues');
    await queryInterface.dropTable('Attributes');
  }
};