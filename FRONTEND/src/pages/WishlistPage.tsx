import { Heart, Trash2, ShoppingCart, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

interface WishlistPageProps {
  onNavigate: (page: string, url?: string) => void;
}

export default function WishlistPage({ onNavigate }: WishlistPageProps) {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const handleRemove = (productId: string, productName: string) => {
    removeFromWishlist(productId);
    toast.success(`Removed "${productName}" from wishlist`, {
      icon: '🗑️',
    });
  };

  const handleAddToCart = (product: typeof wishlist[0]) => {
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
    
    addToCart(cartProduct, 1, undefined, product.image, product.slug);
    toast.success('Added to cart!', {
      icon: '🛒',
    });
  };

  const handleViewDetails = (slug: string) => {
    navigate(`/product/${slug}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <Heart className="h-8 w-8 text-red-500" />
            My Wishlist
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <Heart className="h-10 w-10 text-gray-400 dark:text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start adding products you love!
            </p>
            <button
              onClick={() => onNavigate('products')}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600 dark:text-gray-400">
                Save your favorite items for later
              </p>
              {wishlist.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to clear your entire wishlist?')) {
                      clearWishlist();
                      toast.success('Wishlist cleared', { icon: '🗑️' });
                    }
                  }}
                  className="text-red-500 hover:text-red-600 text-sm font-medium transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map((product) => (
                <div
                  key={product.productId}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
                >
                  {/* Product Image */}
                  <div 
                    className="relative aspect-square bg-gray-100 dark:bg-gray-700 cursor-pointer overflow-hidden"
                    onClick={() => handleViewDetails(product.slug)}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="transform rotate-[-45deg] text-white/20 text-3xl font-bold whitespace-nowrap">
                        1Store.com.ng
                      </div>
                    </div>

                    {/* Discount Badge */}
                    {product.discount && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {product.discount}
                      </div>
                    )}

                    {/* Remove Button - Top Right */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(product.productId, product.name);
                      }}
                      className="absolute top-2 right-2 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-md hover:bg-red-50 dark:hover:bg-red-900/30 hover:scale-110 transition-all duration-200 group/btn"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover/btn:text-red-500 transition-colors" />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 
                      className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      onClick={() => handleViewDetails(product.slug)}
                    >
                      {product.name}
                    </h3>

                    {product.brand && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        {product.brand}
                      </p>
                    )}

                    {product.rating && (
                      <div className="flex items-center gap-1 mb-3">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {product.rating} <span className="text-gray-400">({product.reviews})</span>
                        </span>
                      </div>
                    )}

                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                        {formatPrice(product.price)}
                      </span>
                      {product.oldPrice && product.oldPrice > product.price && (
                        <span className="text-sm text-gray-400 line-through">
                          {formatPrice(product.oldPrice)}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white py-2.5 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Add to Cart
                      </button>
                      <button
                        onClick={() => handleRemove(product.productId, product.name)}
                        className="p-2.5 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

