import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Heart, Package, Shield, Star, Share2, ChevronLeft, ChevronRight, X, Facebook, MessageCircle, Minus, Plus, CheckCircle } from 'lucide-react';
import { api, JumiaProduct, JumiaProductDetails, ProductReviews } from '../services/api';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

interface ProductDetailPageProps {
  onNavigate: (page: string, slug?: string) => void;
}

export default function ProductDetailPage({ onNavigate }: ProductDetailPageProps) {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<JumiaProductDetails | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<JumiaProduct[]>([]);
  const [reviews, setReviews] = useState<ProductReviews | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState<string>('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [reviewsPage, setReviewsPage] = useState(1);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const [productSlug, setProductSlug] = useState('');

  useEffect(() => {
    if (productId) {
      // Decode the slug
      const slug = decodeURIComponent(productId);
      setProductSlug(slug);
      loadProduct(slug);
    }
  }, [productId]);

  useEffect(() => {
    if (product) {
      loadRelatedProducts();
      if (product.sku) {
        loadReviews(product.sku, 1);
      }
    }
  }, [product]);

  const loadProduct = async (slug: string) => {
    setLoading(true);
    try {
      const data = await api.getProductDetails(slug);
      setProduct(data);
      if (data.variations.length > 0) {
        const firstAvailable = data.variations.find(v => v.available);
        if (firstAvailable) {
          setSelectedVariation(firstAvailable.value);
        }
      }
    } catch (err) {
      console.error('Error loading product:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedProducts = async () => {
    try {
      // Get random products from homepage
      const data = await api.getProducts();
      const shuffled = data.sort(() => 0.5 - Math.random());
      setRelatedProducts(shuffled.slice(0, 12));
    } catch (err) {
      console.error('Error loading related products:', err);
    }
  };

  const loadReviews = async (sku: string, page: number) => {
    setLoadingReviews(true);
    try {
      const data = await api.getProductReviews(sku, page);
      setReviews(data);
      setReviewsPage(page);
      
      // Scroll to reviews section after loading (except for initial load)
      if (page > 1 && reviewsRef.current) {
        reviewsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (err) {
      console.error('Error loading reviews:', err);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    if (isInWishlist(product.productId)) {
      removeFromWishlist(product.productId);
    } else {
      addToWishlist(product as JumiaProduct);
    }
  };

  const handleShare = (platform?: string) => {
    const shareUrl = window.location.href;
    const shareText = `Check out ${product?.title} on 1Store`;

    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    } else if (navigator.share) {
      navigator.share({
        title: product?.title,
        text: shareText,
        url: shareUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
    setShowShareModal(false);
  };

  const handleBrandClick = () => {
    if (product?.brand) {
      const brandSlug = product.brand.toLowerCase().replace(/\s+/g, '-');
      onNavigate('brand', brandSlug);
    }
  };

  const scrollRelated = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const nextImage = () => {
    if (product) {
      setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product) {
      setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ));
  };

  const formatDescription = (html: string) => {
    // Parse HTML and format it properly
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.innerHTML;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 sm:p-8">
              <div className="space-y-4">
                <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                <div className="grid grid-cols-6 gap-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Product not found</h2>
          <button
            onClick={() => onNavigate('products')}
            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
          >
            Back to products
          </button>
        </div>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.productId);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => onNavigate('products')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-8 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Products
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 sm:p-8">
            {/* Images */}
            <div className="space-y-4">
              <div 
                className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden cursor-pointer relative group"
                onClick={() => setShowImageModal(true)}
              >
                <img
                  src={product.images[selectedImageIndex]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                {/* Diagonal Watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="transform rotate-[-45deg] text-white/30 dark:text-white/20 text-4xl font-bold whitespace-nowrap">
                    1Store.com.ng
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-6 gap-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 ${
                        selectedImageIndex === idx
                          ? 'border-primary-600'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <img src={img} alt={`${product.title} ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white pr-4">{product.title}</h1>
                  <button
                    onClick={handleWishlistToggle}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors flex-shrink-0"
                  >
                    <Heart
                      className={`h-6 w-6 ${inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-400'}`}
                    />
                  </button>
                </div>

                {product.brand && !product.brand.includes('07006000000') && !product.brand.toLowerCase().includes('call') && (
                  <button
                    onClick={handleBrandClick}
                    className="text-primary-600 dark:text-primary-400 hover:underline mb-4 inline-block"
                  >
                    Brand: {product.brand}
                  </button>
                )}

                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-3xl sm:text-4xl font-bold text-primary-600 dark:text-primary-400">
                    {formatPrice(product.price)}
                  </span>
                  {product.oldPrice && product.oldPrice > product.price && (
                    <>
                      <span className="text-xl text-gray-400 dark:text-gray-500 line-through">
                        {formatPrice(product.oldPrice)}
                      </span>
                      {product.discount && (
                        <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                          {product.discount}
                        </span>
                      )}
                    </>
                  )}
                </div>

                {product.rating && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      {renderStars(product.rating)}
                    </div>
                    <span className="text-gray-600 dark:text-gray-400">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>
                )}

                {/* Description */}
                <div 
                  className="text-gray-700 dark:text-gray-300 leading-relaxed prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: formatDescription(product.descriptionHtml || product.description) }}
                />
              </div>

              {/* Variations */}
              {product.variations.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Select Size/Variation:</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {product.variations.map((variation) => (
                      <div key={variation.value} className="relative">
                        <button
                          onClick={() => variation.available && setSelectedVariation(variation.value)}
                          disabled={!variation.available}
                          className={`w-full px-4 py-2 border-2 rounded-lg font-medium transition-colors text-sm ${
                            selectedVariation === variation.value
                              ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                              : variation.available
                              ? 'border-gray-300 dark:border-gray-600 hover:border-primary-600 text-gray-700 dark:text-gray-300'
                              : 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {variation.name}
                        </button>
                        {variation.stockQuantity && variation.stockQuantity <= 10 && variation.available && (
                          <span className={`absolute -top-2 -right-2 text-xs px-2 py-0.5 rounded-full ${
                            variation.stockQuantity <= 5 ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'
                          }`}>
                            {variation.stockQuantity}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  {selectedVariation && product.variations.find(v => v.value === selectedVariation)?.stockQuantity && (
                    <p className="text-sm text-orange-600 dark:text-orange-400 mt-2">
                      {product.variations.find(v => v.value === selectedVariation)!.stockQuantity! <= 5 
                        ? `Only ${product.variations.find(v => v.value === selectedVariation)!.stockQuantity} units left!`
                        : `${product.variations.find(v => v.value === selectedVariation)!.stockQuantity} units available`
                      }
                    </p>
                  )}
                </div>
              )}

              {/* Features */}
              <div className="border-t border-b border-gray-200 dark:border-gray-700 py-6 space-y-4">
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <Package className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  <span>{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <Shield className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  <span>Secure payment & buyer protection</span>
                </div>
              </div>

              {/* Quantity Selector */}
              {product.inStock && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Quantity:</span>
                    <div className="flex items-center border-2 border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-6 py-2 font-semibold text-gray-900 dark:text-white min-w-[60px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {product.inStock && (
                <div className="flex gap-3">
                  <button
                    disabled={product.variations.length > 0 && !selectedVariation}
                    onClick={() => {
                      // Find the selected variation to get stock info
                      const selectedVar = product.variations.find(v => v.value === selectedVariation);
                      const variationName = selectedVar?.name || selectedVariation;
                      const maxQty = selectedVar?.stockQuantity || product.stockQuantity || 99;
                      
                      // Convert Jumia product to cart product format
                      const cartProduct = {
                        id: product.productId,
                        name: product.title,
                        slug: product.productId,
                        description: product.description,
                        price: selectedVar?.price || product.price,
                        compare_at_price: product.oldPrice || undefined,
                        image_url: product.images[0],
                        images: product.images,
                        in_stock: product.inStock,
                        stock_quantity: maxQty,
                        featured: false,
                        created_at: new Date().toISOString(),
                      };
                      
                      addToCart(
                        cartProduct, 
                        quantity, 
                        variationName, 
                        product.images[0], 
                        productSlug,
                        maxQty
                      );
                      
                      const message = variationName 
                        ? `Added ${quantity} ${variationName} to cart!`
                        : `Added ${quantity} item(s) to cart!`;
                      
                      toast.success(message + ' We will process your order and deliver to you.', {
                        icon: '🛒',
                        duration: 4000,
                        style: {
                          background: '#fff',
                          color: '#DB2777',
                          border: '2px solid #DB2777',
                        },
                        iconTheme: {
                          primary: '#DB2777',
                          secondary: '#fff',
                        },
                      });
                      setQuantity(1); // Reset quantity after adding
                    }}
                    className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {product.variations.length > 0 && !selectedVariation
                      ? 'Select a variation'
                      : 'Add to Cart'}
                  </button>
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="p-4 border-2 border-primary-600 text-primary-600 dark:text-primary-400 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
                  >
                    <Share2 className="h-6 w-6" />
                  </button>
                </div>
              )}

              {/* Key Features */}
              {product.keyFeatures && product.keyFeatures.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Key Features:</h3>
                  <ul className="space-y-2">
                    {product.keyFeatures.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-700 dark:text-gray-300 text-sm">
                        <span className="text-primary-600 dark:text-primary-400 mt-1">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Specifications */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Specifications:</h3>
                  <dl className="grid grid-cols-1 gap-2">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700 text-sm">
                        <dt className="text-gray-600 dark:text-gray-400">{key}:</dt>
                        <dd className="text-gray-900 dark:text-white font-medium">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* You May Also Like */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                You May Also Like
              </h2>
              <div className="hidden md:flex gap-2">
                <button
                  onClick={() => scrollRelated('left')}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => scrollRelated('right')}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div
              ref={scrollContainerRef}
              className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
            >
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.productId} className="flex-shrink-0 w-[45%] sm:w-[30%] md:w-[23%] lg:w-[18%] snap-start">
                  <ProductCard
                    product={relatedProduct}
                    onViewDetails={(slug) => onNavigate('product', slug)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Customer Reviews */}
        {reviews && reviews.totalRatings > 0 && (
          <div ref={reviewsRef} className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Customer Reviews
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Rating Summary */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 text-center">
                  <div className="text-5xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                    {reviews.overallRating?.toFixed(1)}
                  </div>
                  <div className="flex items-center justify-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(reviews.overallRating || 0)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {reviews.totalRatings} verified ratings
                  </p>
                </div>

                {/* Rating Distribution */}
                <div className="mt-6 space-y-2">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count = reviews.ratingDistribution[stars] || 0;
                    const percentage = reviews.totalRatings > 0 
                      ? (count / reviews.totalRatings) * 100 
                      : 0;
                    
                    return (
                      <div key={stars} className="flex items-center gap-2 text-sm">
                        <span className="w-3 text-gray-600 dark:text-gray-400">{stars}</span>
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-400"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="w-12 text-right text-gray-600 dark:text-gray-400">
                          ({count})
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reviews List */}
              <div className="lg:col-span-2">
                {loadingReviews ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="flex gap-1 mb-2">
                          {[...Array(5)].map((_, j) => (
                            <div key={j} className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                          ))}
                        </div>
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.reviews.map((review, index) => (
                      <div
                        key={index}
                        className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0"
                      >
                        <div className="flex items-center gap-1 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300 dark:text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                        <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                          {review.title}
                        </h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                          {review.comment}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                          <div>
                            <span className="mr-2">{review.date}</span>
                            <span>by {review.author}</span>
                          </div>
                          {review.verified && (
                            <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                              <CheckCircle className="h-3 w-3" />
                              <span className="hidden sm:inline">Verified</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {!loadingReviews && reviews.totalPages > 1 && (
                  <div className="flex justify-center gap-2 pt-4">
                    <button
                      onClick={() => product?.sku && loadReviews(product.sku, reviewsPage - 1)}
                      disabled={reviewsPage === 1}
                      className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300">
                      Page {reviewsPage} of {reviews.totalPages}
                    </span>
                    <button
                      onClick={() => product?.sku && loadReviews(product.sku, reviewsPage + 1)}
                      disabled={!reviews.hasMore}
                      className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          <button
            onClick={prevImage}
            className="absolute left-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
          <div className="relative max-w-4xl w-full">
            <div className="relative">
              <img
                src={product.images[selectedImageIndex]}
                alt={product.title}
                className="w-full h-auto rounded-lg"
              />
              {/* Diagonal Watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="transform rotate-[-45deg] text-white/40 text-6xl font-bold whitespace-nowrap">
                  1Store.com.ng
                </div>
              </div>
            </div>
            <div className="text-white text-center mt-4 text-lg">
              {selectedImageIndex + 1} / {product.images.length}
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowShareModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Share Product</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => handleShare('whatsapp')}
                className="w-full flex items-center gap-3 p-4 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors"
              >
                <MessageCircle className="h-6 w-6" />
                <span className="font-medium">Share on WhatsApp</span>
              </button>
              <button
                onClick={() => handleShare('facebook')}
                className="w-full flex items-center gap-3 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
              >
                <Facebook className="h-6 w-6" />
                <span className="font-medium">Share on Facebook</span>
              </button>
              <button
                onClick={() => handleShare()}
                className="w-full flex items-center gap-3 p-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-xl transition-colors"
              >
                <Share2 className="h-6 w-6" />
                <span className="font-medium">More Options</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
