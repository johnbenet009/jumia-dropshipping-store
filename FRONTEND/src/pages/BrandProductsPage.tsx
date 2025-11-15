import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api, JumiaProduct } from '../services/api';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';

interface BrandProductsPageProps {
  onNavigate: (page: string, url?: string) => void;
}

export default function BrandProductsPage({ onNavigate }: BrandProductsPageProps) {
  const { brandSlug } = useParams<{ brandSlug: string }>();
  const [products, setProducts] = useState<JumiaProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (brandSlug) {
      loadBrandProducts();
    }
  }, [brandSlug]);

  const loadBrandProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getBrandProducts(brandSlug!);
      setProducts(data);
    } catch (error) {
      console.error('Error loading brand products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent mb-2 capitalize">
            {brandSlug?.replace(/-/g, ' ')} Products
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore all products from this brand
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(12)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 rounded-full mb-4">
              <span className="text-4xl">📦</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No products found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              No products available for this brand
            </p>
            <button
              onClick={() => onNavigate('products')}
              className="px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              View All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 animate-fade-in">
            {products.map((product, index) => (
              <div
                key={product.productId}
                className="animate-scale-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <ProductCard
                  product={product}
                  onViewDetails={(url) => onNavigate('product', url)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
