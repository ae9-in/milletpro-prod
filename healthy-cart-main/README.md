# Millet Pro

Millet Pro is a full-stack millet-based ecommerce application with a React frontend, an Express backend, MongoDB storage, JWT authentication, and Razorpay test-mode payment support.

## Stack

- Frontend: React 18, TypeScript, Vite, React Router, Tailwind CSS, shadcn/ui
- Backend: Node.js, Express, MongoDB, Mongoose, JWT
- Payments: Razorpay Test Mode
- Deployment: Vercel-compatible SPA frontend with `vercel.json` rewrites

## Project Structure

```text
healthy-cart-main/
├─ backend/                  # Express API, Mongo models, auth, orders, payments
├─ public/                   # Public frontend assets
├─ src/                      # React app
├─ index.html                # Vite entry HTML
├─ package.json              # Frontend package manifest
└─ vercel.json               # SPA route rewrites for deployment
```

## Features

- Product listing from backend API
- Product search and category filtering
- Cart and checkout flow
- Razorpay test-mode payment flow
- JWT-based signup and login
- User profile with order history
- Contact form with backend persistence
- MongoDB-backed product and site content

## Prerequisites

- Node.js 18+
- npm
- MongoDB Atlas or any MongoDB connection string
- Razorpay test keys if using real Razorpay test mode

## Environment Variables

### Frontend

Create [`.env`](./.env):

```env
VITE_API_URL=http://localhost:5000/api
```

### Backend

Create [`backend/.env`](./backend/.env):

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_uri
MONGODB_DB_NAME=milletpro
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:8080
PAYMENT_PROVIDER=razorpay
PAYMENT_CURRENCY=INR
MOCK_PAYMENT_OTP=1221
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

Notes:
- Use `PAYMENT_PROVIDER=mock` if you want the internal mock gateway instead of Razorpay.
- Do not commit real `.env` files.

## Install Dependencies

### Frontend

```powershell
cd "w:\V S Code files\milletpro\healthy-cart-main"
npm install
```

### Backend

```powershell
cd "w:\V S Code files\milletpro\healthy-cart-main\backend"
npm install
```

## Run Locally

### Start Backend

```powershell
cd "w:\V S Code files\milletpro\healthy-cart-main\backend"
npm run dev
```

### Start Frontend

```powershell
cd "w:\V S Code files\milletpro\healthy-cart-main"
npm run dev
```

Default local URLs:
- Frontend: `http://localhost:8080`
- Backend: `http://localhost:5000`

## Useful Commands

### Frontend

```powershell
npm run dev
npm run build
npm run lint
npm run test
```

### Backend

```powershell
npm run dev
npm start
```

## Deployment Notes

This project uses React Router, so direct navigation to routes like `/products` or `/about` needs an SPA rewrite in production.

That is handled by [`vercel.json`](./vercel.json):

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Without this rewrite, deployed routes can return `404` on refresh or direct access.

## Payment Notes

- Razorpay is configured for test mode
- Browser extensions like ad blockers or Brave Shields can interfere with Razorpay scripts
- If payment scripts are blocked, disable privacy blockers for local testing

## Security

- Keep `backend/.env` and root `.env` private
- Rotate any secrets that were ever pushed or exposed
- Use a strong `JWT_SECRET`

## Status

The current codebase has:

- flattened project structure
- backend-driven product catalog
- SPA route rewrites for deployment
- restored backend product image serving

## License

Private project.
