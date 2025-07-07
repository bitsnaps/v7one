'use strict';
const models = require('../models');
const {
  randomUUID
} = require('crypto');

module.exports = {
  async up(queryInterface, Sequelize) {
    const listings = await models.Listing.findAll({
      include: [{
        model: models.Category,
        as: 'category',
        include: [{
          model: models.Attribute,
          as: 'attributes'
        }]
      }]
    });

    if (listings.length === 0) {
      console.log('Cannot seed ListingAttributeValues: No listings found.');
      return;
    }

    const attributeValues = [];

    const realEstateData = {
      'Cozy Apartment in Downtown': {
        'Beds': '2',
        'Baths': '1',
        'Sqft': '1200'
      },
      'Spacious Family House with Garden': {
        'Beds': '4',
        'Baths': '3',
        'Sqft': '2500'
      },
    };

    const carData = {
      'Vintage Car Collection': {
        'Make': 'Ford',
        'Model': 'Mustang',
        'Year': '1969'
      },
    };

    for (const listing of listings) {
      if (!listing.category || !listing.category.attributes) continue;

      let dataSet;
      if (listing.category.type === 'real-estate') {
        dataSet = realEstateData[listing.title];
      } else if (listing.category.type === 'cars') {
        dataSet = carData[listing.title];
      }

      if (!dataSet) continue;

      for (const attribute of listing.category.attributes) {
        const value = dataSet[attribute.name];
        if (value) {
          attributeValues.push({
            id: randomUUID(),
            listingId: listing.id,
            attributeId: attribute.id,
            value: value,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }
    }

    if (attributeValues.length > 0) {
      await queryInterface.bulkInsert('ListingAttributeValues', attributeValues, {});
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ListingAttributeValues', null, {});
  }
};