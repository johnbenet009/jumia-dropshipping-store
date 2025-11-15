import { useState, useEffect } from 'react';
import { ArrowRight, ShoppingBag, TrendingUp, Shield } from 'lucide-react';
import { api, JumiaProduct } from '../services/api';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import CategoriesShowcase from '../components/CategoriesShowcase';

interface HomePageProps {
  onNavigate: (page: string, url?: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [featuredProducts, setFeaturedProducts] = useState<JumiaProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const data = await api.getProducts();
      // Shuffle array and take 60 items
      const shuffled = data.sort(() => 0.5 - Math.random());
      setFeaturedProducts(shuffled.slice(0, 60));
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              Welcome to 1Store
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-primary-100">
              Your trusted online shopping platform
            </p>
            <button
              onClick={() => onNavigate('products')}
              className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
            >
              Shop Now
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <CategoriesShowcase onCategorySelect={(url) => onNavigate('products', url)} />

      {/* Features - Hidden on mobile */}
      <section className="py-16 bg-white dark:bg-gray-800 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4">
                <ShoppingBag className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Wide Selection
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Thousands of products at competitive prices
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4">
                <TrendingUp className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Best Prices
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Competitive pricing with transparent margins
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4">
                <Shield className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Secure Shopping
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Safe and secure transactions with buyer protection
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              <span className="hidden sm:inline">Featured Products</span>
              <span className="sm:hidden">Hot Deals</span>
            </h2>
            <button
              onClick={() => onNavigate('products')}
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center gap-2 text-sm sm:text-base"
            >
              <span className="hidden sm:inline">View All</span>
              <span className="sm:hidden">More</span>
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(12)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard
                    key={product.productId}
                    product={product}
                    onViewDetails={(url) => onNavigate('product', url)}
                  />
                ))}
              </div>
              <div className="text-center mt-8">
                <button
                  onClick={() => onNavigate('products')}
                  className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  View More Products
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

