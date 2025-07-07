'use strict';
const models = require('../models');
const { randomUUID } = require('crypto');

module.exports = {
  async up(queryInterface, Sequelize) {
    const categories = await models.Category.findAll();

    if (categories.length === 0) {
      console.log('Cannot seed Attributes: No categories found. Please seed Categories first.');
      return;
    }

    const realEstateCategory = categories.find(c => c.type === 'real-estate');
    const carsCategory = categories.find(c => c.type === 'cars');

    const attributes = [];

    if (realEstateCategory) {
      attributes.push({
        id: randomUUID(),
        name: 'Beds',
        type: 'NUMBER',
        isRequired: true,
        categoryId: realEstateCategory.id,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      attributes.push({
        id: randomUUID(),
        name: 'Baths',
        type: 'NUMBER',
        isRequired: true,
        categoryId: realEstateCategory.id,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      attributes.push({
        id: randomUUID(),
        name: 'Sqft',
        type: 'NUMBER',
        isRequired: false,
        categoryId: realEstateCategory.id,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    if (carsCategory) {
      attributes.push({
        id: randomUUID(),
        name: 'Make',
        type: 'TEXT',
        isRequired: true,
        categoryId: carsCategory.id,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      attributes.push({
        id: randomUUID(),
        name: 'Model',
        type: 'TEXT',
        isRequired: true,
        categoryId: carsCategory.id,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      attributes.push({
        id: randomUUID(),
        name: 'Year',
        type: 'NUMBER',
        isRequired: true,
        categoryId: carsCategory.id,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    if (attributes.length > 0) {
      await queryInterface.bulkInsert('Attributes', attributes, {});
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ListingAttributeValues', null, {});
    await queryInterface.bulkDelete('Attributes', null, {});
  }
};