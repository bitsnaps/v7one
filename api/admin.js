const { Hono } = require('hono');
const models = require('./models');
const jwt = require('jsonwebtoken');

const admin = new Hono();

// Middleware for authenticating admin users
admin.use('/*', async (c, next) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized: Missing or invalid token' }, 401);
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) {
      return c.json({ error: 'Forbidden: Requires admin privileges' }, 403);
    }
    c.set('user', decoded); // Pass user info to subsequent handlers
    await next();
  } catch (error) {
    return c.json({ error: 'Unauthorized: Invalid token' }, 401);
  }
});

admin.get('/', (c) => {
  return c.text('Admin Section');
});

// User Management Routes
// User Management Routes
admin.get('/users', async (c) => {
  const { page = 1, limit = 10, status, role, search } = c.req.query();
  const offset = (page - 1) * limit;

  const whereClause = {};
  if (status) whereClause.isActive = status === 'active';
  if (role) whereClause.isAdmin = role === 'admin';
  if (search) {
    whereClause[models.Sequelize.Op.or] = [
      { email: { [models.Sequelize.Op.iLike]: `%${search}%` } },
      { displayName: { [models.Sequelize.Op.iLike]: `%${search}%` } },
    ];
  }

  try {
    const { count, rows } = await models.User.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      attributes: { exclude: ['passwordHash'] }, // Exclude password hash from the response
      order: [['createdAt', 'DESC']],
    });

    return c.json({
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      users: rows,
    });
  } catch (error) {
    return c.json({ error: 'Failed to fetch users', details: error.message }, 500);
  }
});

// Get a single user by ID
admin.get('/users/:id', async (c) => {
  const { id } = c.req.param();
  try {
    const user = await models.User.findByPk(id, {
      attributes: { exclude: ['passwordHash'] },
    });
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }
    return c.json(user);
  } catch (error) {
    return c.json({ error: 'Failed to fetch user', details: error.message }, 500);
  }
});

// Update user details
admin.put('/users/:id', async (c) => {
  const { id } = c.req.param();
  const { email, displayName, isAdmin, isActive } = await c.req.json();

  try {
    const user = await models.User.findByPk(id);
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    // Update fields
    user.email = email ?? user.email;
    user.displayName = displayName ?? user.displayName;
    user.isAdmin = isAdmin ?? user.isAdmin;
    user.isActive = isActive ?? user.isActive;

    await user.save();

    const { passwordHash, ...userResponse } = user.get();
    return c.json(userResponse);
  } catch (error) {
    return c.json({ error: 'Failed to update user', details: error.message }, 500);
  }
});

// Update user status (activate/deactivate)
admin.patch('/users/:id/status', async (c) => {
  const { id } = c.req.param();
  const { isActive } = await c.req.json();

  if (typeof isActive !== 'boolean') {
    return c.json({ error: 'Invalid status value' }, 400);
  }

  try {
    const user = await models.User.findByPk(id);
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    user.isActive = isActive;
    await user.save();

    return c.json({ success: true, message: `User status updated to ${isActive ? 'active' : 'inactive'}` });
  } catch (error) {
    return c.json({ error: 'Failed to update user status', details: error.message }, 500);
  }
});

// Delete a user
admin.delete('/users/:id', async (c) => {
  const { id } = c.req.param();
  try {
    const user = await models.User.findByPk(id);
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    await user.destroy(); // This performs a hard delete

    return c.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    return c.json({ error: 'Failed to delete user', details: error.message }, 500);
  }
});

// Category Management Routes

// Get all categories with sub-categories
admin.get('/categories', async (c) => {
  try {
    const categories = await models.Category.findAll({
      order: [['name', 'ASC']],
    });

    const buildHierarchy = (items) => {
      const itemMap = {};
      const tree = [];

      items.forEach(item => {
        itemMap[item.id] = { ...item.get({ plain: true }), children: [] };
      });

      items.forEach(item => {
        if (item.parentId && itemMap[item.parentId]) {
          itemMap[item.parentId].children.push(itemMap[item.id]);
        } else {
          tree.push(itemMap[item.id]);
        }
      });

      return tree;
    };

    const hierarchicalCategories = buildHierarchy(categories);
    return c.json(hierarchicalCategories);
  } catch (error) {
    return c.json({ error: 'Failed to fetch categories', details: error.message }, 500);
  }
});

// Create a new category
admin.post('/categories', async (c) => {
  const { name, slug, type, parentId } = await c.req.json();
  try {
    const category = await models.Category.create({ name, slug, type, parentId });
    return c.json(category, 201);
  } catch (error) {
    return c.json({ error: 'Failed to create category', details: error.message }, 500);
  }
});

// Update a category
admin.put('/categories/:id', async (c) => {
  const { id } = c.req.param();
  const { name, slug, type, parentId } = await c.req.json();
  try {
    const category = await models.Category.findByPk(id);
    if (!category) {
      return c.json({ error: 'Category not found' }, 404);
    }
    await category.update({ name, slug, type, parentId });
    return c.json(category);
  } catch (error) {
    return c.json({ error: 'Failed to update category', details: error.message }, 500);
  }
});

// Delete a category
admin.delete('/categories/:id', async (c) => {
  const { id } = c.req.param();
  try {
    const category = await models.Category.findByPk(id);
    if (!category) {
      return c.json({ error: 'Category not found' }, 404);
    }
    await category.destroy();
    return c.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    return c.json({ error: 'Failed to delete category', details: error.message }, 500);
  }
});

// Listing Management Routes

// Get all listings with filtering and pagination
admin.get('/listings', async (c) => {
  const { page = 1, limit = 10, status, search } = c.req.query();
  const offset = (page - 1) * limit;

  const whereClause = {};
  if (status) {
    whereClause.status = status;
  }
  if (search) {
    whereClause.title = { [models.Sequelize.Op.iLike]: `%${search}%` };
  }

  try {
    const { count, rows } = await models.Listing.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        { model: models.User, as: 'seller', attributes: ['id', 'displayName'] },
        { model: models.Category, as: 'category', attributes: ['id', 'name'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    return c.json({
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      listings: rows,
    });
  } catch (error) {
    return c.json({ error: 'Failed to fetch listings', details: error.message }, 500);
  }
});

// Get a single listing by ID
admin.get('/listings/:id', async (c) => {
  const { id } = c.req.param();
  try {
    const listing = await models.Listing.findByPk(id, {
      include: [
        { model: models.User, attributes: ['id', 'displayName', 'email'] },
        { model: models.Category, as: 'category' },
      ],
    });
    if (!listing) {
      return c.json({ error: 'Listing not found' }, 404);
    }
    return c.json(listing);
  } catch (error) {
    return c.json({ error: 'Failed to fetch listing', details: error.message }, 500);
  }
});

// Create a new listing
admin.post('/listings', async (c) => {
  const data = await c.req.json();
  // Ensure the seller is assigned, either from the request or the logged-in admin
  if (!data.userId) {
    data.userId = c.get('user').id;
  }
  try {
    const listing = await models.Listing.create(data);
    return c.json(listing, 201);
  } catch (error) {
    return c.json({ error: 'Failed to create listing', details: error.message }, 500);
  }
});

// Update a listing
admin.put('/listings/:id', async (c) => {
  const { id } = c.req.param();
  const data = await c.req.json();

  try {
    const listing = await models.Listing.findByPk(id);
    if (!listing) {
      return c.json({ error: 'Listing not found' }, 404);
    }

    await listing.update(data);
    return c.json(listing);
  } catch (error) {
    return c.json({ error: 'Failed to update listing', details: error.message }, 500);
  }
});

// Update listing status (e.g., approve, reject, expire)
admin.patch('/listings/:id/status', async (c) => {
  const { id } = c.req.param();
  const { status } = await c.req.json();

  if (!['ACTIVE', 'PENDING', 'SOLD', 'EXPIRED', 'REMOVED_BY_ADMIN', 'DRAFT'].includes(status)) {
    return c.json({ error: 'Invalid status value' }, 400);
  }

  try {
    const listing = await models.Listing.findByPk(id);
    if (!listing) {
      return c.json({ error: 'Listing not found' }, 404);
    }

    listing.status = status;
    await listing.save();

    return c.json({ success: true, message: `Listing status updated to ${status}` });
  } catch (error) {
    return c.json({ error: 'Failed to update listing status', details: error.message }, 500);
  }
});

// Delete a listing
admin.delete('/listings/:id', async (c) => {
  const { id } = c.req.param();
  try {
    const listing = await models.Listing.findByPk(id);
    if (!listing) {
      return c.json({ error: 'Listing not found' }, 404);
    }

    await listing.destroy();
    return c.json({ success: true, message: 'Listing deleted successfully' });
  } catch (error) {
    return c.json({ error: 'Failed to delete listing', details: error.message }, 500);
  }
});

// Dashboard / Analytics Routes

// Get dashboard statistics
admin.get('/dashboard/stats', async (c) => {
  try {
    const [userCount, listingCount, categoryCount, pendingListings] = await Promise.all([
      models.User.count(),
      models.Listing.count(),
      models.Category.count({ where: { parentId: null } }), // Count only top-level categories
      models.Listing.count({ where: { status: 'PENDING' } }),
    ]);

    return c.json({
      totalUsers: userCount,
      totalListings: listingCount,
      totalCategories: categoryCount,
      pendingListings: pendingListings,
    });
  } catch (error) {
    return c.json({ error: 'Failed to fetch dashboard stats', details: error.message }, 500);
  }
});

// Get recent listings for dashboard
admin.get('/dashboard/recent-listings', async (c) => {
  try {
    const listings = await models.Listing.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [
        { model: models.User, as: 'seller', attributes: ['displayName'] },
        { model: models.Category, as: 'category', attributes: ['name'] },
      ],
    });

    const formattedListings = listings.map(listing => ({
      id: listing.id,
      title: listing.title,
      category: listing.Category ? listing.Category.name : 'N/A',
      user: listing.User ? listing.User.displayName : 'N/A',
      status: listing.status,
      date: listing.createdAt.toISOString().split('T')[0],
    }));

    return c.json(formattedListings);
  } catch (error) {
    return c.json({ error: 'Failed to fetch recent listings', details: error.message }, 500);
  }
});

// Get recent users for dashboard
admin.get('/dashboard/recent-users', async (c) => {
  try {
    const users = await models.User.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'displayName', 'email'],
    });

    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.displayName,
      email: user.email,
    }));

    return c.json(formattedUsers);
  } catch (error) {
    return c.json({ error: 'Failed to fetch recent users', details: error.message }, 500);
  }
});


// Message Management Routes

// Get all conversations
admin.get('/messages', async (c) => {
  try {
    const conversations = await models.Conversation.findAll({
      include: [
        { model: models.User, as: 'userOne', attributes: ['displayName'] },
        { model: models.User, as: 'userTwo', attributes: ['displayName'] },
        { model: models.Listing, attributes: ['title'] },
      ],
      order: [['lastMessageAt', 'DESC']],
    });
    return c.json(conversations);
  } catch (error) {
    return c.json({ error: 'Failed to fetch conversations', details: error.message }, 500);
  }
});

// Get a single conversation with its messages
admin.get('/messages/:id', async (c) => {
  const { id } = c.req.param();
  try {
    const conversation = await models.Conversation.findByPk(id, {
      include: [
        {
          model: models.Message,
          as: 'messages',
          include: [{ model: models.User, as: 'sender', attributes: ['displayName'] }],
        },
      ],
      order: [[{ model: models.Message, as: 'messages' }, 'createdAt', 'ASC']],
    });
    if (!conversation) {
      return c.json({ error: 'Conversation not found' }, 404);
    }
    return c.json(conversation);
  } catch (error) {
    return c.json({ error: 'Failed to fetch conversation', details: error.message }, 500);
  }
});

// Delete a conversation and its messages
admin.delete('/messages/:id', async (c) => {
  const { id } = c.req.param();
  try {
    const conversation = await models.Conversation.findByPk(id);
    if (!conversation) {
      return c.json({ error: 'Conversation not found' }, 404);
    }
    await conversation.destroy(); // This will also delete associated messages due to onDelete: 'CASCADE'
    return c.json({ success: true, message: 'Conversation deleted successfully' });
  } catch (error) {
    return c.json({ error: 'Failed to delete conversation', details: error.message }, 500);
  }
});

// Admin reply to a conversation
admin.post('/messages/:id/reply', async (c) => {
  const { id } = c.req.param();
  const { content } = await c.req.json();
  const adminUserId = c.get('user').id;

  if (!content) {
    return c.json({ error: 'Message content cannot be empty' }, 400);
  }

  try {
    const conversation = await models.Conversation.findByPk(id);
    if (!conversation) {
      return c.json({ error: 'Conversation not found' }, 404);
    }

    const message = await models.Message.create({
      content,
      conversationId: id,
      senderId: adminUserId,
      isRead: true, // Messages from admin are read by default
    });

    // Update the last message timestamp
    conversation.lastMessageAt = new Date();
    await conversation.save();

    return c.json(message, 201);
  } catch (error) {
    return c.json({ error: 'Failed to send message', details: error.message }, 500);
  }
});

// Create a new conversation
admin.post('/messages', async (c) => {
  const { userOneId, userTwoId, listingId, content } = await c.req.json();
  const adminUserId = c.get('user').id;

  if (!content || !userOneId || !userTwoId) {
    return c.json({ error: 'Missing required fields: content, userOneId, userTwoId' }, 400);
  }

  try {
    const conversation = await models.Conversation.create({
      userOneId,
      userTwoId,
      listingId,
      lastMessageAt: new Date(),
    });

    const message = await models.Message.create({
      content,
      conversationId: conversation.id,
      senderId: adminUserId,
      isRead: true,
    });

    return c.json({ conversation, message }, 201);
  } catch (error) {
    return c.json({ error: 'Failed to create conversation', details: error.message }, 500);
  }
});

module.exports = admin;