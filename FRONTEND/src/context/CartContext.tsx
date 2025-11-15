import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, variation?: string, image?: string, url?: string, maxQuantity?: number) => void;
  removeFromCart: (productId: string, variation?: string) => void;
  updateQuantity: (productId: string, quantity: number, variation?: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity: number = 1, variation?: string, image?: string, url?: string, maxQuantity?: number) => {
    setCart((prevCart) => {
      // For products with variations, treat each variation as a separate cart item
      const cartKey = variation ? `${product.id}-${variation}` : product.id;
      const existingItem = prevCart.find((item) => {
        const itemKey = item.variation ? `${item.product.id}-${item.variation}` : item.product.id;
        return itemKey === cartKey;
      });
      
      if (existingItem) {
        return prevCart.map((item) => {
          const itemKey = item.variation ? `${item.product.id}-${item.variation}` : item.product.id;
          return itemKey === cartKey
            ? { ...item, quantity: item.quantity + quantity }
            : item;
        });
      }
      
      return [...prevCart, { 
        product, 
        quantity, 
        variation,
        image: image || product.image_url,
        url: url || '',
        maxQuantity
      }];
    });
  };

  const removeFromCart = (productId: string, variation?: string) => {
    setCart((prevCart) => prevCart.filter((item) => {
      if (variation) {
        return !(item.product.id === productId && item.variation === variation);
      }
      return item.product.id !== productId;
    }));
  };

  const updateQuantity = (productId: string, quantity: number, variation?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variation);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (variation) {
          return item.product.id === productId && item.variation === variation
            ? { ...item, quantity }
            : item;
        }
        return item.product.id === productId ? { ...item, quantity } : item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

