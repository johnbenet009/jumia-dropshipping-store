const axios = require('axios');
const cheerio = require('cheerio');

class JumiaScraper {
  constructor() {
    this.baseUrl = 'https://www.jumia.com.ng';
    this.headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Connection': 'keep-alive'
    };
  }

  async fetchPage(url) {
    try {
      const response = await axios.get(url, { headers: this.headers });
      return cheerio.load(response.data);
    } catch (error) {
      console.error('Error fetching page:', error.message);
      throw error;
    }
  }

  parseProduct($el, $) {
    const adId = $el.attr('data-mirakl-click-ad-id');
    if (adId) return null; // Skip sponsored

    const imgElement = $el.find('img.img');
    const imageUrl = imgElement.attr('data-src') || imgElement.attr('src');
    const priceText = $el.find('.prc').text().trim().replace(/[₦,\s]/g, '');
    const oldPriceText = $el.find('.old').text().trim().replace(/[₦,\s]/g, '');
    
    // Extract slug from URL (remove domain and .html)
    const href = $el.attr('href') || '';
    const slug = href.replace(/^\//, '').replace(/\.html$/, '');

    return {
      name: $el.attr('data-gtm-name') || $el.find('h3.name').text().trim(),
      price: parseFloat(priceText) || 0,
      brand: $el.attr('data-gtm-brand'),
      category: $el.attr('data-gtm-category'),
      productId: $el.attr('data-gtm-id'),
      slug: slug,
      url: this.baseUrl + href, // Keep for internal use
      image: imageUrl,
      oldPrice: parseFloat(oldPriceText) || null,
      discount: $el.find('.bdg._dsct').text().trim(),
      rating: parseFloat($el.attr('data-gtm-dimension27')) || null,
      reviews: parseInt($el.attr('data-gtm-dimension26')) || 0,
      isOfficialStore: $el.find('.bdg._mall').length > 0,
      hasExpressShipping: $el.find('.ic.xprss').length > 0,
      campaign: $el.find('.bdg.camp').text().trim()
    };
  }

  async scrapeCategory(categoryUrl) {
    const $ = await this.fetchPage(categoryUrl);
    const products = [];

    $('a.core').each((index, element) => {
      const product = this.parseProduct($(element), $);
      if (product) products.push(product);
    });

    return products;
  }

  async scrapeHomePage() {
    return this.scrapeCategory(this.baseUrl);
  }

  async searchProducts(query, priceMin, priceMax) {
    let searchUrl = `${this.baseUrl}/catalog/?q=${encodeURIComponent(query)}`;
    
    // Add price range if provided (Jumia format: price=min-max)
    if (priceMin && priceMax) {
      searchUrl += `&price=${priceMin}-${priceMax}`;
    }
    
    console.log('Search URL with price filter:', searchUrl);
    return this.scrapeCategory(searchUrl);
  }

  addProfitMargin(products, marginPercentage = 15) {
    const MAX_PROFIT = 20000; // Cap profit at ₦20,000
    
    return products.map(product => {
      const originalPrice = product.price;
      
      // Calculate profit based on percentage
      let profit = Math.round(originalPrice * (marginPercentage / 100));
      
      // Cap profit at MAX_PROFIT for expensive items
      if (profit > MAX_PROFIT) {
        profit = MAX_PROFIT;
      }
      
      const newPrice = originalPrice + profit;
      const actualMarginPercentage = ((profit / originalPrice) * 100).toFixed(2);
      
      return {
        ...product,
        originalPrice: originalPrice,
        price: newPrice,
        oldPrice: product.oldPrice ? product.oldPrice + profit : null,
        profitMargin: parseFloat(actualMarginPercentage),
        profitAmount: profit
      };
    });
  }

  getCategories() {
    const fs = require('fs');
    const path = require('path');
    
    // Load categories from JSON file
    const categoriesPath = path.join(__dirname, '../data/categories.json');
    const categoriesData = fs.readFileSync(categoriesPath, 'utf8');
    const categories = JSON.parse(categoriesData);
    
    // Normalize URLs to include base URL
    return categories.map(category => ({
      ...category,
      url: category.url.startsWith('http') ? category.url : this.baseUrl + category.url,
      subcategories: category.subcategories.map(sub => ({
        ...sub,
        url: sub.url.startsWith('http') ? sub.url : this.baseUrl + sub.url,
        items: sub.items.map(item => ({
          ...item,
          url: item.url.startsWith('http') ? item.url : this.baseUrl + item.url
        }))
      }))
    }));
  }

  async scrapeProductReviews(sku, page = 1) {
    const reviewsUrl = `${this.baseUrl}/catalog/productratingsreviews/sku/${sku}/?page=${page}`;
    const $ = await this.fetchPage(reviewsUrl);
    
    // Extract overall rating stats
    const overallRating = parseFloat($('.-fs29 .-b').text().trim()) || null;
    const totalRatings = parseInt($('.-fs16.-pts').text().match(/(\d+)/)?.[1]) || 0;
    
    // Extract rating distribution
    const ratingDistribution = {};
    $('ul.-ptxs.-mts.-pbm li').each((index, element) => {
      const $li = $(element);
      const stars = parseInt($li.text().trim().charAt(0));
      const count = parseInt($li.find('.-gy5').text().match(/\((\d+)\)/)?.[1]) || 0;
      ratingDistribution[stars] = count;
    });
    
    // Extract reviews
    const reviews = [];
    $('article.-pvs').each((index, element) => {
      const $article = $(element);
      
      // Extract star rating from style width
      const starsWidth = $article.find('.stars .in').attr('style');
      const widthMatch = starsWidth?.match(/width:(\d+)%/);
      const rating = widthMatch ? Math.round((parseInt(widthMatch[1]) / 100) * 5) : 0;
      
      const title = $article.find('h3.-m.-fs16').text().trim();
      const comment = $article.find('p.-pvs').first().text().trim();
      const dateAuthor = $article.find('.-df.-j-bet.-i-ctr.-gy5 .-pvs').first().text().trim();
      const dateMatch = dateAuthor.match(/(\d{2}-\d{2}-\d{4})/);
      const authorMatch = dateAuthor.match(/by\s+(.+)$/);
      
      const isVerified = $article.find('.-df.-i-ctr.-gn5').length > 0;
      
      reviews.push({
        rating,
        title,
        comment,
        date: dateMatch ? dateMatch[1] : null,
        author: authorMatch ? authorMatch[1].trim() : 'Anonymous',
        verified: isVerified
      });
    });
    
    // Extract pagination info
    const totalPages = parseInt($('.pg-w a[aria-label*="Last Page"]').attr('href')?.match(/page=(\d+)/)?.[1]) || 1;
    
    return {
      overallRating,
      totalRatings,
      ratingDistribution,
      reviews,
      currentPage: page,
      totalPages,
      hasMore: page < totalPages
    };
  }

  async scrapeProductDetails(productUrl) {
    const $ = await this.fetchPage(productUrl);
    
    // Extract basic info
    const title = $('h1.-fs20').text().trim();
    const brand = $('.col10 .-phs .-pvxs a._more').first().text().trim();
    const sku = $('#add-to-cart').attr('data-sku');
    
    // Extract prices
    const currentPriceText = $('.col10 .-phs .-hr span.-b.-ubpt').text().trim().replace(/[₦,\s]/g, '');
    const oldPriceText = $('.col10 .-phs .-hr span.-gy5').text().trim().replace(/[₦,\s]/g, '');
    const discountText = $('.bdg._dsct._dyn').first().text().trim();
    
    // Extract images
    const images = [];
    $('#imgs .itm img').each((index, element) => {
      const imgUrl = $(element).attr('data-src') || $(element).attr('src');
      if (imgUrl && !imgUrl.includes('data:image/svg')) {
        // Get high-res version
        const highResUrl = imgUrl.replace('/500x500/', '/680x680/');
        images.push(highResUrl);
      }
    });
    
    // Extract rating
    const ratingText = $('.stars._m._al').text().trim();
    const ratingMatch = ratingText.match(/(\d+\.?\d*)\s*out of/);
    const rating = ratingMatch ? parseFloat(ratingMatch[1]) : null;
    const reviewsText = $('.col10 .-phs a._more').text().trim();
    const reviewsMatch = reviewsText.match(/\((\d+)\s*verified ratings\)/);
    const reviews = reviewsMatch ? parseInt(reviewsMatch[1]) : 0;
    
    // Extract variations with stock information
    const variations = [];
    $('.var-w input.vi').each((index, element) => {
      const $input = $(element);
      const $label = $(`label[for="${$input.attr('id')}"]`);
      const isDisabled = $input.hasClass('_dis');
      
      variations.push({
        name: $label.text().trim(),
        value: $input.attr('value'),
        available: !isDisabled
      });
    });
    
    // Also check for popup-style variations (like in the provided HTML)
    if (variations.length === 0) {
      $('.cw .cont form[data-var="true"]').each((index, element) => {
        const $form = $(element);
        const $parent = $form.parent();
        const varName = $parent.find('.-m.-fs16').first().text().trim();
        const priceText = $parent.find('.-ubpt.-tal.-m').text().trim().replace(/[₦,\s]/g, '');
        const stockText = $parent.find('.-df.-i-ctr.-fs12').text().trim();
        
        // Extract stock quantity
        let stockQty = null;
        const stockMatch = stockText.match(/(\d+)\s*units?\s*left/i);
        if (stockMatch) {
          stockQty = parseInt(stockMatch[1]);
        } else if (stockText.toLowerCase().includes('few units')) {
          stockQty = 5; // Assume "few units" means around 5
        }
        
        if (varName) {
          variations.push({
            name: varName,
            value: $form.attr('data-svar') || varName,
            available: !$parent.find('button[disabled]').length,
            price: parseFloat(priceText) || null,
            stockQuantity: stockQty
          });
        }
      });
    }
    
    // Extract stock quantity for non-variation products
    let stockQuantity = null;
    const stockText = $('#add-to-cart').parent().find('.-df.-i-ctr.-fs12, .stock-info').text().trim();
    const stockMatch = stockText.match(/(\d+)\s*units?\s*left/i);
    if (stockMatch) {
      stockQuantity = parseInt(stockMatch[1]);
    } else if (stockText.toLowerCase().includes('few units')) {
      stockQuantity = 5;
    } else if (stockText.toLowerCase().includes('in stock')) {
      stockQuantity = 99; // Default for "in stock" without specific number
    }
    
    // Extract description
    const description = $('.markup.-mhm.-pvl').html() || '';
    const descriptionText = $('.markup.-mhm.-pvl').text().trim();
    
    // Extract shipping info
    const shippingText = $('.markup.-fs12.-pbs').text().trim();
    
    // Extract badges/tags
    const badges = [];
    $('.col10 .-df.-i-ctr.-pts .bdg, .col10 .-df.-i-ctr.-pts a.bdg').each((index, element) => {
      badges.push($(element).text().trim());
    });
    
    // Extract key features (if available)
    const keyFeatures = [];
    $('.card.-mtm.-pvl ul li').each((index, element) => {
      const feature = $(element).text().trim();
      if (feature && feature.length < 200) keyFeatures.push(feature);
    });
    
    // Extract specifications
    const specifications = {};
    $('.card.-mtm.-pvl table tr').each((index, element) => {
      const $row = $(element);
      const label = $row.find('th').text().trim();
      const value = $row.find('td').text().trim();
      if (label && value && label.length < 100) {
        specifications[label] = value;
      }
    });
    
    return {
      title,
      brand,
      sku,
      url: productUrl,
      price: parseFloat(currentPriceText) || 0,
      oldPrice: parseFloat(oldPriceText) || null,
      discount: discountText,
      images,
      rating,
      reviews,
      variations,
      stockQuantity,
      description: descriptionText,
      descriptionHtml: description,
      shipping: shippingText,
      badges,
      keyFeatures: keyFeatures.length > 0 ? keyFeatures : null,
      specifications: Object.keys(specifications).length > 0 ? specifications : null,
      isOfficialStore: badges.some(b => b.toLowerCase().includes('official store')),
      inStock: variations.length === 0 || variations.some(v => v.available)
    };
  }
}

module.exports = JumiaScraper;
