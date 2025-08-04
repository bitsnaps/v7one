const { serve } = require('@hono/node-server');
const { Hono } = require('hono');
const { serveStatic } = require('@hono/node-server/serve-static');
const { cors } = require('hono/cors');
const { rateLimiter } = require('./honoRateLimiter');
const admin = require('./admin');
const user = require('./user');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const models = require('./models');
const { Sequelize, Op } = require('sequelize');
const path = require('path');
const fs = require('node:fs');
const { hashPassword, verifyPassword, isValidUUID } = require('./utils');

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
        //console.log('Email test account created');
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

const app = new Hono();

// Add CORS middleware (for Dev)
app.use('/*', cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'https://v7one.com'],
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
  // This means the browser will expose these headers when it makes requests to your API
  credentials: true
}));

// Anything comes from static folder will be served from "/"
// Serve static files from the 'public' directory
app.use('/*', serveStatic({ root: './public' }));

// Apply the rate limiting middleware to all requests.
app.use(
    rateLimiter({
      // Increase limit on dev mode
    windowMs: process.env.NODE_ENV === 'production' ? 15 * 60 * 1000 : 600 * 1000, // 15 minutes on prod, 10 minute on dev
    limit: 100, // Limit each IP to 100 requests per `windowMs` (here, per 15 minutes on prod, 10 minute on dev).
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

// In-memory offer store (for demonstration purposes)
const offers = [];

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

// Endpoint to drop all tables (in case needed to re-start from scratch)
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
    await models.sequelize.drop({
      cascade: true
    });

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
      displayName: username.split('@')[0],
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
      '20250603153313-initial-deals.js', // Deals depend on users and categories
      '20250603153314-initial-attributes.js', // Attributes depend on categories
      '20250608120000-initial-listing-attribute-values.js', // Attribute values depend on listings and attributes
    ];
  
    try {
      for (const seederFile of orderedSeederFiles) {
        const seederPath = path.join(seedersDir, seederFile);
        if (fs.existsSync(seederPath)) {
          const seeder = require(seederPath);
          if (seeder && typeof seeder.up === 'function') {
            // console.log(`Running seeder: ${seederFile}`);
            await seeder.up(queryInterface, Sequelize);
            results.push({ seeder: seederFile, status: 'success' });
            // console.log(`Successfully ran seeder: ${seederFile}`);
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

app.post('/api/signup', async (c) => {
    try {
        const { email, password, displayName } = await c.req.json();

        if (!email || !password) {
            return c.json({ success: false, message: 'Email and password are required' }, 400);
        }

        const existingUser = await models.User.findOne({ where: { email } });
        if (existingUser) {
            return c.json({ success: false, message: 'User already exists' }, 409);
        }

        const newUser = await models.User.create({
            email,
            passwordHash: hashPassword(password),
            displayName: displayName || email.split('@')[0],
            isAdmin: false,
            isVerified: false
        });
        // console.log('User signed up:', email);
        return c.json({ success: true, message: 'Signup successful', userId: newUser.id });
    } catch (error) {
        console.error('Signup error:', error);
        return c.json({ success: false, message: 'An error occurred during signup' }, 500);
        // return c.json({ success: false, message: error.message }, 500);
    }
});

app.post('/api/login', async (c) => {
  try {
      const { email, password } = await c.req.json();

      if (!email || !password) {
          return c.json({ success: false, message: 'Email and password are required' }, 400);
      }

      const user = await models.User.findOne({ where: { email } });

      if (!user) {
          return c.json({ success: false, message: 'Invalid username or password' }, 401);
      }

      if (!verifyPassword(password, user.passwordHash)) {
          return c.json({ success: false, message: 'Invalid username or password' }, 401);
      }

      if (!user.isAdmin){
        // Check if the user's email is verified
        if (!user.isVerified) {
          return c.json({ success: false, message: 'Please verify your email before logging in.', errorCode: 'EMAIL_NOT_VERIFIED' }, 403);
        }
      }

      // Generate JWT
      const token = jwt.sign({ id: user.id, email: user.email, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });
      
      // console.log('User logged in:', email);
      return c.json({
        success: true,
        message: 'Login successful',
        token: token,
        user: {
            id: user.id,
            displayName: user.displayName,
            email: user.email,
            isVerified: user.isVerified,
            isAdmin: user.isAdmin,
            isActive: user.isActive
        }
    });
  } catch (error) {
      console.error('Login error:', error);
      return c.json({ success: false, message: 'An error occurred during login' }, 500);
  }
});

app.post('/api/upload', async (c) => {
  try {
    const body = await c.req.parseBody();
    const file = body['file'];

    if (!file) {
      return c.json({ error: 'No file uploaded' }, 400);
    }
    const uploadsDir = process.env.UPLOADS_DIR;
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadsDir, fileName);

    const fileBuffer = await file.arrayBuffer();
    await fs.promises.writeFile(filePath, Buffer.from(fileBuffer));
    
    const baseUrl = process.env.UPLOADS_URL_PATH || 'uploads';
    const fileUrl = `${process.env.UPLOADS_URL_PATH}/${fileName}`;

    let mediaType = 'IMAGE';
    if (file.type.startsWith('video')) {
      mediaType = 'VIDEO_URL';
    }

    return c.json({ success: true, url: fileUrl, type: mediaType });
  } catch (error) {
    console.error('File upload error:', error);
    return c.json({ error: 'Failed to upload file', details: error.message }, 500);
  }
});

// API endpoint for a single deal by ID
app.route('/api/admin', admin);
app.route('/api/user', user);

app.get('/api/deal/:id', async (c) => {
    try {
        const dealId = c.req.param('id');
        if (!isValidUUID(dealId)) {
            return c.json({ success: false, message: 'Invalid query' }, 400);
        }
        const deal = await models.Listing.findByPk(dealId, {
            include: [
                { model: models.User, as: 'seller', attributes: ['id', 'email'] },
                {
                    model: models.Category,
                    as: 'category',
                    attributes: ['id', 'name', 'slug'],
                    include: [{ model: models.Attribute, as: 'attributes' }]
                },
                {
                    model: models.ListingAttributeValue,
                    as: 'attributeValues',
                    include: [{ model: models.Attribute, as: 'attribute' }]
                }
            ]
        });

        if (deal) {
            const attributes = {};
            if (deal.category && deal.category.attributes) {
                deal.category.attributes.forEach(attrDef => {
                    const savedValue = deal.attributeValues.find(val => val.attributeId === attrDef.id);
                    attributes[attrDef.name.toLowerCase()] = savedValue ? savedValue.value : 'N/A';
                });
            }

            const formattedDeal = {
                id: deal.id,
                title: deal.title,
                image: deal.imageUrl,
                price: deal.price,
                status: deal.status,
                type: deal.listType,
                location: `${deal.locationRegion}, ${deal.locationCity}`,
                category: deal.category ? [deal.category.name.toLowerCase()] : [],
                categoryType: deal.category ? deal.category.type : null,
                description: deal.description,
                attributes: attributes,
                seller: deal.seller,
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

app.get('/api/deal/:id/messages', async (c) => {
    try {
        const dealId = c.req.param('id');
        if (!isValidUUID(dealId)) {
            return c.json({ success: false, message: 'Invalid query' }, 400);
        }

        const conversations = await models.Conversation.findAll({
            where: { listingId: dealId },
            include: [
                { model: models.Message, as: 'messages', include: [{ model: models.User, as: 'sender' }] },
                { model: models.User, as: 'userOne' },
                { model: models.User, as: 'userTwo' }
            ]
        });

        return c.json({ success: true, conversations });
    } catch (error) {
        console.error('Error fetching deal messages:', error);
        return c.json({ success: false, message: 'An error occurred', error: error.message }, 500);
    }
});
app.post('/api/messages', async (c) => {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return c.json({ error: 'Unauthorized: Missing or invalid token' }, 401);
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const senderId = decoded.id;

        const { dealId, content, receiverId } = await c.req.json();

        if (!dealId || !content || !receiverId) {
            return c.json({ success: false, message: 'Missing required fields' }, 400);
        }

        const listing = await models.Listing.findByPk(dealId);
        if (!listing) {
            return c.json({ success: false, message: 'Deal not found' }, 404);
        }

        let conversation = await models.Conversation.findOne({
            where: {
                listingId: dealId,
                [Op.or]: [
                    { userOneId: senderId, userTwoId: receiverId },
                    { userOneId: receiverId, userTwoId: senderId }
                ]
            }
        });

        if (!conversation) {
            conversation = await models.Conversation.create({
                listingId: dealId,
                userOneId: senderId,
                userTwoId: receiverId
            });
        }

        const message = await models.Message.create({
            conversationId: conversation.id,
            senderId: senderId,
            content: content
        });

        return c.json({ success: true, message: 'Message sent successfully', data: message });
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return c.json({ error: 'Unauthorized: Invalid token' }, 401);
        }
        console.error('Error sending message:', error);
        return c.json({ success: false, message: 'An error occurred', error: error.message }, 500);
    }
});

// API endpoint for all deals with optional category filter, pagination, and search
app.get('/api/deals/:type?', async (c) => {
    try {
        const page = parseInt(c.req.query('page')) || 1;
        const limit = parseInt(c.req.query('limit')) || 10; 
        const offset = (page - 1) * limit;

        const type = c.req.param('type');
        const category = c.req.query('category'); // Deals category
        const statusQuery = c.req.query('status');
        const locationQuery = c.req.query('location');
        const searchQuery = c.req.query('search') || c.req.query('keyword');

        const whereClause = {};
        const includeClause = [
            { model: models.User, as: 'seller', attributes: ['id', 'email'] }, 
            {
                model: models.Category,
                as: 'category',
                attributes: ['id', 'name', 'slug', 'type'],
                include: [{ model: models.Attribute, as: 'attributes' }]
            },
            {
              model: models.ListingAttributeValue,
              as: 'attributeValues',
              include: [{ model: models.Attribute, as: 'attribute' }]
            }
        ];

        if (type) {
            let categoryInclude = includeClause.find(inc => inc.as === 'category');
            if (type === 'all') {
                if (categoryInclude) {
                    categoryInclude.where = { type: { [Op.not]: null } };
                }
            } else {
                if (categoryInclude) {
                    categoryInclude.where = { type: type };
                } else {
                    includeClause.push({ model: models.Category, as: 'category', where: { type: type } });
                }
            }
        }

        if (category) {
            let categoryInclude = includeClause.find(inc => inc.as === 'category');
            if (categoryInclude) {
                // If a where clause already exists (from categoryType), add to it
                if (categoryInclude.where) {
                    categoryInclude.where.slug = category;
                } else {
                    categoryInclude.where = { slug: category };
                }
            } else {
                includeClause.push({ model: models.Category, as: 'category', where: { slug: category } });
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
        });

        const formattedDeals = rows.map(deal => {
            const attributes = {};
            if (deal.category && deal.category.attributes) {
                deal.category.attributes.forEach(attrDef => {
                    const savedValue = deal.attributeValues.find(val => val.attributeId === attrDef.id);
                    attributes[attrDef.name.toLowerCase()] = savedValue ? savedValue.value : 'N/A';
                });
            }

            return {
                id: deal.id,
                title: deal.title,
                image: deal.imageUrl,
                price: deal.price,
                status: deal.status,
                type: deal.listType,
                location: `${deal.locationRegion}, ${deal.locationCity}`,
                isFeatured: deal.isFeatured,
                category: deal.category ? [deal.category.name.toLowerCase()] : [],
                categoryType: deal.category ? deal.category.type: null,
                description: deal.description,
                attributes: attributes
            };
        });

        return c.json({
            success: true,
            data: formattedDeals,
            total: count,
            page: page,
            limit: limit,
            totalPages: Math.ceil(count / limit),
        });
    } catch (error) {
        console.error('Error fetching deals:', error);
        return c.json({ success: false, message: 'An error occurred while fetching deals', error: error.message }, 500);
    }
  });
  
  app.delete('/api/deals/:id', async (c) => {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized: Missing or invalid token' }, 401);
    }
  
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
      const { id } = c.req.param();
  
      const listing = await models.Listing.findOne({ where: { id, userId } });
  
      if (!listing) {
        return c.json({ error: 'Listing not found or you do not have permission to delete it.' }, 404);
      }
  
      listing.status = 'REMOVED_BY_USER';
      await listing.save();
  
      return c.json({ success: true, message: 'Listing removed successfully.' });
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return c.json({ error: 'Unauthorized: Invalid token' }, 401);
      }
      return c.json({ error: 'Failed to remove listing', details: error.message }, 500);
    }
  });
  
  app.post('/api/deals', async (c) => {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized: Missing or invalid token' }, 401);
    }
  
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
  
      const dealData = await c.req.json();
      dealData.userId = userId;
      // 
      const user = await models.User.findByPk(userId);
      dealData.status = 'PENDING';
      if (user && user.isAdmin){
        dealData.status = 'ACTIVE';
      }
  
      const newDeal = await models.Listing.create(dealData);
      return c.json({ success: true, deal: newDeal });
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return c.json({ error: 'Unauthorized: Invalid token' }, 401);
      }
      return c.json({ error: 'Failed to create deal', details: error.message }, 500);
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
// API endpoint for pricing plans
app.get('/api/pricing-plans', async (c) => {
  try {
    const plans = await models.PricingPlan.findAll({
      where: { isActive: true },
      attributes: ['id', 'name', 'price', 'pricePercentage', 'description', 'features', 'sponsoredAdType']
    });
    return c.json({ success: true, data: plans });
  } catch (error) {
    console.error('Error fetching pricing plans:', error);
    return c.json({ success: false, message: 'An error occurred while fetching pricing plans' }, 500);
  }
});

// API endpoint for user to subscribe to a plan
app.post('/api/subscribe', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized: Missing or invalid token' }, 401);
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const { planId } = await c.req.json();

    if (!isValidUUID(planId)) {
      return c.json({ success: false, message: 'Invalid plan ID' }, 400);
    }

    const plan = await models.PricingPlan.findByPk(planId);
    if (!plan) {
      return c.json({ success: false, message: 'Pricing plan not found' }, 404);
    }

    const existingSubscription = await models.UserSubscription.findOne({
      where: { userId, status: 'ACTIVE' }
    });

    if (existingSubscription) {
      return c.json({ success: false, message: 'You already have an active subscription.' }, 409);
    }
    
    const subscription = await models.UserSubscription.create({
      userId,
      pricingPlanId: planId,
      status: 'ACTIVE',
    });

    const admins = await models.User.findAll({ where: { isAdmin: true } });
    for (const admin of admins) {
      await models.Notification.create({
        userId: admin.id,
        type: 'NEW_SUBSCRIPTION',
        message: `User ${decoded.email} has subscribed to the ${plan.name} plan.`,
      });
    }

    return c.json({ success: true, message: 'Successfully subscribed to the plan', data: subscription });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return c.json({ error: 'Unauthorized: Invalid token' }, 401);
    }
    console.error('Subscription error:', error);
    return c.json({ success: false, message: 'An error occurred during subscription' }, 500);
  }
});

app.get('/api/user/subscription', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized: Missing or invalid token' }, 401);
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const subscription = await models.UserSubscription.findOne({
      where: { userId, status: 'ACTIVE' },
      include: [{
        model: models.PricingPlan,
        attributes: ['id', 'name', 'maxPhotosN', 'additionalPhotosM']
      }]
    });

    if (!subscription) {
      return c.json({ success: true, data: null, message: 'No active subscription found.' });
    }

    return c.json({ success: true, data: subscription.PricingPlan });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return c.json({ error: 'Unauthorized: Invalid token' }, 401);
    }
    console.error('Error fetching user subscription:', error);
    return c.json({ success: false, message: 'An error occurred while fetching subscription details.' }, 500);
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
        // console.log('New offer created:', newOffer);
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
        // console.log(formData);
        
        // Extract form fields
        const { name, email, tel, company, message, form_timestamp, csrf_token, timestamp } = formData;
        // console.log(name, email, message, form_timestamp);
        
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
  // console.log(`Listening on http://localhost:${info.port}`) // Listening on http://localhost:3000
})