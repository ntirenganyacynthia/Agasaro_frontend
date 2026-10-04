# Agasaro Frontend

The **Agasaro Frontend** is a web-based shopping and Point-of-Sale (POS) interface for the Agasaro platform. It provides customers with a simple and responsive interface for browsing available products, viewing prices and stock availability, managing quantities, and adding products to a shopping cart.

The frontend communicates with the Agasaro FastAPI backend through RESTful APIs. The backend is responsible for authentication, authorization, database operations, product management, inventory information, customers, sales, payments, and other business logic, while the frontend presents this information through an interactive web interface.

The application is built with Next.js and React and is deployed to Vercel for production use.

## Application Structure

```text
Agasaro Frontend
│
├── Customer Interface
│   ├── Home Page
│   ├── Product Listing
│   ├── Product Cards
│   ├── Product Images
│   ├── Product Pricing
│   ├── Stock Availability
│   └── Shopping Cart
│
└── Admin Interface
    └── Admin Access
```

The application uses reusable React components and shared application logic to provide a consistent shopping experience.

## Main Functionality

The frontend provides the following functionality:

* Display available products
* Display product images
* Display product prices
* Display available stock quantities
* Identify products that are out of stock
* Select product quantities
* Add products to the shopping cart
* Provide feedback when a product is added to the cart
* Manage cart items
* Communicate with the Agasaro backend API
* Provide an administrative access interface
* Support responsive web layouts

## Technology Stack

| Technology | Purpose |
| ---------- | ------- |
| Next.js | Frontend framework, routing, application structure, and production builds |
| React | Component-based user interface development |
| JavaScript | Application logic |
| JSX | React component markup |
| Tailwind CSS | Utility-based styling and responsive layouts |
| CSS | Custom styling |
| Fetch API | Communication with the backend REST API |
| Vercel | Frontend deployment and hosting |
| GitHub | Source code management |

## Application Architecture

The Agasaro frontend follows a component-based architecture using Next.js and React.

The application is organized into pages, reusable components, shared application logic, and static assets.

The main application areas include:

* Pages and routes
* Product components
* Shopping cart functionality
* Backend API integration
* Static product images
* Styling and layout configuration

Reusable components are used to maintain consistent behavior and reduce duplicated interface logic.

## Customer Interface

The customer interface provides the main shopping experience for users visiting the Agasaro platform.

### Home Page

The home page provides an introduction to the Agasaro platform and directs users toward the available products.

The interface includes:

* Agasaro branding
* Navigation
* Products access
* Cart access
* Admin access
* Introductory content

### Product Listing

Products are retrieved from the Agasaro backend API and displayed in the frontend.

The product listing displays:

* Product name
* Unit price
* Available quantity
* Product image
* Stock status

The frontend retrieves product information from the backend rather than storing the product inventory directly in the frontend.

### Product Cards

Each product is displayed using a reusable product card component.

The product card provides:

* Product image
* Product name
* Product price
* Available quantity
* Quantity selector
* Add-to-cart button

When a product has no available stock, the interface displays:

```text
Out of stock
```

The add-to-cart controls are not displayed for products that are unavailable.

### Product Images

Product images are stored in the application's `public` directory.

Current product images include:

```text
public/
├── chilli-sauce.png
├── crisps.png
├── milk.png
├── susanaa.png
├── tomato-sauce.png
├── Vanilla-ice-cream.png
└── yoghurt.png
```

The frontend maps product names returned by the backend to their corresponding image files.

For example:

```javascript
const productImages = {
  "Chilli Sauce 250ml": "/chilli-sauce.png",
  "Vanilla Ice Cream 1L": "/Vanilla-ice-cream.png",
  "Crisps 50g": "/crisps.png",
  "Yoghurt 500ml": "/yoghurt.png",
  "Tomato Sauce 500ml": "/tomato-sauce.png",
  "Milk": "/milk.png",
  "Susana": "/susanaa.png",
};
```

## Shopping Cart

The frontend provides shopping cart functionality for managing selected products.

Users can:

* Select a product quantity
* Add products to the cart
* Continue browsing products
* View selected products through the cart interface
* Manage products selected for purchase

The cart functionality is implemented through shared frontend state so that cart information can be accessed across the relevant application components.

## Product Availability

Product availability is determined using the `available_quantity` value returned by the backend.

When `available_quantity > 0`, the product is available. When `available_quantity <= 0`, the product is treated as out of stock.

The frontend also limits the quantity that a user can select based on the available quantity returned by the backend.

## Admin Interface

The frontend provides an administrative access point through the navigation interface.

The Admin interface is intended to provide access to administrative functionality supported by the Agasaro backend.

Administrative operations are handled through authenticated backend API requests where applicable.

The frontend does not independently manage backend business rules. Instead, it communicates with the backend, where authorization, validation, database operations, and business logic are handled.

## Backend Integration

The Agasaro frontend communicates with the Agasaro FastAPI backend through RESTful API endpoints.

Production backend:

```text
https://agasaro-shop.onrender.com
```

Products endpoint:

```text
https://agasaro-shop.onrender.com/products/
```

The backend provides product information such as:

* Product ID
* Category ID
* Supplier ID
* Product name
* Unit price
* Stock quantity
* Reserved quantity
* Available quantity

Example product response:

```json
[
  {
    "product_id": 3,
    "category_id": 1,
    "supplier_id": 2,
    "product_name": "Chilli Sauce 250ml",
    "unit_price": "1500.00",
    "stock_quantity": "50.00",
    "reserved_quantity": "0.00",
    "available_quantity": "50.00"
  }
]
```

## API Communication

The frontend uses HTTP requests to communicate with the backend API.

The backend is responsible for:

* Authentication
* Authorization
* Product data
* Inventory information
* Customer data
* Category data
* Supplier data
* Sales data
* Payment operations
* Database operations
* Business logic

The frontend acts as the client application. It retrieves information from backend services and presents that information through the web interface.

## Authentication and Authorization

Authentication and authorization are handled by the Agasaro backend.

The frontend provides an administrative access interface and communicates with protected backend endpoints where authentication is required.

The backend is responsible for verifying authentication credentials, user roles, permissions, and authorization before allowing protected operations.

## Project Structure

```text
Agasaro_frontend/
│
├── app/
│   ├── ...
│   └── page.js
│
├── components/
│   ├── ProductCard.js
│   └── ...
│
├── lib/
│   ├── CartContext.js
│   └── ...
│
├── public/
│   ├── chilli-sauce.png
│   ├── crisps.png
│   ├── milk.png
│   ├── susanaa.png
│   ├── tomato-sauce.png
│   ├── Vanilla-ice-cream.png
│   └── yoghurt.png
│
├── next.config.js
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.js
├── .gitignore
└── README.md
```

## Local Development

### Prerequisites

* Node.js
* npm
* Git

Check versions:

```bash
node -v
npm -v
```

## Installation

Clone the repository:

```bash
git clone https://github.com/YOUR-GITHUB-USERNAME/Agasaro_frontend.git
```

Move into the project directory:

```bash
cd Agasaro_frontend
```

Install dependencies:

```bash
npm install
```

## Running the Development Server

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:3000
```

## Production Build

Create a production build:

```bash
npm run build
```

Run the production build locally:

```bash
npm start
```

## Environment Variables

If the application uses a frontend API environment variable, create a local `.env.local` file.

Example:

```env
NEXT_PUBLIC_API_URL=https://agasaro-shop.onrender.com
```

The exact variable name should match the configuration used by the application.

Do not commit environment files containing sensitive information.

```text
.env
.env.local
.env.*.local
```

## CORS Configuration

The Agasaro frontend and backend are deployed separately.

Production frontend:

```text
https://agasaro-frontend.vercel.app
```

Production backend:

```text
https://agasaro-shop.onrender.com
```

Because the frontend and backend use different domains, the backend must allow requests originating from the production frontend.

The production frontend origin is:

```text
https://agasaro-frontend.vercel.app
```

## Deployment

### Frontend Deployment

The Agasaro frontend is deployed using Vercel.

Production URL:

```text
https://agasaro-frontend.vercel.app
```

The frontend source code is maintained in GitHub and the production deployment is connected to the `main` branch.

### Backend Deployment

The Agasaro backend is hosted separately using Render.

Backend URL:

```text
https://agasaro-shop.onrender.com
```

## Deployment Architecture

```text
                         User
                          │
                          ▼
              ┌───────────────────────┐
              │   Agasaro Frontend    │
              │       Next.js         │
              │        Vercel         │
              └───────────┬───────────┘
                          │
                          │ REST API
                          │ HTTPS
                          ▼
              ┌───────────────────────┐
              │    Agasaro Backend    │
              │       FastAPI         │
              │        Render         │
              └───────────┬───────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │       Database        │
              └───────────────────────┘
```

## Development Workflow

```bash
git pull
npm install
npm run dev
```

After making changes:

```bash
git status
git add .
git commit -m "Describe your changes"
git push
```

Changes pushed to the configured production branch can trigger a new Vercel deployment.

## Security

Sensitive information should never be committed to the repository.

Do not store the following directly in source code:

* Passwords
* API keys
* Database credentials
* Authentication secrets
* JWT secrets
* Private credentials

Use environment variables for sensitive configuration.

## Error Handling

The frontend provides user-facing feedback when API requests fail.

For example:

```text
Could not load products: Failed to fetch
```

This indicates that product information could not currently be retrieved from the backend.

## Project Status

The Agasaro frontend is deployed as a production Next.js application and communicates with the Agasaro backend API.

### Production Frontend

```text
https://agasaro-frontend.vercel.app
```

### Production Backend

```text
https://agasaro-shop.onrender.com
```

### API Health Check

```text
https://agasaro-shop.onrender.com/healthz
```

### Products API

```text
https://agasaro-shop.onrender.com/products/
```

## Summary

The Agasaro Frontend provides the web-based customer interface for the Agasaro POS and shopping platform.

Built with Next.js and React, the application provides product browsing, product images, pricing, stock availability, quantity selection, and shopping cart functionality while integrating with the Agasaro FastAPI backend.

The frontend and backend are deployed separately, with the frontend hosted on Vercel and the backend hosted on Render. The backend remains responsible for authentication, authorization, business logic, inventory information, database operations, and other server-side functionality, while the frontend provides the user-facing experience.

## Author

Cynthia Ntirenganya
