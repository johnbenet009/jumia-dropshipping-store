# 🛍️ Jumia Dropshipping Store

> **A modern, real-time dropshipping platform powered by Jumia Nigeria**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)

## ⚠️ Disclaimer

**This project is NOT affiliated with, endorsed by, or connected to Jumia in any way.** This is an independent open-source project developed by [John Benet](https://github.com/johnbenet009) to help entrepreneurs start their own dropshipping business using Jumia as a supplier.

**This is NOT a Jumia clone.** This is a dropshipping platform that sources products from Jumia in real-time. It's a business tool for entrepreneurs, not a replica of Jumia's website.

## 🎯 What is This?

This is a **complete dropshipping e-commerce platform** that allows you to:

- ✅ Run your own online store without inventory
- ✅ Automatically sync products from Jumia in real-time
- ✅ Add your profit margin to product prices
- ✅ Let customers browse and order products
- ✅ Fulfill orders through Jumia
- ✅ Earn profit on every sale

**No database required!** All products are fetched directly from Jumia in real-time, ensuring prices and availability are always up-to-date.

## 💡 How It Works

1. **Customer browses your store** → Products are fetched from Jumia in real-time
2. **Your profit is added** → Prices shown include your configured profit margin
3. **Customer places order** → You receive the order details
4. **You order from Jumia** → Place the order on Jumia with customer's address
5. **Jumia ships directly** → Customer receives the product
6. **You keep the profit** → The difference between your price and Jumia's price

## 🚀 Features

### Core Features
- 🔄 **Real-time Product Sync** - No manual product uploads needed
- 💰 **Smart Profit Margin** - Automatic profit calculation (capped at ₦20,000 for expensive items)
- 🔍 **Live Search** - Search products directly from Jumia
- 📱 **PWA Support** - Install as mobile app
- 🌓 **Dark Mode** - Beautiful dark theme
- 🛒 **Shopping Cart** - Full cart management with variations
- ❤️ **Wishlist** - Save products for later
- ⭐ **Customer Reviews** - Real reviews from Jumia
- 📦 **Product Variations** - Handle sizes, colors, etc.
- 🎨 **Modern UI/UX** - Pink gradient theme, responsive design

### Technical Features
- ⚡ **No Database** - All data fetched in real-time
- 🔒 **Source Hidden** - Customers don't see Jumia URLs
- 📊 **Stock Tracking** - Real-time stock availability
- 💳 **Price Range Filtering** - Filter by price on Jumia
- 🖼️ **Watermarked Images** - Your branding on product images
- 📱 **Fully Responsive** - Works on all devices

## 📋 Prerequisites

- Node.js 18 or higher
- npm or yarn
- Basic knowledge of JavaScript/React (optional)

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/johnbenet009/jumia-dropshipping-store.git
cd jumia-dropshipping-store
```

### 2. Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd FRONTEND
npm install
cd ..
```

### 3. Configure Environment Variables

```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your settings
```

**Required Configuration:**

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Profit Margin (percentage)
PROFIT_MARGIN_PERCENTAGE=15

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### 4. Configure Frontend

```bash
cd FRONTEND
cp .env.example .env
```

Edit `FRONTEND/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 5. Start the Application

**Development Mode:**

```bash
# Terminal 1 - Start Backend
npm run dev

# Terminal 2 - Start Frontend
cd FRONTEND
npm run dev
```

**Production Mode:**

```bash
# Build frontend
cd FRONTEND
npm run build
cd ..

# Start backend (serves frontend)
npm start
```

Your store will be available at:
- Frontend: `http://localhost:5173` (dev) or `http://localhost:5000` (production)
- Backend API: `http://localhost:5000/api`

## 🎨 Customization

### Change Store Name

Edit `FRONTEND/src/components/Header.tsx`:
```tsx
<span>Your Store Name</span>
```

### Change Profit Margin

Edit `.env`:
```env
PROFIT_MARGIN_PERCENTAGE=20  # Change to your desired percentage
```

**Note:** Profit is automatically capped at ₦20,000 for expensive items to keep prices competitive.

### Change Theme Colors

Edit `FRONTEND/tailwind.config.js`:
```js
colors: {
  primary: {
    // Change these colors
    400: '#f472b6',
    500: '#ec4899',
    600: '#db2777',
  }
}
```

### Add Your Logo

Replace the logo in `FRONTEND/src/components/Header.tsx` or add your logo image to `FRONTEND/public/`.

## 🌐 Deployment

This project can be hosted on **any hosting platform** - no fancy hosting required!

### Recommended Hosting Options

1. **Vercel** (Free tier available)
   - Frontend: Auto-deploy from GitHub
   - Backend: Vercel Serverless Functions

2. **Netlify** (Free tier available)
   - Similar to Vercel

3. **Railway** (Free tier available)
   - Full-stack deployment

4. **Heroku** (Paid)
   - Traditional hosting

5. **VPS** (DigitalOcean, Linode, etc.)
   - Full control, requires server management

### Deployment Steps (Vercel Example)

1. Push your code to GitHub
2. Connect your repo to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy!

**Environment Variables for Production:**
```env
PORT=5000
PROFIT_MARGIN_PERCENTAGE=15
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
```

## 📚 Project Structure

```
jumia-dropshipping-store/
├── FRONTEND/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context (cart, wishlist)
│   │   └── services/       # API services
│   └── public/             # Static assets
├── scraper/                # Jumia scraper
│   └── jumia-scraper.js   # Product fetching logic
├── data/                   # Static data (categories)
├── server.js              # Express backend
├── .env.example           # Environment variables template
└── README.md             # This file
```

## 🔧 API Endpoints

### Products
- `GET /api/products` - Get homepage products
- `GET /api/products/search?q=query&priceMin=X&priceMax=Y` - Search products
- `GET /api/products/category?url=category-url` - Get category products
- `GET /api/product/details?slug=product-slug` - Get product details
- `GET /api/product/reviews?sku=product-sku&page=1` - Get product reviews

### Categories
- `GET /api/categories` - Get all categories

### Health Check
- `GET /api/health` - Check if API is running

## 📝 TODO List

### High Priority
- [ ] **Payment Gateway Integration**
  - Paystack
  - Flutterwave
  - Stripe (for international)
  
- [ ] **Order Management System**
  - Order dashboard
  - Order status tracking
  - Customer order history

- [ ] **Telegram Notifications**
  - New order alerts
  - Low stock alerts
  - Daily sales summary

### Medium Priority
- [ ] **Admin Dashboard**
  - Sales analytics
  - Profit tracking
  - Popular products

- [ ] **Email Notifications**
  - Order confirmation
  - Shipping updates
  - Marketing emails

- [ ] **Guest Checkout System**
  - Simple checkout with email, phone, and address
  - No account creation required
  - Smooth, fast checkout experience
  - Order tracking via email/phone

### Low Priority
- [ ] **SEO Optimization**
  - Meta tags
  - Sitemap
  - Schema markup

- [ ] **Coupon/Discount System**
  - Promo codes
  - Flash sales

- [ ] **Abandoned Cart Recovery**
  - Email reminders
  - WhatsApp notifications

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### How to Contribute

1. **Fork the Repository**
   ```bash
   # Click the "Fork" button on GitHub
   ```

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/jumia-dropshipping-store.git
   cd jumia-dropshipping-store
   ```

3. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

4. **Make Your Changes**
   - Write clean, readable code
   - Follow existing code style
   - Test your changes thoroughly

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "Add: your feature description"
   # or
   git commit -m "Fix: your bug fix description"
   ```

6. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Describe your changes
   - Submit!

### Contribution Guidelines

- ✅ Write clear commit messages
- ✅ Test your code before submitting
- ✅ Update documentation if needed
- ✅ Follow the existing code style
- ✅ One feature/fix per pull request
- ❌ Don't commit `.env` files
- ❌ Don't include `node_modules`

## 🐛 Bug Reports

Found a bug? Please open an issue with:
- Description of the bug
- Steps to reproduce
- Expected behavior
- Screenshots (if applicable)
- Your environment (OS, Node version, etc.)

## 💬 Support

- **Issues**: [GitHub Issues](https://github.com/johnbenet009/jumia-dropshipping-store/issues)
- **Discussions**: [GitHub Discussions](https://github.com/johnbenet009/jumia-dropshipping-store/discussions)
- **Email**: [Your Email]

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Jumia Nigeria** - Product source (not affiliated)
- **React** - Frontend framework
- **Express** - Backend framework
- **Tailwind CSS** - Styling
- **Cheerio** - Web scraping

## ⚖️ Legal Notice

This project is for educational and entrepreneurial purposes. Users are responsible for:
- Complying with Jumia's terms of service
- Handling customer data responsibly
- Following local e-commerce regulations
- Providing accurate product information
- Fulfilling orders promptly

**Use at your own risk.** The developer is not responsible for any misuse of this software.

## 🌟 Star This Repo

If you find this project useful, please give it a ⭐ on GitHub!

---

**Made with ❤️ by [John Benet](https://github.com/johnbenet009)**

*Empowering entrepreneurs to start their dropshipping journey* 🚀
