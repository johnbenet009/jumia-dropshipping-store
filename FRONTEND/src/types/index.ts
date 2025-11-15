export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price?: number;
  category_id?: string;
  image_url: string;
  images: string[];
  in_stock: boolean;
  stock_quantity: number;
  featured: boolean;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  variation?: string; // Selected variation (e.g., "EU 40", "Red", etc.)
  image?: string; // Store image URL to avoid re-fetching
  url?: string; // Store product URL for navigation
  maxQuantity?: number; // Available stock for this variation
}

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest';

export interface FilterOptions {
  categoryId?: string;
  priceMin?: number;
  priceMax?: number;
  inStock?: boolean;
  searchQuery?: string;
}
