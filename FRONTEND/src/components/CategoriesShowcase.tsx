import { useState, useEffect } from 'react';
import { api, Category } from '../services/api';
import { ChevronRight } from 'lucide-react';

interface CategoriesShowcaseProps {
  onCategorySelect: (url: string) => void;
}

export default function CategoriesShowcase({ onCategorySelect }: CategoriesShowcaseProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await api.getCategories();
      setCategories(data.slice(0, 8)); // Show first 8 categories
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const categoryIcons: Record<string, string> = {
    'Appliances': '🔌',
    'Phones & Tablets': '📱',
    'Health & Beauty': '💄',
    'Home & Office': '🏠',
    'Electronics': '💻',
    'Fashion': '👗',
    'Supermarket': '🛒',
    'Computing': '⌨️',
    'Baby Products': '👶',
    'Gaming': '🎮',
  };

  return (
    <section className="hidden lg:block py-12 bg-gradient-to-br from-white to-pink-50 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
            Shop by Category
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => onCategorySelect(category.url)}
              className="group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="text-4xl group-hover:scale-110 transition-transform">
                  {categoryIcons[category.name] || '📦'}
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-left group-hover:text-primary-600 transition-colors">
                {category.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-left mt-1">
                {category.subcategories.length} subcategories
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
