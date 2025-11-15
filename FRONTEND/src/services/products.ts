import { supabase } from '../lib/supabase';
import { Product, Category, FilterOptions, SortOption } from '../types';

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) throw error;
  return data || [];
}

export async function getProducts(
  filters?: FilterOptions,
  sort: SortOption = 'featured'
): Promise<Product[]> {
  let query = supabase.from('products').select('*');

  if (filters?.categoryId) {
    query = query.eq('category_id', filters.categoryId);
  }

  if (filters?.inStock) {
    query = query.eq('in_stock', true);
  }

  if (filters?.priceMin !== undefined) {
    query = query.gte('price', filters.priceMin);
  }

  if (filters?.priceMax !== undefined) {
    query = query.lte('price', filters.priceMax);
  }

  if (filters?.searchQuery) {
    query = query.or(`name.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`);
  }

  switch (sort) {
    case 'price-asc':
      query = query.order('price', { ascending: true });
      break;
    case 'price-desc':
      query = query.order('price', { ascending: false });
      break;
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    case 'featured':
    default:
      query = query.order('featured', { ascending: false }).order('created_at', { ascending: false });
      break;
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getFeaturedProducts(limit: number = 6): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('featured', true)
    .limit(limit)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}
