import { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import AboutPage from './pages/AboutPage';
import BrandProductsPage from './pages/BrandProductsPage';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
    }
  }, []);

  const handleNavigate = (page: string, param?: string) => {
    switch (page) {
      case 'home':
        navigate('/');
        break;
      case 'products':
        navigate('/products');
        break;
      case 'product':
        if (param) {
          // Use slug directly (no encoding needed)
          navigate(`/product/${param}`);
        }
        break;
      case 'cart':
        navigate('/cart');
        break;
      case 'wishlist':
        navigate('/wishlist');
        break;
      case 'about':
        navigate('/about');
        break;
      case 'brand':
        if (param) {
          navigate(`/brand/${param}`);
        }
        break;
    }
    window.scrollTo(0, 0);
  };

  const getCurrentPage = (): string => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path.startsWith('/products')) return 'products';
    if (path.startsWith('/product/')) return 'product';
    if (path === '/cart') return 'cart';
    if (path === '/wishlist') return 'wishlist';
    if (path === '/about') return 'about';
    if (path.startsWith('/brand/')) return 'brand';
    return 'home';
  };

  return (
    <ThemeProvider>
      <WishlistProvider>
        <CartProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <Header
              onNavigate={handleNavigate}
              currentPage={getCurrentPage()}
              onSearch={(query) => navigate(`/products?search=${encodeURIComponent(query)}`)}
              onCategorySelect={(url) => navigate(`/products?category=${encodeURIComponent(url)}`)}
            />

            <Routes>
              <Route path="/" element={<HomePage onNavigate={handleNavigate} />} />
              <Route path="/products" element={<ProductsPage onNavigate={handleNavigate} />} />
              <Route path="/product/:productId" element={<ProductDetailPage onNavigate={handleNavigate} />} />
              <Route path="/cart" element={<CartPage onNavigate={handleNavigate} />} />
              <Route path="/wishlist" element={<WishlistPage onNavigate={handleNavigate} />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/brand/:brandSlug" element={<BrandProductsPage onNavigate={handleNavigate} />} />
            </Routes>

            <Toaster
              position="top-center"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#fff',
                  color: '#DB2777',
                  padding: '16px',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                  border: '2px solid #DB2777',
                },
                success: {
                  iconTheme: {
                    primary: '#DB2777',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </CartProvider>
      </WishlistProvider>
    </ThemeProvider>
  );
}

export default App;
