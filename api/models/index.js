const { Sequelize, DataTypes, Op } = require('sequelize');


// For local SQLite:
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: '7vdb.sqlite',
  logging: false, // set to console.log to see SQL queries
});

/*/ For PostgreSQL (example):
const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://user:pass@example.com:5432/dbname', {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? { require: true, rejectUnauthorized: false } : false
  },
  logging: false, // set to console.log to see SQL queries
});*/


// --- User Model ---
const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  displayName: {
    type: DataTypes.STRING,
    allowNull: true, // Can be optional initially
  },
  profilePictureUrl: {
    type: DataTypes.STRING, // URL to the image
    allowNull: true,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  region: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isVerified: { // For phone/ID verification in the future
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isActive: { // For account deactivation
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  lastLoginAt: {
    type: DataTypes.DATE,
  },
  // Timestamps
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
});

// --- Category Model ---
const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  slug: { // For URL friendly names
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  iconUrl: { // Optional icon for the category
    type: DataTypes.STRING,
    allowNull: true,
  },
  // For hierarchical categories
  parentId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Categories', // Name of the table
      key: 'id',
    },
  },
  // Timestamps
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
});

Category.hasMany(Category, { as: 'Subcategories', foreignKey: 'parentId' });
Category.belongsTo(Category, { as: 'Parent', foreignKey: 'parentId' });

// --- Listing Model ---
const Listing = sequelize.define('Listing', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2), // Adjust precision as needed
    allowNull: true, // Can be 'Contact for Price' or 'Free'
  },
  priceType: {
    type: DataTypes.ENUM('FIXED', 'NEGOTIABLE', 'CONTACT_FOR_PRICE', 'FREE'),
    defaultValue: 'FIXED',
  },
  condition: {
    type: DataTypes.ENUM('NEW', 'USED_LIKE_NEW', 'USED_GOOD', 'USED_FAIR', 'REFURBISHED', 'FOR_PARTS'),
    allowNull: true, // Not all listings are physical items (e.g. services)
  },
  locationCity: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  locationRegion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  locationLatitude: { // For map features
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  locationLongitude: { // For map features
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('ACTIVE', 'PENDING_APPROVAL', 'SOLD', 'EXPIRED', 'REMOVED_BY_ADMIN', 'DRAFT'),
    defaultValue: 'ACTIVE', // Or 'PENDING_APPROVAL' if moderation is default
  },
  isFeatured: { // For promoted listings
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  // userId (Foreign Key) will be added by association
  // categoryId (Foreign Key) will be added by association
  // Timestamps
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
  expiresAt: { // Optional: for listings that expire
    type: DataTypes.DATE,
    allowNull: true,
  },
});

// --- Listing Media Model (for multiple images/videos per listing) ---
const ListingMedia = sequelize.define('ListingMedia', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  mediaUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mediaType: {
    type: DataTypes.ENUM('IMAGE', 'VIDEO_URL'), // Store actual video or just URL
    defaultValue: 'IMAGE',
  },
  isPrimary: { // To mark the main image
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  order: { // To define the order of images
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  // listingId (Foreign Key) will be added by association
  // Timestamps
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
});

// --- Listing Attributes Model (for dynamic, category-specific fields) ---
// This is a key-value store for extra attributes
const ListingAttribute = sequelize.define('ListingAttribute', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  attributeName: { // E.g., 'Make', 'Model', 'Bedrooms', 'Service Area'
    type: DataTypes.STRING,
    allowNull: false,
  },
  attributeValue: {
    type: DataTypes.STRING, // Store all values as strings; parse on application level
    allowNull: false,
  },
  // listingId (Foreign Key) will be added by association
  // Timestamps
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
});

// --- Message Model ---
const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  // senderId (Foreign Key) will be added by association
  // receiverId (Foreign Key) will be added by association
  // listingId (Foreign Key) will be added by association (conversation is about a listing)
  // Timestamps
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
});

// --- Conversation Model (to group messages) ---
const Conversation = sequelize.define('Conversation', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    // listingId (Foreign Key) will be added by association
    // userOneId (Foreign Key) will be added by association (e.g. buyer)
    // userTwoId (Foreign Key) will be added by association (e.g. seller)
    lastMessageAt: { // For sorting conversations
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
    },
    // Timestamps
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
});

// Message.belongsTo(Conversation); // Each message belongs to one conversation
// Conversation.hasMany(Message);   // A conversation can have many messages

// --- Review Model ---
const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // revieweeId (User being reviewed - Foreign Key) will be added by association
  // reviewerId (User writing the review - Foreign Key) will be added by association
  // listingId (Review related to a specific transaction/listing - Foreign Key) optional
  // Timestamps
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
});

// --- Favorite/Saved Listing Model ---
const FavoriteListing = sequelize.define('FavoriteListing', {
  id: { // Or use a composite primary key (userId, listingId)
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  // userId (Foreign Key) will be added by association
  // listingId (Foreign Key) will be added by association
  // Timestamps
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE, // Though updatedAt might not be very useful here
});

// --- Saved Search Model ---
const SavedSearch = sequelize.define('SavedSearch', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  name: { // User-defined name for the search
    type: DataTypes.STRING,
    allowNull: true,
  },
  searchQuery: { // Store the search parameters as JSON string or specific fields
    type: DataTypes.JSONB, // JSONB is better for Postgres, JSON for others
    allowNull: false,
  },
  notify: { // Boolean to enable/disable notifications for this search
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  lastNotifiedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  // userId (Foreign Key) will be added by association
  // Timestamps
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
});

// --- Report Model ---
const Report = sequelize.define('Report', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    reason: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    reportType: { // E.g., 'LISTING', 'USER', 'MESSAGE'
        type: DataTypes.STRING,
        allowNull: false,
    },
    reportedItemId: { // ID of the listing, user, or message being reported
        type: DataTypes.UUID,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'REVIEWED_ACTION_TAKEN', 'REVIEWED_NO_ACTION'),
        defaultValue: 'PENDING',
    },
    // reporterUserId (Foreign Key) will be added by association
    // Timestamps
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
});

// --- Pricing Plan Model (from section 12) ---
const PricingPlan = sequelize.define('PricingPlan', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    name: { // E.g., 'Basic', 'Silver', 'Gold', 'Special'
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    price: { // Price 
        type: DataTypes.DECIMAL(10,2),
        allowNull: true, // Basic might be free or 0
    },
    pricePercentage: { // For 'Special' plan
        type: DataTypes.DECIMAL(5,2), // e.g., 1.00 for 1%
        allowNull: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    features: { // Store features as JSON array of strings or structured JSON
        type: DataTypes.JSONB, // JSONB for Postgres, JSON for others
        allowNull: true,
    },
    maxPhotosN: { // From your N variable
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    additionalPhotosM: { // From your M variable
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    sponsoredAdType: {
        type: DataTypes.ENUM('NONE', 'LOCAL', 'INTERNATIONAL', 'SPECIAL'),
        defaultValue: 'NONE',
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    // Timestamps
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
});

// --- User Subscription Model (which plan a user is on, if any) ---
const UserSubscription = sequelize.define('UserSubscription', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    // userId (Foreign Key) will be added by association
    // pricingPlanId (Foreign Key) will be added by association
    startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: true, // For subscriptions that don't auto-renew or are lifetime
    },
    status: {
        type: DataTypes.ENUM('ACTIVE', 'CANCELLED', 'EXPIRED', 'PAST_DUE'),
        defaultValue: 'ACTIVE',
    },
    // paymentDetails (e.g., transaction ID, payment method snippet) - could be JSON
    // Timestamps
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
});


// --- Define Associations ---

// User and Listing
User.hasMany(Listing, { foreignKey: 'userId', as: 'listings' });
Listing.belongsTo(User, { foreignKey: 'userId', as: 'seller' });

// Listing and Category
Category.hasMany(Listing, { foreignKey: 'categoryId', as: 'listings' });
Listing.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// Listing and ListingMedia
Listing.hasMany(ListingMedia, { foreignKey: 'listingId', as: 'media', onDelete: 'CASCADE' });
ListingMedia.belongsTo(Listing, { foreignKey: 'listingId' });

// Listing and ListingAttribute
Listing.hasMany(ListingAttribute, { foreignKey: 'listingId', as: 'attributes', onDelete: 'CASCADE' });
ListingAttribute.belongsTo(Listing, { foreignKey: 'listingId' });

// User and Message (Sender/Receiver) & Listing (Context) & Conversation
// User (Sender) and Conversation
User.hasMany(Conversation, { foreignKey: 'userOneId', as: 'initiatedConversations' });
User.hasMany(Conversation, { foreignKey: 'userTwoId', as: 'receivedConversations' });
Conversation.belongsTo(User, { foreignKey: 'userOneId', as: 'userOne' }); // e.g. Buyer or Initiator
Conversation.belongsTo(User, { foreignKey: 'userTwoId', as: 'userTwo' }); // e.g. Seller or Respondent

// Listing and Conversation
Listing.hasMany(Conversation, { foreignKey: 'listingId', as: 'conversations' });
Conversation.belongsTo(Listing, { foreignKey: 'listingId' });

// Message and Conversation, Message and Sender
Message.belongsTo(Conversation, { foreignKey: 'conversationId', onDelete: 'CASCADE' });
Conversation.hasMany(Message, { foreignKey: 'conversationId', as: 'messages' });
Message.belongsTo(User, { as: 'sender', foreignKey: 'senderId' });
// No direct receiver on Message, handled by Conversation participants

// User and Review (Reviewer/Reviewee)
User.hasMany(Review, { foreignKey: 'reviewerId', as: 'writtenReviews' });
User.hasMany(Review, { foreignKey: 'revieweeId', as: 'receivedReviews' });
Review.belongsTo(User, { as: 'reviewer', foreignKey: 'reviewerId' });
Review.belongsTo(User, { as: 'reviewee', foreignKey: 'revieweeId' });
Listing.hasMany(Review, { foreignKey: 'listingId', as: 'reviewsOnListing', allowNull: true }); // Review can be linked to a listing
Review.belongsTo(Listing, { foreignKey: 'listingId', allowNull: true });

// User and FavoriteListing
User.hasMany(FavoriteListing, { foreignKey: 'userId', as: 'favorites' });
FavoriteListing.belongsTo(User, { foreignKey: 'userId' });
Listing.hasMany(FavoriteListing, { foreignKey: 'listingId', as: 'favoritedBy' });
FavoriteListing.belongsTo(Listing, { foreignKey: 'listingId' });

// User and SavedSearch
User.hasMany(SavedSearch, { foreignKey: 'userId', as: 'savedSearches' });
SavedSearch.belongsTo(User, { foreignKey: 'userId' });

// User and Report (Reporter)
User.hasMany(Report, { foreignKey: 'reporterUserId', as: 'submittedReports' });
Report.belongsTo(User, { as: 'reporter', foreignKey: 'reporterUserId' });

// User and UserSubscription
User.hasMany(UserSubscription, { foreignKey: 'userId', as: 'subscriptions' });
UserSubscription.belongsTo(User, { foreignKey: 'userId' });
PricingPlan.hasMany(UserSubscription, { foreignKey: 'pricingPlanId', as: 'subscribers' });
UserSubscription.belongsTo(PricingPlan, { foreignKey: 'pricingPlanId' });


// --- Sync Database ---
// Use { force: true } only in development to drop and recreate tables.
// Use { alter: true } in development to attempt to alter tables to match model (can be risky).
// In production, you should use migrations.
const syncDatabase = async () => {
  try {
    // await sequelize.authenticate(); // Test connection
    // console.log('Connection has been established successfully.');
    await sequelize.sync({ alter: true }); // or { force: true } for dev
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database or synchronize models:', error);
  }
};

// Call this function if you want to run sync when this file is executed
// syncDatabase();

module.exports = {
  sequelize,
  Op,
  User,
  Category,
  Listing,
  ListingMedia,
  ListingAttribute,
  Message,
  Conversation,
  Review,
  FavoriteListing,
  SavedSearch,
  Report,
  PricingPlan,
  UserSubscription,
  syncDatabase, // Export sync function if you want to call it from elsewhere
};

/*
Notes for Compatibility (SQLite & PostgreSQL):
1.  UUIDs: `Sequelize.UUIDV4` works well. PostgreSQL has native UUID type, SQLite stores as TEXT.
2.  ENUMs: Sequelize handles ENUMs for both. PostgreSQL has native ENUM types, SQLite creates a CHECK constraint.
3.  JSON/JSONB:
    *   `DataTypes.JSONB` is generally preferred for PostgreSQL due to better indexing and performance.
    *   `DataTypes.JSON` can be used for broader compatibility if JSONB is not critical. SQLite will store it as TEXT.
    *   If you absolutely need JSONB features on Postgres and TEXT on SQLite, you might need conditional type definition or ensure your queries are compatible. For this schema, I've used JSONB where it makes sense, assuming the benefits on Postgres are desired.
4.  Date/Time: `DataTypes.DATE` works for both. PostgreSQL `TIMESTAMPTZ` (timestamp with time zone) is default, SQLite stores as TEXT in ISO8601 format. Sequelize handles the conversion.
5.  Decimal: `DataTypes.DECIMAL(precision, scale)` is important. PostgreSQL has `NUMERIC`, SQLite has `REAL` or stores as TEXT. Sequelize usually handles this.
6.  Case Sensitivity: PostgreSQL is case-sensitive for identifiers unless quoted. SQLite is generally case-insensitive for table/column names. Sequelize standardizes this by typically using quoted identifiers or consistent casing (often camelCase for JS models, snake_case for DB columns depending on config).
7.  `onDelete: 'CASCADE'` for associations is generally supported.
8.  `alter: true` in `sync()`: Be cautious with this in production. Migrations are the recommended way to manage schema changes in production environments for both databases.
9. Default Values: `defaultValue: Sequelize.NOW` for dates, `Sequelize.UUIDV4` for UUIDs.
10. Indexing: You'll want to add indexes for frequently queried columns (e.g., `email` on User, `slug` on Category, `listingId` on related tables, `status` on Listing, etc.). This can be done in model definitions or via migrations.
    Example for adding an index in model definition:
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
      indexes: [{ unique: true, fields: ['email'] }] // Though `unique: true` often creates an index
    },
*/