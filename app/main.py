import imp
import os
import sys
import json

sys.path.insert(0, os.path.dirname(__file__))

deals_data = [
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
      "category": ["featured", "tab-2"]
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
      "category": ["featured", "tab-3"]
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
      "category": ["tab-2"]
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
      "category": ["tab-3"]
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
      "category": ["featured", "tab-2"]
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
      "category": ["tab-3"]
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
      "category": ["featured", "tab-2"]
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
      "category": ["tab-2"]
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
      "category": ["featured", "tab-3"]
    }
]

def application(environ, start_response):
    path = environ.get('PATH_INFO', '')
    status = '200 OK'
    headers = [('Content-Type', 'application/json'), ('Access-Control-Allow-Origin', '*')] # Added CORS header
    start_response(status, headers)
    response = json.dumps({'route': '/api/deals'})
    if path == '/api/deals':
        response = json.dumps(deals_data)
    return [response.encode('utf-8')]
