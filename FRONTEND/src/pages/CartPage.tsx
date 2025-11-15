import { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Heart, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '../types';

interface CartPageProps {
  onNavigate: (page: string, url?: string) => void;
}

export default function CartPage({ onNavigate }: CartPageProps) {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { addToWishlist } = useWishlist();
  const navigate = useNavigate();
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<CartItem | null>(null);

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const handleItemClick = (item: CartItem) => {
    if (item.url) {
      // Navigate to product detail page using the stored slug
      navigate(`/product/${item.url}`);
    }
  };

  const handleRemoveClick = (item: CartItem) => {
    setItemToRemove(item);
    setShowRemoveModal(true);
  };

  const handleConfirmRemove = () => {
    if (itemToRemove) {
      removeFromCart(itemToRemove.product.id, itemToRemove.variation);
      toast.success('Item removed from cart', {
        icon: '🗑️',
        style: {
          background: '#fff',
          color: '#DB2777',
          border: '2px solid #DB2777',
        },
      });
    }
    setShowRemoveModal(false);
    setItemToRemove(null);
  };

  const handleSaveForLater = () => {
    if (itemToRemove) {
      // Convert cart item to wishlist format
      const wishlistItem = {
        productId: itemToRemove.product.id,
        name: itemToRemove.product.name,
        price: itemToRemove.product.price,
        oldPrice: itemToRemove.product.compare_at_price || null,
        image: itemToRemove.image || itemToRemove.product.image_url,
        slug: itemToRemove.url || '',
        brand: '',
        category: '',
        url: itemToRemove.url || '',
        discount: '',
        rating: null,
        reviews: 0,
        isOfficialStore: false,
        hasExpressShipping: false,
        profitMargin: 0,
        originalPrice: itemToRemove.product.price,
      };
      
      addToWishlist(wishlistItem);
      removeFromCart(itemToRemove.product.id, itemToRemove.variation);
      
      toast.success('Item saved to wishlist!', {
        icon: '❤️',
        style: {
          background: '#fff',
          color: '#DB2777',
          border: '2px solid #DB2777',
        },
      });
    }
    setShowRemoveModal(false);
    setItemToRemove(null);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
            <ShoppingBag className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
          <p className="text-gray-600 mb-8 text-lg">Add some products to get started!</p>
          <button
            onClick={() => onNavigate('products')}
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-colors"
          >
            Continue Shopping
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">{cart.length} items in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => {
              const cartKey = item.variation ? `${item.product.id}-${item.variation}-${index}` : `${item.product.id}-${index}`;
              const maxQty = item.maxQuantity || item.product.stock_quantity || 99;
              
              return (
                <div
                  key={cartKey}
                  className="bg-white rounded-xl shadow-sm p-6 flex flex-col sm:flex-row gap-6 hover:shadow-md transition-shadow"
                >
                  <div 
                    className="w-full sm:w-32 h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => handleItemClick(item)}
                  >
                    <img
                      src={item.image || item.product.image_url}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 
                        className="text-lg font-semibold text-gray-900 mb-1 cursor-pointer hover:text-primary-600 transition-colors"
                        onClick={() => handleItemClick(item)}
                      >
                        {item.product.name}
                      </h3>
                      {item.variation && (
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">Variation:</span> {item.variation}
                        </p>
                      )}
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {item.product.description}
                      </p>
                      {item.maxQuantity && item.maxQuantity <= 10 && (
                        <p className="text-xs text-orange-600 mt-1">
                          {item.maxQuantity <= 5 ? `Only ${item.maxQuantity} units left!` : `${item.maxQuantity} units available`}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.variation)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="font-semibold text-lg w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.variation)}
                          disabled={item.quantity >= maxQty}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold text-primary-600">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => handleRemoveClick(item)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <button
              onClick={clearCart}
              className="text-red-500 hover:text-red-600 font-medium transition-colors"
            >
              Clear Cart
            </button>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="font-semibold">FREE</span>
                </div>
                <div className="bg-primary-50 text-primary-700 p-3 rounded-lg text-sm">
                  You've qualified for free shipping!
                </div>
                <div className="border-t pt-4 flex justify-between text-lg">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-primary-600">
                    {formatPrice(cartTotal)}
                  </span>
                </div>
              </div>

              <button className="w-full bg-primary-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-colors mb-3">
                Proceed to Checkout
              </button>

              <button
                onClick={() => onNavigate('products')}
                className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Remove Confirmation Modal */}
      {showRemoveModal && itemToRemove && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowRemoveModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Remove from cart
              </h3>
              <button
                onClick={() => setShowRemoveModal(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Do you really want to remove this item from cart?
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleSaveForLater}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-primary-600 text-primary-600 dark:text-primary-400 rounded-xl font-semibold hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
              >
                <Heart className="h-5 w-5" />
                Save for later
              </button>
              <button
                onClick={handleConfirmRemove}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                <Trash2 className="h-5 w-5" />
                Remove Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

