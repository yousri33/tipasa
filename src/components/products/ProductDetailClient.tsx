'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Heart, Star, Truck, Shield, RotateCcw } from 'lucide-react';
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

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const features = [
    { icon: Shield, title: 'جودة عالية', description: 'منسوجات ممتازة تدوم طويلاً' },
    { icon: Truck, title: 'شحن مجاني', description: 'للطلبات فوق 5000 دينار' },
    { icon: RotateCcw, title: 'إرجاع سهل', description: '30 يوم لاسترجاع المنتج' }
  ];

  const handleOrderNow = () => {
    setIsOrderModalOpen(true);
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
          <Link href="/products">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4 ml-2" />
              العودة للمنتجات
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-xl">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <span className="text-gray-400 text-lg">لا توجد صورة</span>
                </div>
              )}
              
              {/* Wishlist Button */}
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-300"
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
                <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600 text-white border-0">
                  نفد المخزون
                </Badge>
              )}
            </div>

            {/* Additional Images */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(0, 4).map((image, index) => (
                  <div key={index} className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-md">
                    <Image
                      src={image}
                      alt={`${product.name} - ${index + 1}`}
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 768px) 25vw, 12.5vw"
                    />
                  </div>
                ))}
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
                disabled={product.stock === 0}
                className="flex-1 bg-gradient-to-r from-purple-500 to-rose-600 hover:from-purple-600 hover:to-rose-700 text-white py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Star className="h-5 w-5 ml-2" />
                اطلبي الآن
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