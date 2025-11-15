import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api, JumiaProduct } from '../services/api';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import FilterSort from '../components/FilterSort';

interface ProductsPageProps {
  onNavigate: (page: string, url?: string) => void;
}

export default function ProductsPage({ onNavigate }: ProductsPageProps) {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const categoryUrl = searchParams.get('category') || '';
  const [products, setProducts] = useState<JumiaProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<JumiaProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });

  useEffect(() => {
    loadProducts();
  }, [searchQuery, categoryUrl, priceRange]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [products, sortBy, priceRange]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      let data: JumiaProduct[];
      
      if (searchQuery) {
        // Pass price range to API if set
        const hasValidPriceRange = priceRange.min > 0 && priceRange.max < Infinity;
        data = await api.searchProducts(
          searchQuery,
          hasValidPriceRange ? priceRange.min : undefined,
          hasValidPriceRange ? priceRange.max : undefined
        );
      } else if (categoryUrl) {
        data = await api.getCategoryProducts(categoryUrl);
      } else {
        data = await api.getProducts();
      }
      
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...products];

    // Apply price filter
    filtered = filtered.filter(
      (product) => product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Apply sorting
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        // Assuming products are already sorted by newest from API
        break;
      case 'featured':
      default:
        // Keep original order
        break;
    }

    setFilteredProducts(filtered);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
  };

  const handlePriceFilter = (min: number, max: number) => {
    setPriceRange({ min, max });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent mb-2">
            {searchQuery ? `Search: "${searchQuery}"` : categoryUrl ? 'Category Products' : 'All Products'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover amazing products at great prices
          </p>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <FilterSort
              onSortChange={handleSortChange}
              onPriceFilter={handlePriceFilter}
              currentSort={sortBy}
            />
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {[...Array(12)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16 animate-fade-in">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 rounded-full mb-4">
                  <span className="text-4xl">🔍</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Try adjusting your filters or search for something else
                </p>
                <button
                  onClick={() => {
                    onNavigate('products');
                    setPriceRange({ min: 0, max: Infinity });
                    setSortBy('featured');
                  }}
                  className="px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  View All Products
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 animate-fade-in">
                {filteredProducts.map((product, index) => (
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

        {/* Mobile Filter Button */}
        <div className="lg:hidden">
          <FilterSort
            onSortChange={handleSortChange}
            onPriceFilter={handlePriceFilter}
            currentSort={sortBy}
            isMobile
          />
        </div>
      </div>
    </div>
  );
}

