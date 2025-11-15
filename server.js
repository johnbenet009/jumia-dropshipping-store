require('dotenv').config();
const express = require('express');
const cors = require('cors');
const JumiaScraper = require('./scraper/jumia-scraper');

const app = express();
const PORT = process.env.PORT || 5000;
const PROFIT_MARGIN = parseFloat(process.env.PROFIT_MARGIN_PERCENTAGE) || 15;

app.use(cors());
app.use(express.json());

const scraper = new JumiaScraper();

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Jumia Reseller API is running' });
});

// Get all categories
app.get('/api/categories', (req, res) => {
  try {
    console.log('Fetching categories...');
    const categories = scraper.getCategories();
    
    res.json({
      success: true,
      count: categories.length,
      categories: categories
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get home page products
app.get('/api/products', async (req, res) => {
  try {
    console.log('Fetching home page products...');
    const products = await scraper.scrapeHomePage();
    const productsWithMargin = scraper.addProfitMargin(products, PROFIT_MARGIN);
    
    res.json({
      success: true,
      count: productsWithMargin.length,
      profitMargin: PROFIT_MARGIN,
      products: productsWithMargin
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get products by category
app.get('/api/products/category', async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ success: false, error: 'Category URL is required' });
    }
    
    console.log('Fetching category:', url);
    const products = await scraper.scrapeCategory(url);
    const productsWithMargin = scraper.addProfitMargin(products, PROFIT_MARGIN);
    
    res.json({
      success: true,
      count: productsWithMargin.length,
      profitMargin: PROFIT_MARGIN,
      products: productsWithMargin
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Search products
app.get('/api/products/search', async (req, res) => {
  try {
    const { q, priceMin, priceMax } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, error: 'Search query is required' });
    }
    
    console.log('Searching for:', q, 'Price range:', priceMin, '-', priceMax);
    const products = await scraper.searchProducts(q, priceMin, priceMax);
    const productsWithMargin = scraper.addProfitMargin(products, PROFIT_MARGIN);
    
    res.json({
      success: true,
      count: productsWithMargin.length,
      query: q,
      priceRange: priceMin && priceMax ? `${priceMin}-${priceMax}` : null,
      profitMargin: PROFIT_MARGIN,
      products: productsWithMargin
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get product reviews
app.get('/api/product/reviews', async (req, res) => {
  try {
    const { sku, page = 1 } = req.query;
    
    if (!sku) {
      return res.status(400).json({ success: false, error: 'Product SKU is required' });
    }
    
    console.log('Fetching reviews for SKU:', sku, 'Page:', page);
    const reviews = await scraper.scrapeProductReviews(sku, parseInt(page));
    
    res.json({
      success: true,
      ...reviews
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get product details by slug or ID
app.get('/api/product/details', async (req, res) => {
  let jumiaUrl = '';
  try {
    const { slug, id } = req.query;
    
    if (!slug && !id) {
      return res.status(400).json({ success: false, error: 'Product slug or ID is required' });
    }
    
    // Reconstruct Jumia URL from slug
    if (slug) {
      jumiaUrl = `https://www.jumia.com.ng/${slug}.html`;
      console.log('Fetching product by slug:', slug);
      console.log('Constructed Jumia URL:', jumiaUrl);
    } else {
      // If ID is provided, we need to search for it first
      // For now, we'll use the slug approach
      return res.status(400).json({ success: false, error: 'Please provide product slug' });
    }
    
    console.log('Attempting to scrape:', jumiaUrl);
    const productDetails = await scraper.scrapeProductDetails(jumiaUrl);
    console.log('Successfully scraped product:', productDetails.title);
    
    // Add smart profit margin (capped at ₦20,000)
    const MAX_PROFIT = 20000;
    const originalPrice = productDetails.price;
    let profit = Math.round(originalPrice * (PROFIT_MARGIN / 100));
    
    if (profit > MAX_PROFIT) {
      profit = MAX_PROFIT;
    }
    
    const newPrice = originalPrice + profit;
    const actualMarginPercentage = ((profit / originalPrice) * 100).toFixed(2);
    
    const productWithMargin = {
      ...productDetails,
      originalPrice: originalPrice,
      price: newPrice,
      oldPrice: productDetails.oldPrice ? productDetails.oldPrice + profit : null,
      profitMargin: parseFloat(actualMarginPercentage),
      profitAmount: profit,
      // Remove the full Jumia URL from response
      url: undefined,
      slug: slug
    };
    
    res.json({
      success: true,
      profitMargin: PROFIT_MARGIN,
      product: productWithMargin
    });
  } catch (error) {
    console.error('Error fetching product details:', error.message);
    console.error('Stack:', error.stack);
    console.error('Slug:', req.query.slug);
    console.error('URL:', jumiaUrl);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      slug: req.query.slug,
      attemptedUrl: jumiaUrl
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`💰 Profit margin: ${PROFIT_MARGIN}%`);
});
