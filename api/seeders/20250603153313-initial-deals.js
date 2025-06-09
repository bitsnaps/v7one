'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
      `SELECT id from Users;`
    );
    const categories = await queryInterface.sequelize.query(
      `SELECT id from Categories;`
    );

    const userRows = users[0];
    const categoryRows = categories[0];

    if (userRows.length === 0 || categoryRows.length === 0) {
      console.log('Cannot seed Listings: No users or categories found. Please seed Users and Categories first.');
      return;
    }

    await queryInterface.bulkInsert('Listings', [
      {
        id: 1,
        title: 'Cozy Apartment in Downtown',
        description: 'A beautiful and cozy apartment located in the heart of the city. Perfect for singles or couples.',
        price: 1200.00,
        priceType: 'monthly',
        condition: 'new',
        locationCity: 'Metropolis',
        locationRegion: 'State A',
        locationLatitude: 34.0522,
        locationLongitude: -118.2437,
        status: 'active',
        isFeatured: true,
        viewCount: 150,
        userId: userRows[0].id, // Assuming the first user
        categoryId: categoryRows[0].id, // Assuming the first category
        createdAt: new Date(),
        updatedAt: new Date(),
        expiresAt: new Date(new Date().setDate(new Date().getDate() + 30)) // Expires in 30 days
      },
      {
        id: 2,
        title: 'Spacious Family House with Garden',
        description: 'Large family house with a beautiful garden and modern amenities. Ideal for families with children.',
        price: 250000.00,
        priceType: 'fixed',
        condition: 'used',
        locationCity: 'Suburbia',
        locationRegion: 'State B',
        locationLatitude: 34.1522,
        locationLongitude: -118.3437,
        status: 'active',
        isFeatured: false,
        viewCount: 75,
        userId: userRows.length > 1 ? userRows[1].id : userRows[0].id, // Assuming the second user or first if only one
        categoryId: categoryRows.length > 1 ? categoryRows[1].id : categoryRows[0].id, // Assuming the second category or first if only one
        createdAt: new Date(),
        updatedAt: new Date(),
        expiresAt: new Date(new Date().setDate(new Date().getDate() + 60)) // Expires in 60 days
      },
      {
        id: 3,
        title: 'Vintage Car Collection',
        description: 'A rare collection of vintage cars, well-maintained and in excellent condition.',
        price: 50000.00,
        priceType: 'negotiable',
        condition: 'collectible',
        locationCity: 'Old Town',
        locationRegion: 'State C',
        locationLatitude: 34.2522,
        locationLongitude: -118.4437,
        status: 'active',
        isFeatured: true,
        viewCount: 200,
        userId: userRows[0].id, // Assuming the first user
        categoryId: categoryRows.length > 2 ? categoryRows[2].id : categoryRows[0].id, // Assuming the third category or first if not enough
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
