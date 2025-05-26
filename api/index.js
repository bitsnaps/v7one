const { serve } = require('@hono/node-server');
const { Hono } = require('hono');
const { serveStatic } = require('@hono/node-server/serve-static');
const { cors } = require('hono/cors');
const { rateLimiter } = require('./honoRateLimiter');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const MAX_TIMESTAMP_AGE_MS = 15 * 60 * 1000; // 15 minutes validity for timestamp/token


// TEST: Create a test account for Ethereal Email
async function createTestAccount() {
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
}

let transporter;
createTestAccount().then(t => {
    transporter = t;
    console.log('Email test account created');
});

const EMAIL_CONTACT = process.env.EMAIL_CONTACT || 'admin@email.com';
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

/*/ PROD: Configure email transporter
const transporter = nodemailer.createTransport({
    host: 'mail.ecosiumevent.com', // Replace with your SMTP host ('smtp.example.com')
    port: 465, //993, // Common SMTP port (587 worked with secure:false)
    secure: true, // true for 465, false for other ports
    auth: {
      user: EMAIL_CONTACT, // Replace with your email
      pass: EMAIL_PASSWORD // Replace with your password or app-specific password
    },
  });
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
            id: crypto.randomBytes(16).toString('hex'), // Generate a unique ID for the offer
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

// API endpoint for deals
app.get('/api/deals', async (c) => {
    try {
        const deals = [
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
        
        return c.json({ success: true, data: deals });
    } catch (error) {
        console.error('Error fetching deals:', error);
        return c.json({ success: false, message: 'Error fetching deals' }, 500);
    }
});

// API endpoint for deal categories
app.get('/api/categories', async (c) => {
    try {
        const categories = [
            // Real Estate Categories
            {
                id: 1,
                name: "Apartment",
                slug: "apartments",
                icon: "/img/icon-apartment.svg",
                description: "Modern apartments and condos",
                count: 123,
                type: "real-estate"
            },
            {
                id: 2,
                name: "Villa",
                slug: "villas",
                icon: "/img/icon-villa.svg",
                description: "Luxury villas and estates",
                count: 89,
                type: "real-estate"
            },
            {
                id: 3,
                name: "Home",
                slug: "homes",
                icon: "/img/icon-house.svg",
                description: "Family homes and houses",
                count: 156,
                type: "real-estate"
            },
            {
                id: 4,
                name: "Office",
                slug: "offices",
                icon: "/img/icon-office.svg",
                description: "Commercial office spaces",
                count: 45,
                type: "real-estate"
            },
            {
                id: 5,
                name: "Building",
                slug: "buildings",
                icon: "/img/icon-building.svg",
                description: "Commercial buildings",
                count: 30,
                type: "real-estate"
            },
            {
                id: 6,
                name: "Townhouse",
                slug: "townhouses",
                icon: "/img/icon-townhouse.svg",
                description: "Modern townhouses",
                count: 67,
                type: "real-estate"
            },
            {
                id: 7,
                name: "Shop",
                slug: "shops",
                icon: "/img/icon-shop.svg",
                description: "Retail shops and stores",
                count: 88,
                type: "real-estate"
            },
            {
                id: 8,
                name: "Garage",
                slug: "garages",
                icon: "/img/icon-garage.svg",
                description: "Parking spaces and garages",
                count: 20,
                type: "real-estate"
            },
            // Car Categories
            {
                id: 9,
                name: "Sedan",
                slug: "cars-sedan",
                icon: "/img/icon-car-sedan.svg",
                description: "Sedan cars and family vehicles",
                count: 120,
                type: "cars"
            },
            {
                id: 10,
                name: "SUV",
                slug: "cars-suv",
                icon: "/img/icon-car-suv.svg",
                description: "SUVs and crossover vehicles",
                count: 85,
                type: "cars"
            },
            {
                id: 11,
                name: "Truck",
                slug: "cars-truck",
                icon: "/img/icon-car-truck.svg",
                description: "Trucks and commercial vehicles",
                count: 45,
                type: "cars"
            },
            // Other Categories
            {
                id: 12,
                name: "Electronics",
                slug: "electronics",
                icon: "/img/icon-electronics.svg",
                description: "Phones, laptops, gadgets and tech accessories",
                count: 150,
                type: "other"
            },
            {
                id: 13,
                name: "Services",
                slug: "services",
                icon: "/img/icon-services.svg",
                description: "Professional services and consultations",
                count: 90,
                type: "other"
            },
            {
                id: 14,
                name: "Other Deals",
                slug: "other-deals",
                icon: "/img/icon-deal.svg",
                description: "Miscellaneous items and special offers",
                count: 110,
                type: "other"
            }
        ];
        
        return c.json({ success: true, data: categories });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return c.json({ success: false, message: 'Error fetching categories' }, 500);
    }
});

serve(app, (info) => {
  console.log(`Listening on http://localhost:${info.port}`) // Listening on http://localhost:3000
})