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
  const [showClearModal, setShowClearModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<CartItem | null>(null);

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const handleItemClick = (url: string) => {
    if (url) {
      navigate(`/product/${url}`);
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

  const handleClearCart = () => {
    clearCart();
    setShowClearModal(false);
    toast.success('Cart cleared', {
      icon: '🗑️',
      style: {
        background: '#fff',
        color: '#DB2777',
        border: '2px solid #DB2777',
      },
    });
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center py-16 px-4">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 rounded-full mb-6">
            <ShoppingBag className="h-12 w-12 text-primary-600 dark:text-primary-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Your cart is empty</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">Add some products to get started!</p>
          <button
            onClick={() => onNavigate('products')}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all"
          >
            Continue Shopping
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent mb-2">
            Shopping Cart
          </h1>
          <div className="flex items-center justify-between">
            <p className="text-gray-600 dark:text-gray-400">
              {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
            </p>
            {cart.length > 0 && (
              <button
                onClick={() => setShowClearModal(true)}
                className="text-red-500 hover:text-red-600 text-sm font-medium transition-colors"
              >
                Clear Cart
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => {
              const maxQty = item.maxQuantity || item.product.stock_quantity || 99;
              const cartKey = item.variation ? `${item.product.id}-${item.variation}-${index}` : `${item.product.id}-${index}`;
              
              return (
                <div
                  key={cartKey}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-4 sm:p-6"
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div
                      className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => handleItemClick(item.url || '')}
                    >
                      <img
                        src={item.image || item.product.image_url}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className="font-semibold text-lg text-gray-900 dark:text-white mb-2 cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-2"
                        onClick={() => handleItemClick(item.url || '')}
                      >
                        {item.product.name}
                      </h3>
                      
                      {item.variation && (
                        <div className="inline-block px-3 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm font-medium mb-2">
                          {item.variation}
                        </div>
                      )}
                      
                      {item.maxQuantity && item.maxQuantity <= 10 && (
                        <p className="text-xs text-orange-600 dark:text-orange-400 mb-2">
                          {item.maxQuantity <= 5 ? `Only ${item.maxQuantity} left!` : `${item.maxQuantity} available`}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center border-2 border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.variation)}
                            className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-4 py-2 font-semibold text-gray-900 dark:text-white min-w-[50px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.variation)}
                            disabled={item.quantity >= maxQty}
                            className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Price and Remove */}
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-xl font-bold text-primary-600 dark:text-primary-400">
                              {formatPrice(item.product.price * item.quantity)}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formatPrice(item.product.price)} each
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemoveClick(item)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Shipping</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">FREE</span>
                </div>
                <div className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-3 rounded-lg text-sm">
                  🎉 You've qualified for free shipping!
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between text-lg">
                  <span className="font-bold text-gray-900 dark:text-white">Total</span>
                  <span className="font-bold text-primary-600 dark:text-primary-400">
                    {formatPrice(cartTotal)}
                  </span>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:shadow-lg transition-all mb-3">
                Proceed to Checkout
              </button>

              <button
                onClick={() => onNavigate('products')}
                className="w-full border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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

      {/* Clear Cart Confirmation Modal */}
      {showClearModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowClearModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Clear Cart
              </h3>
              <button
                onClick={() => setShowClearModal(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to clear your entire cart? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowClearModal(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearCart}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
