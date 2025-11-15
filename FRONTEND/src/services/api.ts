const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface JumiaProduct {
  name: string;
  price: number;
  originalPrice: number;
  brand: string;
  category: string;
  productId: string;
  slug: string;
  url?: string; // Optional, for internal use only
  image: string;
  oldPrice: number | null;
  discount: string;
  rating: number | null;
  reviews: number;
  isOfficialStore: boolean;
  hasExpressShipping: boolean;
  profitMargin: number;
}

export interface JumiaProductDetails extends JumiaProduct {
  title: string;
  sku: string;
  images: string[];
  variations: Array<{
    name: string;
    value: string;
    available: boolean;
    price?: number;
    stockQuantity?: number;
  }>;
  stockQuantity?: number;
  description: string;
  descriptionHtml: string;
  shipping: string;
  badges: string[];
  keyFeatures: string[] | null;
  specifications: Record<string, string> | null;
  inStock: boolean;
}

export interface Category {
  name: string;
  url: string;
  subcategories: Array<{
    name: string;
    url: string;
    items: Array<{
      name: string;
      url: string;
    }>;
  }>;
}

export interface ProductReview {
  rating: number;
  title: string;
  comment: string;
  date: string | null;
  author: string;
  verified: boolean;
}

export interface ProductReviews {
  overallRating: number | null;
  totalRatings: number;
  ratingDistribution: Record<number, number>;
  reviews: ProductReview[];
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
}

export const api = {
  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${API_URL}/categories`);
    const data = await response.json();
    return data.categories;
  },

  async getProducts(): Promise<JumiaProduct[]> {
    const response = await fetch(`${API_URL}/products`);
    const data = await response.json();
    return data.products;
  },

  async searchProducts(query: string, priceMin?: number, priceMax?: number): Promise<JumiaProduct[]> {
    let url = `${API_URL}/products/search?q=${encodeURIComponent(query)}`;
    if (priceMin !== undefined && priceMax !== undefined) {
      url += `&priceMin=${priceMin}&priceMax=${priceMax}`;
    }
    const response = await fetch(url);
    const data = await response.json();
    return data.products;
  },

  async getCategoryProducts(url: string): Promise<JumiaProduct[]> {
    const response = await fetch(`${API_URL}/products/category?url=${encodeURIComponent(url)}`);
    const data = await response.json();
    return data.products;
  },

  async getProductDetails(slug: string): Promise<JumiaProductDetails> {
    const response = await fetch(`${API_URL}/product/details?slug=${encodeURIComponent(slug)}`);
    const data = await response.json();
    return data.product;
  },

  async getProductReviews(sku: string, page: number = 1): Promise<ProductReviews> {
    const response = await fetch(`${API_URL}/product/reviews?sku=${encodeURIComponent(sku)}&page=${page}`);
    const data = await response.json();
    return data;
  },

  async getBrandProducts(brandSlug: string): Promise<JumiaProduct[]> {
    const brandUrl = `https://www.jumia.com.ng/${brandSlug}/`;
    const response = await fetch(`${API_URL}/products/category?url=${encodeURIComponent(brandUrl)}`);
    const data = await response.json();
    return data.products;
  },
};
