import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { api, Category } from '../services/api';

interface CategoriesDropdownProps {
  onCategorySelect: (url: string) => void;
  isMobile?: boolean;
}

export default function CategoriesDropdown({ onCategorySelect, isMobile = false }: CategoriesDropdownProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleCategoryClick = (url: string) => {
    onCategorySelect(url);
    setIsOpen(false);
  };

  if (isMobile) {
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase px-4">Categories</h3>
        {categories.map((category) => (
          <div key={category.name}>
            <button
              onClick={() => setExpandedCategory(expandedCategory === category.name ? null : category.name)}
              className="flex items-center justify-between w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <span>{category.name}</span>
              <ChevronRight className={`h-4 w-4 transition-transform ${expandedCategory === category.name ? 'rotate-90' : ''}`} />
            </button>
            {expandedCategory === category.name && (
              <div className="ml-4 mt-1 space-y-1">
                {category.subcategories.map((sub) => (
                  <button
                    key={sub.name}
                    onClick={() => handleCategoryClick(sub.url)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
      >
        Categories
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <div
          onMouseLeave={() => setIsOpen(false)}
          className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 max-h-96 overflow-y-auto z-50"
        >
          {categories.map((category) => (
            <div key={category.name} className="group">
              <button
                onClick={() => handleCategoryClick(category.url)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
              >
                {category.name}
              </button>
              {category.subcategories.length > 0 && (
                <div className="pl-4">
                  {category.subcategories.slice(0, 3).map((sub) => (
                    <button
                      key={sub.name}
                      onClick={() => handleCategoryClick(sub.url)}
                      className="w-full text-left px-4 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

