const { serve } = require('@hono/node-server');
const { Hono } = require('hono');
const { serveStatic } = require('@hono/node-server/serve-static');
const { cors } = require('hono/cors');
const { rateLimiter } = require('./honoRateLimiter');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const models = require('./models');
const { Sequelize, Op } = require('sequelize');
const path = require('path');
const fs = require('node:fs');
const MAX_TIMESTAMP_AGE_MS = 15 * 60 * 1000; // 15 minutes validity for timestamp/token


// TEST: Create a test account for Ethereal Email
async function createTestAccount() {
  try {
      const testAccount = await nodemailer.createTestAccount();
      return nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
              user: testAccount.user,
              pass: testAccount.pass,
          },
      });
  } catch (error) {
    console.error(`ERROR: ${error.message}`);
  }
  return null;
}

const HOST =  process.env.DB_HOST; // Assuming DB_HOST equals domain name
const EMAIL_CONTACT = process.env.EMAIL_CONTACT || `contact@${HOST}`;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

let transporter;
if (process.env.NODE_ENV !== 'production'){
    createTestAccount().then(t => {
        transporter = t;
        console.log('Email test account created');
    });
} else {
// PROD: Configure email transporter
transporter = nodemailer.createTransport({
    host: `mail.${HOST}`, // Replace with your SMTP host ('smtp.example.com')
    port: 465, //993, // Common SMTP port (587 worked with secure:false)
    secure: true, // true for 465, false for other ports
    auth: {
      user: EMAIL_CONTACT, // Replace with your email
      pass: EMAIL_PASSWORD // Replace with your password or app-specific password
    },
  });
}

/*/ deals and categories data
const dealsData = [
    {
        "id": 1,
        "title": "Luxury Villa with Ocean View",
        "image": "/img/deals/property-1.jpg",
        "price": "$2,500,000",
        "status": "For Sell",
        "type": "Villa",
        "location": "123 Ocean Drive, Miami, FL",
        "sqft": "5000 Sqft",
        "beds": "5 Bed",
        "baths": "6 Bath",
        "category": ["featured", "for-sale"]
      },
      {
        "id": 2,
        "title": "Modern Downtown Apartment",
        "image": "/img/deals/property-2.jpg",
        "price": "$3,500/month",
        "status": "For Rent",
        "type": "Apartment",
        "location": "456 Main Street, New York, NY",
        "sqft": "1200 Sqft",
        "beds": "2 Bed",
        "baths": "2 Bath",
        "category": ["featured", "for-rent"]
      },
      {
        "id": 3,
        "title": "Spacious Family House",
        "image": "/img/deals/property-3.jpg",
        "price": "$750,000",
        "status": "For Sell",
        "type": "House",
        "location": "789 Suburb Lane, Chicago, IL",
        "sqft": "2500 Sqft",
        "beds": "4 Bed",
        "baths": "3 Bath",
        "category": ["for-sale"]
      },
      {
        "id": 4,
        "title": "Cozy Studio for Rent",
        "image": "/img/deals/property-4.jpg",
        "price": "$1,800/month",
        "status": "For Rent",
        "type": "Studio",
        "location": "101 City Center, San Francisco, CA",
        "sqft": "600 Sqft",
        "beds": "1 Bed",
        "baths": "1 Bath",
        "category": ["for-rent"]
      },
      {
        "id": 5,
        "title": "Commercial Office Space",
        "image": "/img/deals/office-1.jpg",
        "price": "$1,200,000",
        "status": "For Sell",
        "type": "Office",
        "location": "202 Business Park, Austin, TX",
        "sqft": "10000 Sqft",
        "beds": "N/A",
        "baths": "4 Bath",
        "category": ["featured", "for-sale"]
      },
      {
        "id": 6,
        "title": "Charming Suburban Home for Rent",
        "image": "/img/deals/property-5.jpg",
        "price": "$4,000/month",
        "status": "For Rent",
        "type": "Home",
        "location": "303 Quiet Street, Seattle, WA",
        "sqft": "1800 Sqft",
        "beds": "3 Bed",
        "baths": "2.5 Bath",
        "category": ["for-rent"]
      },
      {
        "id": 7,
        "title": "Sleek Sports Car",
        "image": "/img/deals/car-1.jpg",
        "price": "$85,000",
        "status": "For Sell",
        "type": "Automobile",
        "location": "Prestige Motors, LA",
        "sqft": "N/A",
        "beds": "N/A",
        "baths": "N/A",
        "category": ["featured", "for-sale"]
      },
      {
        "id": 8,
        "title": "Vintage Collector Watch",
        "image": "/img/deals/watch-1.jpg",
        "price": "$22,000",
        "status": "For Sell",
        "type": "Luxury Item",
        "location": "Timeless Pieces Boutique",
        "sqft": "N/A",
        "beds": "N/A",
        "baths": "N/A",
        "category": ["for-sale"]
      },
      {
        "id": 9,
        "title": "High-End Gaming Laptop Rental",
        "image": "/img/deals/laptop-1.jpg",
        "price": "$200/week",
        "status": "For Rent",
        "type": "Electronics",
        "location": "Tech Rentals Co.",
        "sqft": "N/A",
        "beds": "N/A",
        "baths": "N/A",
        "category": ["featured", "for-rent"]
      }
];
*/

/*
const categoriesData = [
    // Real Estate Categories
    {
      id: 1,
      name: "Apartment",
      slug: "apartments",
      iconUrl: "/img/icon-apartment.svg",
      description: "Modern apartments and condos",
      count: 123,
      type: "real-estate"
    },
    {
      id: 2,
      name: "Villa",
      slug: "villas",
      iconUrl: "/img/icon-villa.svg",
      description: "Luxury villas and estates",
      count: 89,
      type: "real-estate"
    },
    {
      id: 3,
      name: "Home",
      slug: "homes",
      iconUrl: "/img/icon-house.svg",
      description: "Family homes and houses",
      count: 156,
      type: "real-estate"
    },
    {
      id: 4,
      name: "Office",
      slug: "offices",
      iconUrl: "/img/icon-office.svg",
      description: "Commercial office spaces",
      count: 45,
      type: "real-estate"
    },
    {
      id: 5,
      name: "Building",
      slug: "buildings",
      iconUrl: "/img/icon-building.svg",
      description: "Commercial buildings",
      count: 30,
      type: "real-estate"
    },
    {
      id: 6,
      name: "Townhouse",
      slug: "townhouses",
      iconUrl: "/img/icon-townhouse.svg",
      description: "Modern townhouses",
      count: 67,
      type: "real-estate"
    },
    {
      id: 7,
      name: "Shop",
      slug: "shops",
      iconUrl: "/img/icon-shop.svg",
      description: "Retail shops and stores",
      count: 88,
      type: "real-estate"
    },
    {
      id: 8,
      name: "Garage",
      slug: "garages",
      iconUrl: "/img/icon-garage.svg",
      description: "Parking spaces and garages",
      count: 20,
      type: "real-estate"
    },
    // Car Categories
    {
      id: 9,
      name: "Sedan",
      slug: "cars-sedan",
      iconUrl: "/img/icon-car-sedan.svg",
      description: "Comfortable sedans",
      count: 210,
      type: "cars"
    },
    {
      id: 10,
      name: "SUV",
      slug: "cars-suv",
      iconUrl: "/img/icon-car-suv.svg",
      description: "Spacious SUVs",
      count: 150,
      type: "cars"
    },
    {
      id: 11,
      name: "Truck",
      slug: "cars-truck",
      iconUrl: "/img/icon-car-truck.svg",
      description: "Powerful trucks",
      count: 75,
      type: "cars"
    },
    // Other Categories
    {
      id: 12,
      name: "Electronics",
      slug: "electronics",
      iconUrl: "/img/icon-electronics.svg",
      description: "Gadgets and electronics",
      count: 300,
      type: "other"
    },
    {
      id: 13,
      name: "Services",
      slug: "services",
      iconUrl: "/img/icon-services.svg",
      description: "Various services",
      count: 95,
      type: "other"
    },
    {
      id: 14,
      name: "Other Deals",
      slug: "other-deals",
      iconUrl: "/img/icon-deal.svg",
      description: "Miscellaneous deals",
      count: 50,
      type: "other"
    }
];
*/

const app = new Hono();

// Add CORS middleware (for Dev)
app.use('/*', cors({
  origin: ['https://www.v7one.com','http://localhost:5173', 'http://127.0.0.1:5173'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
  // This means the browser will expose these headers when it makes requests to your API
  credentials: true
}));

// Anything comes from static folder will be served from "/"
app.use('/*', serveStatic({ root: './static' }));

// Apply the rate limiting middleware to all requests.
app.use(
    rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `windowMs` (here, per 15 minutes).
    // standardHeaders: "draft-6", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    keyGenerator: (c) => c.req.header('x-forwarded-for') || c.req.ip || 'unknown',
    message: 'Too many requests from this IP, please try again after a minute'
    // keyGenerator: (c) => "<unique_key>", // Method to generate custom identifiers for clients.
    // store: ... , // Redis, MemoryStore, etc. See below.
  })
);

app.get('/csrf', async (c) => {
    const ts = c.req.query('ts');
    if (!ts){
        return c.json({ secret: '', stamp: 0, }, 400);
    }
    const token = crypto.createHash('sha256').update(ts).digest('hex');
    return c.json({
        secret: token,
        stamp: Date.now()-parseInt(ts),
    });
});

// In-memory user store (for demonstration purposes)
const users = {};

// In-memory offer store (for demonstration purposes)
const offers = [];

// Helper function to hash passwords
function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
}

// Helper function to verify passwords
function verifyPassword(password, storedPassword) {
    const [salt, originalHash] = storedPassword.split(':');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash === originalHash;
}

function isValidUUID(id) {
  return id && id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
}

/*
app.get('/api/users', async (c) => {
    const users = await models.User.findAll(); // {"success":true,"users":[{"id":"0..Z"}]}
    // const users = await models.User.findOne(); // {"success":true,"users":{"id":"0..Z"}}
    // const users = await models.User.findAndCountAll(); // {"success":true,"users":{"count":1,"rows":[{"id":"0..Z"}]}}
    // const users = await models.sequelize.query(
    //   `SELECT id from Users;`
    // ); // {"success":true,"users":[[{"id":"0..c"}],{}]}
    return c.json({success: true, users: users});
})*/

// 1- Should be executed with:
// curl -X POST http://localhost:3000/api/install
app.post('/api/install', async (c) => {
  // Only allow in debug mode
  if (process.env.NODE_ENV === 'production') {
    return c.json({ error: 'Install endpoint is only available in debug mode' }, 403);
  }

  try {
    const tableStatus = {};
    
    // Test connection
    await models.sequelize.authenticate();
    
    // Check each model's table existence
    for (const [modelName, model] of Object.entries(models)) {
      if (model.tableName) { // Only check actual models, not sequelize/Op
        try {
          await model.describe(); // This will throw if table doesn't exist
          tableStatus[modelName] = 'exists';
        } catch (err) {
          tableStatus[modelName] = 'missing';
        }
      }
    }

    // Create missing tables
    await models.sequelize.sync({ alter: false }); // Don't alter existing tables
    
    // Verify all tables after sync
    const finalStatus = {};
    for (const [modelName, model] of Object.entries(models)) {
      if (model.tableName) {
        try {
          const tableInfo = await model.describe();
          finalStatus[modelName] = {
            status: 'ready',
            columns: Object.keys(tableInfo).length
          };
        } catch (err) {
          finalStatus[modelName] = {
            status: 'error',
            error: err.message
          };
        }
      }
    }

    return c.json({
      success: (Object.keys(finalStatus).length == Object.keys(tableStatus).length),
      message: `Database installation completed`,
      details: {
        initialStatus: tableStatus,
        finalStatus: finalStatus
      }
    });

  } catch (error) {
    console.error('Installation error:', error);
    return c.json({
      success: false,
      error: error.message,
      details: error.stack
    }, 500);
  }
});

// 2- Should be executed with:
// curl -X POST -d '{"username":"admin@example.com","password":"master"}' http://localhost:3000/api/create-admin
app.post('/api/create-admin', async (c) => {
  // Only allow in debug mode
  if (process.env.NODE_ENV === 'production') {
      return c.json({ error: 'This endpoint is only available in debug mode' }, 403);
    }

  const { username, password } = await c.req.json();
  await models.sequelize.authenticate();
  const hashedPassword = hashPassword(password);
  const adminUser = await models.User.create({
      email: username,
      passwordHash: hashedPassword,
      isAdmin: true,
      isVerified: true
  });
  return c.json({ success: true, adminUser})
})

// 3- Should be executed with:
// curl -X POST http://localhost:3000/api/seeds
app.post('/api/seeds', async (c) => {
    // Only allow in debug mode
    if (process.env.NODE_ENV === 'production') {
      return c.json({ error: 'Seeds endpoint is only available in debug mode' }, 403);
    }
  
    await models.sequelize.authenticate();
    
    const queryInterface = models.sequelize.getQueryInterface();
    // const Sequelize = db.Sequelize;
    const seedersDir = path.join(__dirname, 'seeders');
    const results = [];
  
    // Define the order of seeders
    const orderedSeederFiles = [
      //'20250603153301-admin-user.js', // call /api/create-admin to create the admin user
      '20250603153302-categories-deals.js',
      '20250603153332-initial-plans.js', // Plans can be seeded before or after users/categories, but before deals if deals depend on plans (not the case here)
      '20250603153313-initial-deals.js' // Deals depend on users and categories
    ];
  
    try {
      for (const seederFile of orderedSeederFiles) {
        const seederPath = path.join(seedersDir, seederFile);
        if (fs.existsSync(seederPath)) {
          const seeder = require(seederPath);
          if (seeder && typeof seeder.up === 'function') {
            console.log(`Running seeder: ${seederFile}`);
            await seeder.up(queryInterface, Sequelize);
            results.push({ seeder: seederFile, status: 'success' });
            console.log(`Successfully ran seeder: ${seederFile}`);
          } else {
            results.push({ seeder: seederFile, status: 'failed', error: 'Invalid seeder structure (missing up function)' });
            console.error(`Invalid seeder structure for ${seederFile}`);
          }
        } else {
          results.push({ seeder: seederFile, status: 'failed', error: 'File not found' });
          console.error(`Seeder file not found: ${seederFile}`);
        }
      }
      return c.json({ success: true, message: 'Seeders executed successfully.', results });
    } catch (error) {
      console.error('Error running seeders:', error);
      results.push({ seeder: 'general', status: 'failed', error: error.message });
      return c.json({ success: false, error: 'Failed to run seeders.', details: error.message, results }, 500);
    }
});

// Endpoint to drop all tables (in case needed)
// curl -X POST http://localhost:3000/api/drop-tables
app.post('/api/drop-tables', async (c) => {
  // Only allow in debug mode
  if (process.env.NODE_ENV === 'production') {
    return c.json({ error: 'Drop tables endpoint is only available in debug mode' }, 403);
  }

  try {
    // const tableStatus = {};
    // const queryInterface = models.sequelize.getQueryInterface();

    // Test connection
    await models.sequelize.authenticate();

    // Drop all tables if they exist
    await models.sequelize.drop({});

    // Check each model's table existence before attempting to drop
    // const modelNames = Object.keys(models).filter(name => models[name].tableName && name !== 'sequelize' && name !== 'Sequelize');
    
    // Drop tables in reverse order of creation (important for foreign key constraints)
    // This order might need to be manually adjusted based on dependencies
    // For now, we'll iterate through a reversed list of models as a general approach.
    // A more robust solution would involve analyzing dependencies or using a predefined order.
    // const reversedModelNames = [...modelNames].reverse();     

    /*for (const modelName of reversedModelNames) {
      const model = models[modelName];
      if (model.tableName) {
        try {
          await model.describe(); // Check if table exists
          await queryInterface.dropTable(model.tableName);
          tableStatus[model.tableName] = 'dropped';
        } catch (err) {
          // If describe fails, table likely doesn't exist, or another error occurred
          if (err.message.includes('does not exist') || err.name === 'SequelizeDatabaseError') {
            tableStatus[model.tableName] = 'missing_or_not_dropped';
          } else {
            tableStatus[model.tableName] = `error_dropping: ${err.message}`;
            console.error(`Error dropping table ${model.tableName}:`, err);
          }
        }
      }
    }*/

    /*/ Verify all tables are dropped
    const finalStatus = {};
    for (const modelName of modelNames) {
      const model = models[modelName];
      if (model.tableName) {
        try {
          await model.describe();
          finalStatus[model.tableName] = 'exists_after_drop_attempt'; // Should not happen
        } catch (err) {
          finalStatus[model.tableName] = 'successfully_dropped_or_missing';
        }
      }
    }*/

    return c.json({
      success: true,
      message: 'Attempted to drop all tables.',
      // details: {
      //   dropAttempts: tableStatus,
      //   verification: finalStatus
      // }
    });

  } catch (error) {
    console.error('Drop tables error:', error);
    return c.json({
      success: false,
      error: error.message,
      details: error.stack
    }, 500);
  }
});

app.post('/api/signup', async (c) => {
    try {
        const { username, password } = await c.req.json();

        if (!username || !password) {
            return c.json({ success: false, message: 'Username and password are required' }, 400);
        }

        if (users[username]) {
            return c.json({ success: false, message: 'User already exists' }, 409);
        }

        users[username] = { password: hashPassword(password) };
        console.log('User signed up:', username);
        return c.json({ success: true, message: 'Signup successful' });
    } catch (error) {
        console.error('Signup error:', error);
        return c.json({ success: false, message: 'An error occurred during signup' }, 500);
    }
});

app.post('/api/login', async (c) => {
  try {
      const { username, password } = await c.req.json();

      if (!username || !password) {
          return c.json({ success: false, message: 'Username and password are required' }, 400);
      }

      const user = users[username];
      if (!user) {
          return c.json({ success: false, message: 'Invalid username or password' }, 401);
      }

      if (!verifyPassword(password, user.password)) {
          return c.json({ success: false, message: 'Invalid username or password' }, 401);
      }
      
      console.log('User logged in:', username);
      // In a real application, you would generate and return a JWT or session token here
      return c.json({ success: true, message: 'Login successful' });
  } catch (error) {
      console.error('Login error:', error);
      return c.json({ success: false, message: 'An error occurred during login' }, 500);
  }
});

// API endpoint for a single deal by ID
app.get('/api/deals/:id', async (c) => {
    try {
        const dealId = c.req.param('id');
        if (!isValidUUID(dealId)) {
            return c.json({ success: false, message: 'Invalid query' }, 400);
        }
        const deal = await models.Listing.findByPk(dealId, {
            include: [
                { model: models.User, as: 'seller', attributes: ['id', 'email'] },
                { model: models.Category, as: 'category', attributes: ['id', 'name', 'slug'] }
            ]
        });

        if (deal) {
            // Transform the deal to match the old structure if necessary
            const formattedDeal = {
                id: deal.id,
                title: deal.title,
                image: deal.imageUrl, // Assuming image_url is the field in Listing model
                price: deal.price, 
                status: deal.status,
                type: deal.listType, 
                location: deal.location,
                sqft: deal.sqft ? `${deal.sqft} Sqft` : 'N/A',
                beds: deal.beds ? `${deal.beds} Bed` : 'N/A',
                baths: deal.baths ? `${deal.baths} Bath` : 'N/A',
                category: deal.category ? [deal.category.name.toLowerCase()] : [],
                description: deal.description,
                // Add other fields as necessary
            };
            return c.json({ success: true, deal: formattedDeal });
        } else {
            return c.json({ success: false, message: 'Deal not found' }, 404);
        }
    } catch (error) {
        console.error('Error fetching deal:', error);
        return c.json({ success: false, message: 'An error occurred', error: error.message }, 500);
    }
});

// API endpoint for all deals with optional category filter, pagination, and search
app.get('/api/deals', async (c) => {
    try {
        const page = parseInt(c.req.query('page')) || 1;
        const limit = parseInt(c.req.query('limit')) || 10; 
        const offset = (page - 1) * limit;

        const categorySlug = c.req.query('category_slug') || c.req.query('category'); // Support both for flexibility
        const statusQuery = c.req.query('status');
        // const typeQuery = c.req.query('type');
        const locationQuery = c.req.query('location');
        const searchQuery = c.req.query('search') || c.req.query('keyword');

        const whereClause = {};
        const includeClause = [
            { model: models.User, as: 'seller', attributes: ['id', 'email'] }, 
            { model: models.Category, as: 'category', attributes: ['id', 'name', 'slug'] }
        ];

        if (categorySlug) {
            // Ensure the include for Categories has a 'where' clause added or modified
            let categoryInclude = includeClause.find(inc => inc.as === 'category');
            if (categoryInclude) {
                categoryInclude.where = { slug: categorySlug };
            } else {
                // This case should ideally not happen if 'category' is always included
                includeClause.push({ model: models.Category, as: 'category', where: { slug: categorySlug }, attributes: ['id', 'name', 'slug'] });
            }
        }
        if (statusQuery) {
            whereClause.status = statusQuery;
        }
        // if (typeQuery) {
        //     whereClause.listType = typeQuery; 
        // }
        if (locationQuery) {
            whereClause.location = { [Op.iLike]: `%${locationQuery}%` }; 
        }
        if (searchQuery) {
            whereClause[Op.or] = [
                { title: { [Op.iLike]: `%${searchQuery}%` } },
                { description: { [Op.iLike]: `%${searchQuery}%` } },
            ];
        }

        const { count, rows } = await models.Listing.findAndCountAll({
            where: whereClause,
            include: includeClause,
            limit: limit,
            offset: offset,
            order: [['createdAt', 'DESC']],
            distinct: true, // Important for counts when using includes with where clauses on associated models
            subQuery: false // May be needed depending on complexity, test with and without
        });

        const formattedDeals = rows.map(deal => ({
            id: deal.id,
            title: deal.title,
            image: deal.imageUrl,
            price: deal.price,
            status: deal.status,
            type: deal.listType,
            location: deal.location,
            isFeatured: deal.isFeatured,
            sqft: deal.sqft ? `${deal.sqft} Sqft` : 'N/A',
            beds: deal.beds ? `${deal.beds} Bed` : 'N/A',
            baths: deal.baths ? `${deal.baths} Bath` : 'N/A',
            category: deal.category ? [deal.category.name.toLowerCase()] : [],
            description: deal.description
        }));

        return c.json({
            success: true,
            data: formattedDeals, // Changed from 'deals' to 'data' to match existing structure for /api/deals
            total: count,
            page: page,
            limit: limit,
            totalPages: Math.ceil(count / limit)
        });
    } catch (error) {
        console.error('Error fetching deals:', error);
        return c.json({ success: false, message: 'An error occurred while fetching deals', error: error.message }, 500);
    }
});

// API endpoint for deal categories
app.get('/api/categories', async (c) => {
    try {
        const categoriesData = await models.Category.findAll();
        return c.json({ success: true, data: categoriesData });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return c.json({ success: false, message: 'Error fetching categories' }, 500);
    }
});

app.post('/api/offers', async (c) => {
    try {
        const { type, title, description, price, username } = await c.req.json();

        // Basic validation
        if (!type || !title || !description || !price || !username) {
            return c.json({ success: false, message: 'Type, title, description, price, and username are required' }, 400);
        }

        // Validate offer type
        const validTypes = ['RealEstate', 'Car', 'Deal'];
        if (!validTypes.includes(type)) {
            return c.json({ success: false, message: 'Invalid offer type. Must be RealEstate, Car, or Deal' }, 400);
        }

        // Check if user exists (optional, but good practice)
        if (!users[username]) {
            return c.json({ success: false, message: 'User not found. Offer cannot be created.' }, 404);
        }

        const newOffer = {
            // id: crypto.randomBytes(16).toString('hex'), // Generate a unique ID for the offer
            // Generate a UUID for the offer
            id: crypto.randomUUID(), // Generate a random UUID v4
            type,
            title,
            description,
            price,
            username, // Associate offer with the user
            approved: false, // Default to not approved
            createdAt: new Date().toISOString()
        };

        offers.push(newOffer);
        console.log('New offer created:', newOffer);
        return c.json({ success: true, message: 'Offer submitted successfully. It will be reviewed by an admin.', offer: newOffer });

    } catch (error) {
        console.error('Offer creation error:', error);
        return c.json({ success: false, message: 'An error occurred while creating the offer' }, 500);
    }
});

app.post('/contact', async (c) => {
    const genericErrorMessage = 'An error occurred while processing your request. Please try again later.';
    try {
        
        // Get the x_csrf_token from headers
        const x_csrf_token = c.req.header('x-csrf-token');

        // Parse the form data from the request
        // const formData = await c.req.json(); // use this when data encoded as JSON object
        const formData = await c.req.parseBody(); // when data encoded as form-data
        console.log(formData);
        
        // Extract form fields
        const { name, email, tel, company, message, form_timestamp, csrf_token, timestamp } = formData;
        console.log(name, email, message, form_timestamp);
        
        // 1. Check for honeypot (timestamp)
        if (timestamp) {
            return c.json({ success: false, message: genericErrorMessage }, 500);
        }

        // 2. Basic validation
        if (!name || !email || !message || !form_timestamp || !csrf_token) {
            return c.json({ success: false, message: 'Missing required fields' }, 400);
        }        
        
        // 3. Timestamp Check
        const receivedTimestamp = parseInt(form_timestamp, 10);

        if (isNaN(receivedTimestamp)) {
            console.warn('Security Fail: Invalid timestamp format.');
            return c.json({ success: false, message: genericErrorMessage }, 500);
        }

        const requestTimestamp = parseInt(x_csrf_token.split('-').splice(-1)[0], 10);
        if (
            ((Date.now() - receivedTimestamp) > MAX_TIMESTAMP_AGE_MS) || 
            (Date.now() - requestTimestamp > MAX_TIMESTAMP_AGE_MS)){
            console.warn(`Security Fail: Timestamp too old.`);
            return c.json({ success: false, message: 'Submission expired. Please refresh and try again.' }, 403);
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return c.json({ success: false, message: 'Invalid email format' }, 400);
        }
        

        // Implement email sending
        if (transporter) {
            try {
                const mailOptions = {
                    from: `"ECOSIUM EVENT" <${EMAIL_CONTACT}>`, // Sender address
                    to: `${email},${EMAIL_CONTACT}`, // List of recipients
                    replyTo: `${EMAIL_CONTACT}`, // Set reply-to as the form submitter's email
                    subject: `Request from ${name}`,
                    html: `
                        <h2>Request form Submission</h2>
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        ${tel ? `<p><strong>Phone:</strong> ${tel}</p>` : ''}
                        ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
                        <p><strong>Message:</strong></p>
                        <p>${message.replace(/\n/g, '<br>')}</p>
                        <hr>
                        <p><small>Submitted on: ${new Date().toLocaleString()}</small></p>
                    `
                };
                
                const info = await transporter.sendMail(mailOptions);
                //console.log('Contact form submission:', { name, email, message });
                //console.log('Email sent: %s', info.messageId);
                //console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                return c.json({ 
                    success: true, 
                    message: `Thank you ${name} for your message! We will get back to you soon.`
                    //message: `Thank you ${name} for your message! Email sent to: ${email}. We will get back to you soon.`
                });

            } catch (emailError) {
                //console.error('Error sending email:', emailError);
                return c.json({ 
                    success: false, 
                    message: `Error sending email: ${emailError}`
                });
            }
        }
    } catch (error) {
        console.error('Error processing contact form:', error);
        return c.json({ success: false, message: genericErrorMessage }, 500);
    }
});

serve(app, (info) => {
  console.log(`Listening on http://localhost:${info.port}`) // Listening on http://localhost:3000
})