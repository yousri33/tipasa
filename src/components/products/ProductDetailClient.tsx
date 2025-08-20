'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Heart, Star, Truck, Shield, RotateCcw, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/lib/types';
import { formatPrice, getCategoryLabel } from '@/lib/utils';
import OrderModal, { OrderData } from '../orders/OrderModal';
import Link from 'next/link';
import { toast } from '@/components/ui/toast';

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedSize, setSelectedSize] = useState(product.size || '');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isBackLoading, setIsBackLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  
  // Get all images (main image + additional images) without duplicates
  const allImages = (() => {
    const images = product.images || [];
    if (product.image && !images.includes(product.image)) {
      return [product.image, ...images];
    }
    return images.length > 0 ? images : (product.image ? [product.image] : []);
  })();
  
  const handlePreviousImage = () => {
    if (isTransitioning || allImages.length <= 1) return;
    setIsTransitioning(true);
    setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 500);
  };
  
  const handleNextImage = () => {
    if (isTransitioning || allImages.length <= 1) return;
    setIsTransitioning(true);
    setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 500);
  };
  
  const handleImageClick = (index: number) => {
    if (isTransitioning || index === currentImageIndex) return;
    setIsTransitioning(true);
    setCurrentImageIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };
  
  // Touch handlers for swipe functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };
  
  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe && allImages.length > 1) {
      handleNextImage();
    }
    if (isRightSwipe && allImages.length > 1) {
      handlePreviousImage();
    }
    
    // Reset touch positions
    touchStartX.current = 0;
    touchEndX.current = 0;
  };
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (allImages.length <= 1) return;
      
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          handlePreviousImage();
          break;
        case 'ArrowRight':
          event.preventDefault();
          handleNextImage();
          break;
        case 'Home':
          event.preventDefault();
          setCurrentImageIndex(0);
          break;
        case 'End':
          event.preventDefault();
          setCurrentImageIndex(allImages.length - 1);
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [allImages.length]);

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const features = [
    { icon: Shield, title: 'جودة عالية', description: 'منسوجات ممتازة تدوم طويلاً' },
    { icon: Truck, title: 'شحن مجاني', description: 'للطلبات فوق 7000 دينار' },
    { icon: RotateCcw, title: 'إرجاع سهل', description: '30 يوم لاسترجاع المنتج' }
  ];

  const handleOrderNow = () => {
    setIsLoading(true);
    // Simulate loading before opening modal
    setTimeout(() => {
      setIsLoading(false);
      setIsOrderModalOpen(true);
    }, 800);
  };

  const handleOrderSubmit = async (orderData: OrderData) => {
    try {
      // Make sure we're using a valid size value that matches the SIZES array in OrderModal
      // The SIZES array in OrderModal has values like 'S', 'M', 'L', 'XL', 'XXL'
      // But our selectedSize might be different, so we need to ensure compatibility
      // If selectedSize is an array, use the first size or the orderData.size value
      const sizeValue = Array.isArray(selectedSize) ? orderData.size : selectedSize;
      
      console.log('Submitting order with size:', sizeValue);
      
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...orderData,
          productId: product.id,
          size: sizeValue // Use the standardized size value
        }),
      });

      if (!response.ok) {
        // Try to get the error data from the response
        const errorData = await response.json().catch(() => ({
          error: 'Failed to parse error response'
        }));
        console.error('Order submission error:', errorData);
        throw new Error(`Failed to submit order: ${JSON.stringify(errorData)}`);
      }

      // Get the order ID from the response
      const responseData = await response.json();
      const orderId = responseData.orderId || Math.random().toString(36).substr(2, 9).toUpperCase();
      
      setIsOrderModalOpen(false);
      
      // Show success toast with order ID
      toast.success(
        `تم إرسال الطلب بنجاح! 🎉\nرقم الطلب: #${orderId}\nسنقوم بالتواصل معك قريباً لتأكيد الطلب`,
        { duration: 6000 }
      );
    } catch (error) {
      console.error('Error submitting order:', error);
      
      // Show error toast with more details
      toast.error(
        'حدث خطأ في إرسال الطلب. يرجى المحاولة مرة أخرى.\nإذا استمرت المشكلة، يرجى التواصل معنا مباشرة.',
        { duration: 5000 }
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            className="text-gray-600 hover:text-gray-900 transition-transform duration-200 active:scale-95 hover:scale-105"
            onClick={() => {
              setIsBackLoading(true);
              // Simulate loading delay before navigation
              setTimeout(() => {
                window.location.href = '/products';
              }, 500);
            }}
            disabled={isBackLoading}
          >
            {isBackLoading ? (
              <Loader2 className="h-4 w-4 ml-2 animate-spin" />
            ) : (
              <ArrowLeft className="h-4 w-4 ml-2" />
            )}
            العودة للمنتجات
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image Display */}
            <div 
              className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-xl touch-pan-y"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {allImages.length > 0 ? (
                <div className="relative w-full h-full">
                  <Image
                    src={allImages[currentImageIndex]}
                    alt={`${product.name} - ${currentImageIndex + 1}`}
                    fill
                    className={`object-cover transition-all duration-500 ease-out transform ${
                      isTransitioning 
                        ? 'scale-110 opacity-70 rotate-1 blur-sm' 
                        : 'scale-100 opacity-100 rotate-0 blur-0 hover:scale-105'
                    }`}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={currentImageIndex === 0}
                  />
                  {/* Dynamic swipe indicators for mobile */}
                  {allImages.length > 1 && (
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 md:hidden">
                      <div className="flex space-x-1 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5">
                        {allImages.map((_, index) => (
                          <div
                            key={index}
                            className={`w-2 h-2 rounded-full transition-all duration-500 ease-out ${
                              index === currentImageIndex 
                                ? 'bg-white scale-150 shadow-lg shadow-white/50' 
                                : 'bg-white/50 hover:bg-white/70 hover:scale-110'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Swipe gesture hint */}
                  {allImages.length > 1 && (
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 md:hidden">
                      <div className="flex items-center space-x-2 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs">
                        <span>👈</span>
                        <span>اسحب</span>
                        <span>👉</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <span className="text-gray-400 text-lg">لا توجد صورة</span>
                </div>
              )}
              
              {/* Navigation Arrows - Hidden on mobile, visible on desktop */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={handlePreviousImage}
                    disabled={isTransitioning}
                    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 md:p-3 rounded-full shadow-lg hover:bg-white hover:scale-125 hover:shadow-xl active:scale-95 transition-all duration-300 ease-out disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 hidden md:flex items-center justify-center group"
                    aria-label="الصورة السابقة"
                  >
                    <ChevronLeft className="h-4 w-4 md:h-5 md:w-5 text-gray-700 group-hover:text-purple-600 transition-colors duration-300" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    disabled={isTransitioning}
                    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 md:p-3 rounded-full shadow-lg hover:bg-white hover:scale-125 hover:shadow-xl active:scale-95 transition-all duration-300 ease-out disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 hidden md:flex items-center justify-center group"
                    aria-label="الصورة التالية"
                  >
                    <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-gray-700 group-hover:text-purple-600 transition-colors duration-300" />
                  </button>
                </>
              )}
              

              
              {/* Wishlist Button */}
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-300"
                aria-label={isWishlisted ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'text-rose-500 fill-current' : 'text-gray-700'}`} />
              </button>

              {/* Stock Badge */}
              {product.stock <= 5 && product.stock > 0 && (
                <Badge className="absolute top-4 left-4 bg-orange-500 hover:bg-orange-600 text-white border-0 animate-pulse">
                  {product.stock} متبقي
                </Badge>
              )}
              
              {product.stock === 0 && (
                <Badge className="absolute top-4 left-4 bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white border-0 shadow-xl backdrop-blur-sm px-4 py-2 text-sm font-bold rounded-full animate-pulse hover:animate-none hover:scale-105 transition-all duration-300 ring-2 ring-red-300/50">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                    نفد المخزون
                  </span>
                </Badge>
              )}
            </div>

            {/* Image Thumbnails - Horizontal Scroll */}
            {allImages.length > 1 && (
              <div className="relative">
                <div className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide pb-2 px-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {allImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => handleImageClick(index)}
                      disabled={isTransitioning}
                      className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 bg-white rounded-lg md:rounded-xl overflow-hidden shadow-md transition-all duration-500 ease-out disabled:opacity-30 disabled:cursor-not-allowed group ${
                        index === currentImageIndex 
                          ? 'ring-3 ring-purple-500 ring-offset-2 scale-110 shadow-xl shadow-purple-500/25' 
                          : 'hover:scale-110 hover:shadow-xl hover:ring-2 hover:ring-purple-300 hover:ring-offset-1 active:scale-95'
                      }`}
                      aria-label={`عرض الصورة ${index + 1}`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} - ${index + 1}`}
                        fill
                        className={`object-cover transition-all duration-500 ease-out group-hover:scale-105 ${
                          index === currentImageIndex ? 'opacity-100 scale-105' : 'opacity-75 hover:opacity-100'
                        }`}
                        sizes="(max-width: 768px) 64px, 80px"
                      />
                      {/* Active indicator */}
                      {index === currentImageIndex && (
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-purple-500/20 border-2 border-purple-500 rounded-lg md:rounded-xl animate-pulse"></div>
                      )}
                    </button>
                  ))}
                </div>
                
                {/* Enhanced mobile swipe hint */}
                {allImages.length > 1 && (
                  <div className="md:hidden mt-3 text-center">
                    <div className="flex items-center justify-center space-x-2 text-gray-500">
                      <div className="flex items-center space-x-1">
                        <span className="text-lg">👆</span>
                        <span className="text-xs">اضغط</span>
                      </div>
                      <span className="text-xs">أو</span>
                      <div className="flex items-center space-x-1">
                        <span className="text-lg">👈👉</span>
                        <span className="text-xs">اسحب لتغيير الصورة</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="secondary" className="text-sm">
                  {getCategoryLabel(product.category)}
                </Badge>
                {product.sku && (
                  <Badge variant="outline" className="text-xs font-mono">
                    SKU: {product.sku}
                  </Badge>
                )}
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <p className="text-xl text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-purple-600">{formatPrice(product.price)}</span>
              {product.stock > 0 && (
                <span className="text-green-600 text-lg">متوفر</span>
              )}
            </div>



            {/* Colors */}
            {product.colors && product.colors.length > 1 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">الألوان المتاحة</h3>
                <div className="flex gap-3">
                  {product.colors.map((color, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 rounded-full border-2 border-white shadow-md hover:scale-125 transition-transform duration-200"
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={handleOrderNow}
                disabled={product.stock === 0 || isLoading}
                className="flex-1 bg-gradient-to-r from-purple-500 to-rose-600 hover:from-purple-600 hover:to-rose-700 text-white py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 ml-2 animate-spin" />
                    جاري التحميل...
                  </>
                ) : (
                  <>
                    <Star className="h-5 w-5 ml-2" />
                    اطلبي الآن
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 hover:border-purple-500 hover:text-purple-600 rounded-xl transition-all duration-300"
              >
                <Heart className="h-5 w-5 ml-2" />
                المفضلة
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-gray-200">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <feature.icon className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Modal */}
        <OrderModal
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
          product={{
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image || '/placeholder-image.svg'
          }}
          onSubmit={handleOrderSubmit}
        />
      </div>
    </div>
  );
}