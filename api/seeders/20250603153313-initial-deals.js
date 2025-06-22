'use strict';
const crypto = require('crypto');
const models = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const userRows = await models.User.findAll();
    // const users = await queryInterface.sequelize.query(
    //   `SELECT id from Users;`
    // );
    // const userRows = users[0];
    // const categories = await queryInterface.sequelize.query(
    //   `SELECT id from Categories;`
    // );
    // const categoryRows = categories[0];

    const categoryRows = await models.Category.findAll();

    if (userRows.length === 0 || categoryRows.length === 0) {
      console.log('Cannot seed Listings: No users or categories found. Please seed Users and Categories first.');
      return;
    }

    await queryInterface.bulkInsert('Listings', [
      {
        id: crypto.randomUUID(),
        title: 'Cozy Apartment in Downtown',
        description: 'A beautiful and cozy apartment located in the heart of the city. Perfect for singles or couples.',
        price: 1200.00,
        listType: 'FOR_RENT',
        imageUrl: 'img/deals/property-1.jpg',
        priceType: 'FIXED',
        condition: 'NEW',
        locationCity: 'Metropolis',
        locationRegion: 'State A',
        locationLatitude: 34.0522,
        locationLongitude: -118.2437,
        status: 'ACTIVE',
        isFeatured: true,
        viewCount: 150,
        userId: userRows[0].id, // Assuming the first user
        categoryId: categoryRows[0].id, // Assuming the first category
        createdAt: new Date(),
        updatedAt: new Date(),
        expiresAt: new Date(new Date().setDate(new Date().getDate() + 30)) // Expires in 30 days
      },
      {
        id: crypto.randomUUID(),
        title: 'Spacious Family House with Garden',
        description: 'Large family house with a beautiful garden and modern amenities. Ideal for families with children.',
        price: 250000.00,
        listType: 'FOR_SALE',
        imageUrl: 'img/deals/property-2.jpg',
        priceType: 'FIXED',
        condition: 'USED_GOOD',
        locationCity: 'Suburbia',
        locationRegion: 'State B',
        locationLatitude: 34.1522,
        locationLongitude: -118.3437,
        status: 'ACTIVE',
        isFeatured: false,
        viewCount: 75,
        userId: userRows.length > 1 ? userRows[1].id : userRows[0].id, // Assuming the second user or first if only one
        categoryId: categoryRows.length > 1 ? categoryRows[1].id : categoryRows[0].id, // Assuming the second category or first if only one
        createdAt: new Date(),
        updatedAt: new Date(),
        expiresAt: new Date(new Date().setDate(new Date().getDate() + 60)) // Expires in 60 days
      },
      {
        id: crypto.randomUUID(),
        title: 'Vintage Car Collection',
        description: 'A rare collection of vintage cars, well-maintained and in excellent condition.',
        price: 50000.00,
        listType: 'FOR_SALE',
        imageUrl: 'img/deals/car-1.jpg',
        priceType: 'NEGOTIABLE',
        condition: 'NEW',
        locationCity: 'Old Town',
        locationRegion: 'State C',
        locationLatitude: 34.2522,
        locationLongitude: -118.4437,
        status: 'ACTIVE',
        isFeatured: true,
        viewCount: 200,
        userId: userRows[0].id, // Assuming the first user
        categoryId: categoryRows.length > 7 ? categoryRows[8].id : categoryRows[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
        expiresAt: null // Does not expire
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Listings', null, {});
  }
};
