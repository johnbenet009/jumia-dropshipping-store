# Jumia Reseller Store - Frontend

Modern, responsive e-commerce frontend for the Jumia reseller platform.

## Features

✅ **Dark Mode** - Toggle between light and dark themes
✅ **PWA Support** - Install as a mobile app
✅ **Wishlist System** - Save favorite products
✅ **Mobile Optimized** - 2 products per row on mobile
✅ **Skeletal Loading** - Smooth loading animations
✅ **Product Variations** - Handle size/color options
✅ **Categories** - Browse by category
✅ **Search** - Find products quickly
✅ **Responsive Design** - Works on all devices
✅ **Side Navigation** - Mobile-friendly navigation
✅ **Naira Currency** - Nigerian Naira (₦) formatting

## Setup

### 1. Install Dependencies
\`\`\`bash
cd FRONTEND
npm install
\`\`\`

### 2. Configure Environment
The `.env` file is already configured to connect to the backend:
\`\`\`env
VITE_API_URL=http://localhost:5000/api
\`\`\`

### 3. Start Development Server
\`\`\`bash
npm run dev
\`\`\`

The frontend will run at `http://localhost:5173`

## Backend Connection

Make sure the backend server is running at `http://localhost:5000` before starting the frontend.

Start the backend:
\`\`\`bash
cd ..
node server.js
\`\`\`

## PWA Icons

To enable full PWA functionality, add these icon files to `FRONTEND/public/`:
- `icon-192.png` (192x192px)
- `icon-512.png` (512x512px)

You can create these using any image editor or online tool.

## Features Guide

### Dark Mode
- Click the sun/moon icon in the header to toggle
- Preference is saved in localStorage

### Wishlist
- Click the heart icon on any product card
- View all wishlist items from the header icon
- Wishlist persists across sessions

### Product Variations
- Products with sizes/colors show variation selector
- Select a variation before purchasing
- Out of stock variations are disabled

### Mobile Navigation
- Tap the menu icon to open side navigation
- Auto-closes when clicking outside or on a link
- Includes search and categories

### Categories
- Browse by main categories and subcategories
- Available in header dropdown and mobile menu

## Build for Production

\`\`\`bash
npm run build
\`\`\`

The build output will be in the `dist/` folder.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Lucide React** - Icons

## Project Structure

\`\`\`
src/
├── components/       # Reusable UI components
├── context/         # React contexts (Cart, Wishlist, Theme)
├── pages/           # Page components
├── services/        # API service layer
└── types/           # TypeScript types
\`\`\`

## API Integration

All API calls go through `src/services/api.ts`:
- `getCategories()` - Fetch all categories
- `getProducts()` - Fetch all products
- `searchProducts(query)` - Search products
- `getCategoryProducts(url)` - Get products by category
- `getProductDetails(url)` - Get full product details

## Customization

### Colors
Edit `tailwind.config.js` to change the color scheme. Current primary color is teal (`#0d9488`).

### Currency
Currency formatting is handled in components using:
\`\`\`typescript
const formatPrice = (price: number) => \`₦\${price.toLocaleString()}\`;
\`\`\`

### Grid Layout
Mobile: 2 columns (`grid-cols-2`)
Tablet: 2-3 columns (`sm:grid-cols-2 md:grid-cols-3`)
Desktop: 4 columns (`lg:grid-cols-4`)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT
