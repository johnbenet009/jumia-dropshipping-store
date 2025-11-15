import { useState, useEffect } from 'react';
import { Category, FilterOptions, SortOption } from '../types';
import { X } from 'lucide-react';

interface FilterSidebarProps {
  categories: Category[];
  filters: FilterOptions;
  sort: SortOption;
  onFilterChange: (filters: FilterOptions) => void;
  onSortChange: (sort: SortOption) => void;
  onClose?: () => void;
  isMobile?: boolean;
}

export default function FilterSidebar({
  categories,
  filters,
  sort,
  onFilterChange,
  onSortChange,
  onClose,
  isMobile = false,
}: FilterSidebarProps) {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleCategoryChange = (categoryId: string) => {
    const newFilters = {
      ...localFilters,
      categoryId: localFilters.categoryId === categoryId ? undefined : categoryId,
    };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = value === '' ? undefined : parseFloat(value);
    const newFilters = {
      ...localFilters,
      [type === 'min' ? 'priceMin' : 'priceMax']: numValue,
    };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleStockChange = () => {
    const newFilters = {
      ...localFilters,
      inStock: !localFilters.inStock,
    };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters: FilterOptions = {};
    setLocalFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const content = (
    <div className="space-y-6">
      {isMobile && (
        <div className="flex items-center justify-between pb-4 border-b">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Sort By</h3>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category.id} className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={localFilters.categoryId === category.id}
                onChange={() => handleCategoryChange(category.id)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="ml-3 text-gray-700 group-hover:text-primary-600 transition-colors">
                {category.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Min Price</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={localFilters.priceMin ?? ''}
              onChange={(e) => handlePriceChange('min', e.target.value)}
              placeholder="$0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Max Price</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={localFilters.priceMax ?? ''}
              onChange={(e) => handlePriceChange('max', e.target.value)}
              placeholder="Any"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Availability</h3>
        <label className="flex items-center cursor-pointer group">
          <input
            type="checkbox"
            checked={localFilters.inStock ?? false}
            onChange={handleStockChange}
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <span className="ml-3 text-gray-700 group-hover:text-primary-600 transition-colors">
            In Stock Only
          </span>
        </label>
      </div>

      <button
        onClick={clearFilters}
        className="w-full py-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={onClose}>
        <div
          className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {content}
        </div>
      </div>
    );
  }

  return <div className="bg-white rounded-xl shadow-sm p-6">{content}</div>;
}

