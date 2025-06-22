'use strict';
const models = require('../models');
const { randomUUID } = require('crypto');

module.exports = {
  async up (queryInterface, Sequelize) {
    const listings = await models.Listing.findAll();

    if (listings.length === 0) {
      console.log('Cannot seed ListingAttributes: No listings found. Please seed Listings first.');
      return;
    }

    const attributes = [];

    if (listings[0]) {
        attributes.push({ id: randomUUID(), listingId: listings[0].id, attributeName: 'Beds', attributeValue: '2', createdAt: new Date(), updatedAt: new Date() });
        attributes.push({ id: randomUUID(), listingId: listings[0].id, attributeName: 'Baths', attributeValue: '1', createdAt: new Date(), updatedAt: new Date() });
        attributes.push({ id: randomUUID(), listingId: listings[0].id, attributeName: 'Sqft', attributeValue: '1200', createdAt: new Date(), updatedAt: new Date() });
    }

    if (listings[1]) {
        attributes.push({ id: randomUUID(), listingId: listings[1].id, attributeName: 'Beds', attributeValue: '4', createdAt: new Date(), updatedAt: new Date() });
        attributes.push({ id: randomUUID(), listingId: listings[1].id, attributeName: 'Baths', attributeValue: '3', createdAt: new Date(), updatedAt: new Date() });
        attributes.push({ id: randomUUID(), listingId: listings[1].id, attributeName: 'Sqft', attributeValue: '2500', createdAt: new Date(), updatedAt: new Date() });
    }

    if (listings[2]) {
        attributes.push({ id: randomUUID(), listingId: listings[2].id, attributeName: 'Make', attributeValue: 'Ford', createdAt: new Date(), updatedAt: new Date() });
        attributes.push({ id: randomUUID(), listingId: listings[2].id, attributeName: 'Model', attributeValue: 'Mustang', createdAt: new Date(), updatedAt: new Date() });
        attributes.push({ id: randomUUID(), listingId: listings[2].id, attributeName: 'Year', attributeValue: '1969', createdAt: new Date(), updatedAt: new Date() });
    }

    if(attributes.length > 0) {
        await queryInterface.bulkInsert('ListingAttributes', attributes, {});
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ListingAttributes', null, {});
  }
};