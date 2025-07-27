const { Hono, verify } = require('hono');
const { sequelize } = require('./models');
const { User, Listing, Category, ListingAttributeValue } = require('./models');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const { hashPassword } = require('./utils/index');
const fs = require('fs').promises;
const path = require('path');

const user = new Hono();

const authMiddleware = async (c, next) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    c.set('user', user);
    await next();
  } catch (error) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
};

user.use('/dashboard/*', authMiddleware);
user.use('/listings', authMiddleware);

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

module.exports = user;