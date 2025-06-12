'use strict';
const crypto = require('crypto');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories', [
      // Real Estate Categories
      {
        id: crypto.randomUUID(),
        name: "Apartment",
        slug: "apartments",
        type: "real-estate",
        iconUrl: "/img/icon-apartment.svg",
        description: "Modern apartments and condos",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: crypto.randomUUID(),
        name: "Villa",
        slug: "villas",
        type: "real-estate",
        iconUrl: "/img/icon-villa.svg",
        description: "Luxury villas and estates",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: crypto.randomUUID(),
        name: "Home",
        slug: "homes",
        type: "real-estate",
        iconUrl: "/img/icon-house.svg",
        description: "Family homes and houses",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: crypto.randomUUID(),
        name: "Office",
        slug: "offices",
        type: "real-estate",
        iconUrl: "/img/icon-office.svg",
        description: "Commercial office spaces",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: crypto.randomUUID(),
        name: "Building",
        slug: "buildings",
        type: "real-estate",
        iconUrl: "/img/icon-building.svg",
        description: "Commercial buildings",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: crypto.randomUUID(),
        name: "Townhouse",
        slug: "townhouses",
        type: "real-estate",
        iconUrl: "/img/icon-townhouse.svg",
        description: "Modern townhouses",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: crypto.randomUUID(),
        name: "Shop",
        slug: "shops",
        type: "real-estate",
        iconUrl: "/img/icon-shop.svg",
        description: "Retail shops and stores",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: crypto.randomUUID(),
        name: "Garage",
        slug: "garages",
        type: "real-estate",
        iconUrl: "/img/icon-garage.svg",
        description: "Parking spaces and garages",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Car Categories
      {
        id: crypto.randomUUID(),
        name: "Sedan",
        slug: "cars-sedan",
        type: "cars",
        iconUrl: "/img/icon-car-sedan.svg",
        description: "Comfortable sedans",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: crypto.randomUUID(),
        name: "SUV",
        slug: "cars-suv",
        type: "cars",
        iconUrl: "/img/icon-car-suv.svg",
        description: "Spacious SUVs",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: crypto.randomUUID(),
        name: "Truck",
        slug: "cars-truck",
        type: "cars",
        iconUrl: "/img/icon-car-truck.svg",
        description: "Powerful trucks",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Other Categories
      {
        id: crypto.randomUUID(),
        name: "Electronics",
        slug: "electronics",
        type: "other",
        iconUrl: "/img/icon-electronics.svg",
        description: "Gadgets and electronics",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: crypto.randomUUID(),
        name: "Services",
        slug: "services",
        type: "other",
        iconUrl: "/img/icon-services.svg",
        description: "Various services",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: crypto.randomUUID(),
        name: "Other Deals",
        slug: "other-deals",
        type: "other",
        iconUrl: "/img/icon-deal.svg",
        description: "Miscellaneous deals",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {});
  }
};
