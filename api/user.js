const { Hono, verify } = require('hono');
const { sequelize } = require('./models');
const { User, Listing, Category, ListingAttributeValue, Conversation, Message, Notification } = require('./models');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const { hashPassword } = require('./utils/index');
const fs = require('fs').promises;
const path = require('path');

const user = new Hono();


// Middleware for authenticating admin users
user.use('/*', async (c, next) => {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized: Missing or invalid token' }, 401);
    }
  
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.id);
      if (!user) {
        return c.json({ error: 'Unauthorized: User not found' }, 401);
      }
      c.set('user', user); // Pass user info to subsequent handlers
      await next();
    } catch (error) {
      return c.json({ error: 'Unauthorized: Invalid token' }, 401);
    }
  });

user.get('/dashboard/stats', async (c) => {
  const user = c.get('user');
  const totalDeals = await Listing.count({ where: { userId: user.id } });
  const pendingDeals = await Listing.count({ where: { userId: user.id, status: 'PENDING' } });

  return c.json({ totalDeals, pendingDeals });
});

user.get('/dashboard/recent-deals', async (c) => {
    const user = c.get('user');
    const recentDeals = await Listing.findAll({
        where: { userId: user.id },
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [{ model: Category, as: 'category', attributes: ['name'] }]
    });

    const formattedDeals = recentDeals.map(deal => ({
        id: deal.id,
        title: deal.title,
        category: deal.category.name,
        status: deal.status,
        date: deal.createdAt.toISOString().split('T')[0]
    }));

    return c.json(formattedDeals);
});


// Get all categories with sub-categories
user.get('/categories', async (c) => {
  try {
    const categories = await Category.findAll({
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

user.get('/listings', async (c) => {
    const user = c.get('user');
    const page = parseInt(c.req.query('page')) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    const search = c.req.query('search') || '';

    const where = { userId: user.id };
    if (search) {
        where.title = { [Op.iLike]: `%${search}%` };
    }

    const { count, rows } = await Listing.findAndCountAll({
        where,
        limit,
        offset,
        order: [['createdAt', 'DESC']],
        include: [{ model: Category, as: 'category', attributes: ['name'] }]
    });

    return c.json({
        listings: rows,
        currentPage: page,
        pages: Math.ceil(count / limit)
    });
});

user.post('/listings', async (c) => {
    const user = c.get('user');
    const body = await c.req.json();

    // Exclude id from body to prevent DB error, and any other sensitive fields.
    const { id, userId, createdAt, updatedAt, ...listingData } = body;

    const t = await sequelize.transaction();

    try {
        const newListing = await Listing.create({
            ...listingData,
            userId: user.id
        }, { transaction: t });

        if (body.attributes && Array.isArray(body.attributes)) {
            const attributeValues = body.attributes.map(attr => ({
                listingId: newListing.id,
                attributeId: attr.attribute ? attr.attribute.id : attr.attributeId,
                value: attr.value
            }));
            await ListingAttributeValue.bulkCreate(attributeValues, { transaction: t });
        }

        await t.commit();

        const result = await Listing.findByPk(newListing.id, {
            include: ['category', 'attributeValues']
        });

        return c.json(result, 201);
    } catch (error) {
        await t.rollback();
        console.error('Failed to create listing:', error);
        return c.json({ error: 'Failed to create listing', details: error.message }, 500);
    }
});

user.put('/listings/:id', async (c) => {
    const { id } = c.req.param();
    const body = await c.req.json();

    // Ensure user cannot change ownership or other protected fields
    const { createdAt, updatedAt, ...updateData } = body;
    
    const t = await sequelize.transaction();

    try {
        const listing = await Listing.findOne({ where: { id } });

        if (!listing) {
            return c.json({ error: 'Listing not found' }, 404);
        }

        await listing.update(updateData, { transaction: t });

        if (body.attributes && Array.isArray(body.attributes)) {
            await ListingAttributeValue.destroy({ where: { listingId: id }, transaction: t });
            
            const attributeValues = body.attributes.map(attr => ({
                listingId: id,
                attributeId: attr.attribute ? attr.attribute.id : attr.attributeId,
                value: attr.value
            }));
            await ListingAttributeValue.bulkCreate(attributeValues, { transaction: t });
        }

        await t.commit();
        
        const result = await Listing.findByPk(id, {
            include: ['category', 'attributeValues']
        });

        return c.json(result);
    } catch (error) {
        await t.rollback();
        console.error('Failed to update listing:', error);
        return c.json({ error: 'Failed to update listing', details: error.message }, 500);
    }
});

user.delete('/listings/:id', async (c) => {
    const user = c.get('user');
    const { id } = c.req.param();

    const t = await sequelize.transaction();

    try {
        const listing = await Listing.findOne({ where: { id, userId: user.id } });

        if (!listing) {
            return c.json({ error: 'Listing not found' }, 404);
        }

        await listing.destroy({ transaction: t });

        await t.commit();

        return c.json({ message: 'Listing deleted successfully' });
    } catch (error) {
        await t.rollback();
        console.error('Failed to delete listing:', error);
        return c.json({ error: 'Failed to delete listing', details: error.message }, 500);
    }
});

user.get('/conversations', async (c) => {
    const user = c.get('user');
    try {
        const conversations = await Conversation.findAll({
            where: {
                [Op.or]: [{ userOneId: user.id }, { userTwoId: user.id }]
            },
            include: [
                { model: Listing, as: 'listing', attributes: ['id', 'title'] },
                { model: User, as: 'userOne', attributes: ['id', 'displayName', 'email'] },
                { model: User, as: 'userTwo', attributes: ['id', 'displayName', 'email'] }
            ],
            order: [['updatedAt', 'DESC']]
        });

        const formattedConversations = conversations.map(convo => {
            const participant = convo.userOneId === user.id ? convo.userTwo : convo.userOne;
            return {
                id: convo.id,
                listing: convo.listing,
                participant: {
                    id: participant.id,
                    displayName: participant.displayName,
                    email: participant.email
                },
                lastMessageAt: convo.updatedAt
            };
        });

        return c.json(formattedConversations);
    } catch (error) {
        console.error('Failed to fetch conversations:', error);
        return c.json({ error: 'Failed to fetch conversations', details: error.message }, 500);
    }
});

user.get('/conversations/:id', async (c) => {
    const user = c.get('user');
    const { id } = c.req.param();
    try {
        const conversation = await Conversation.findOne({
            where: {
                id,
                [Op.or]: [{ userOneId: user.id }, { userTwoId: user.id }]
            },
            include: [
                {
                    model: Message,
                    as: 'messages',
                    include: [{ model: User, as: 'sender', attributes: ['id', 'displayName', 'email'] }]
                }
            ],
            order: [[{ model: Message, as: 'messages' }, 'createdAt', 'ASC']]
        });

        if (!conversation) {
            return c.json({ error: 'Conversation not found' }, 404);
        }

        return c.json(conversation);
    } catch (error) {
        console.error('Failed to fetch conversation details:', error);
        return c.json({ error: 'Failed to fetch conversation details', details: error.message }, 500);
    }
});

user.post('/conversations/:id/reply', async (c) => {
    const user = c.get('user');
    const { id } = c.req.param();
    const { content } = await c.req.json();

    try {
        const conversation = await Conversation.findOne({
            where: {
                id,
                [Op.or]: [{ userOneId: user.id }, { userTwoId: user.id }]
            }
        });

        if (!conversation) {
            return c.json({ error: 'Conversation not found' }, 404);
        }

        const message = await Message.create({
            conversationId: id,
            senderId: user.id,
            content
        });
        
        // Touch conversation to update `updatedAt`
        await conversation.save();

        return c.json(message, 201);
    } catch (error) {
        console.error('Failed to send reply:', error);
        return c.json({ error: 'Failed to send reply', details: error.message }, 500);
    }
});

user.get('/notifications', async (c) => {
    const user = c.get('user');
    try {
        const notifications = await Notification.findAll({
            where: { userId: user.id },
            order: [['createdAt', 'DESC']]
        });
        return c.json(notifications);
    } catch (error) {
        console.error('Failed to fetch notifications:', error);
        return c.json({ error: 'Failed to fetch notifications', details: error.message }, 500);
    }
});

user.post('/notifications/:id/mark-read', async (c) => {
    const user = c.get('user');
    const { id } = c.req.param();
    try {
        const notification = await Notification.findOne({
            where: { id, userId: user.id }
        });

        if (!notification) {
            return c.json({ error: 'Notification not found' }, 404);
        }

        notification.isRead = true;
        await notification.save();

        return c.json(notification);
    } catch (error) {
        console.error('Failed to mark notification as read:', error);
        return c.json({ error: 'Failed to mark notification as read', details: error.message }, 500);
    }
});

user.delete('/notifications/:id', async (c) => {
    const user = c.get('user');
    const { id } = c.req.param();
    try {
        const notification = await Notification.findOne({
            where: { id, userId: user.id }
        });

        if (!notification) {
            return c.json({ error: 'Notification not found' }, 404);
        }

        await notification.destroy();

        return c.json({ message: 'Notification deleted successfully' });
    } catch (error) {
        console.error('Failed to delete notification:', error);
        return c.json({ error: 'Failed to delete notification', details: error.message }, 500);
    }
});

module.exports = user;