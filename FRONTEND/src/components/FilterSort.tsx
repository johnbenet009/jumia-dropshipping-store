import { useState } from 'react';
import { SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';

interface FilterSortProps {
  onSortChange: (sort: string) => void;
  onPriceFilter: (min: number, max: number) => void;
  currentSort: string;
  isMobile?: boolean;
}

export default function FilterSort({ onSortChange, onPriceFilter, currentSort, isMobile = false }: FilterSortProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
  ];

  const handleApplyPrice = () => {
    const min = minPrice ? parseFloat(minPrice) : 0;
    const max = maxPrice ? parseFloat(maxPrice) : Infinity;
    onPriceFilter(min, max);
    if (isMobile) setIsOpen(false);
  };

  const handleClearPrice = () => {
    setMinPrice('');
    setMaxPrice('');
    onPriceFilter(0, Infinity);
  };

  if (isMobile) {
    return (
      <>
        {/* Mobile Floating Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 animate-scale-in"
        >
          <SlidersHorizontal className="h-6 w-6" />
        </button>

        {/* Mobile Bottom Sheet */}
        {isOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-50 animate-fade-in"
              onClick={() => setIsOpen(false)}
            ></div>
            <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-3xl z-50 p-6 animate-slide-up max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Filter & Sort</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Sort Options */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <ArrowUpDown className="h-5 w-5 text-primary-500" />
                  Sort By
                </h4>
                <div className="space-y-2">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        onSortChange(option.value);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                        currentSort === option.value
                          ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                          : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Price Range</h4>
                <div className="flex gap-3 mb-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleApplyPrice}
                    className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                  >
                    Apply
                  </button>
                  <button
                    onClick={handleClearPrice}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  // Desktop Version
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 sticky top-24 animate-fade-in">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <SlidersHorizontal className="h-5 w-5 text-primary-500" />
        Filter & Sort
      </h3>

      {/* Sort Options */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-primary-500" />
          Sort By
        </h4>
        <div className="space-y-2">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className={`w-full text-left px-4 py-2.5 rounded-xl transition-all duration-200 text-sm ${
                currentSort === option.value
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                  : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">Price Range (₦)</h4>
        <div className="space-y-3">
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          />
          <div className="flex gap-2">
            <button
              onClick={handleApplyPrice}
              className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white py-2.5 rounded-xl font-medium hover:shadow-lg transition-all duration-200 text-sm"
            >
              Apply
            </button>
            <button
              onClick={handleClearPrice}
              className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

