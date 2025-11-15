import { ShoppingCart, Heart, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { JumiaProduct } from '../services/api';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: JumiaProduct;
  onViewDetails: (slug: string) => void;
}

export default function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const inWishlist = isInWishlist(product.productId);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.productId);
    } else {
      addToWishlist(product);
    }
  };

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const handleClick = () => {
    // Use slug if available, otherwise extract from URL as fallback
    let slug = product.slug;
    
    if (!slug && product.url) {
      // Extract slug from full URL
      slug = product.url
        .replace('https://www.jumia.com.ng/', '')
        .replace('http://www.jumia.com.ng/', '')
        .replace(/^\//, '')
        .replace(/\.html$/, '');
    }
    
    if (slug) {
      console.log('Navigating to product with slug:', slug);
      onViewDetails(slug);
    } else {
      console.error('No slug or URL available for product:', product);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer group relative transform hover:-translate-y-1"
    >
      <div className="relative overflow-hidden aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Diagonal Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="transform rotate-[-45deg] text-white/20 dark:text-white/10 text-2xl sm:text-3xl font-bold whitespace-nowrap">
            1Store.com.ng
          </div>
        </div>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
          {product.discount && (
            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
              {product.discount}
            </div>
          )}
          {product.isOfficialStore && !product.discount && (
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
              Official
            </div>
          )}
          <button
            onClick={handleWishlistToggle}
            className="ml-auto p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-md hover:scale-110 transition-transform duration-200"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-400'}`}
            />
          </button>
        </div>

        {/* Hover Overlay with Action Buttons */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              const slug = product.slug || product.url?.replace('https://www.jumia.com.ng/', '').replace(/^\//, '').replace(/\.html$/, '') || '';
              const cartProduct = {
                id: product.productId,
                name: product.name,
                slug: product.productId,
                description: '',
                price: product.price,
                compare_at_price: product.oldPrice || undefined,
                image_url: product.image,
                images: [product.image],
                in_stock: true,
                stock_quantity: 99,
                featured: false,
                created_at: new Date().toISOString(),
              };
              addToCart(cartProduct, 1, undefined, product.image, slug);
              toast.success('Added to cart!', {
                icon: '🛒',
              });
            }}
            className="bg-primary-600 text-white px-4 py-2 rounded-full font-medium text-sm shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-primary-700"
          >
            Add to Cart
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
            className="bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 px-4 py-2 rounded-full font-medium text-sm shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75"
          >
            View Details
          </button>
        </div>
      </div>

      <div className="p-3 sm:p-4">
        <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {product.name}
        </h3>

        {product.rating && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 ml-1">
                {product.rating} <span className="text-gray-400">({product.reviews})</span>
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-3">
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-xs text-gray-400 dark:text-gray-500 line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
            className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-2 sm:p-2.5 rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-110"
          >
            <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
