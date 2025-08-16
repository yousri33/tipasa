'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Star, 
  Zap, 
  Award, 
  Truck, 
  RotateCcw, 
  Shield, 
  Clock 
} from 'lucide-react';
import OrderModal, { OrderData } from '@/components/OrderModal';
import { toast } from '@/components/ui/toast';
import type { Product } from '@/lib/airtable';

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const handleOrderSubmit = async (orderData: OrderData) => {
    try {
      const loadingToast = toast.loading('جاري إرسال الطلب... / Submitting order...');
      
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...orderData,
          productId: product.id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit order');
      }

      toast.dismiss(loadingToast);
      toast.success('🎉 تم إرسال طلبك بنجاح! سنتواصل معك قريباً / Order submitted successfully! We will contact you soon.', { duration: 6000 });
      setIsOrderModalOpen(false);
    } catch (error) {
      console.error('Order submission failed:', error);
      toast.error('❌ فشل في إرسال الطلب. يرجى المحاولة مرة أخرى / Failed to submit order. Please try again.', { duration: 5000 });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-rose-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-200/30 to-rose-200/30 rounded-full blur-3xl"></div>
      </div>
      
      {/* Back button */}
      <div className="relative z-10 container mx-auto px-4 pt-6">
        <Link href="/products">
          <Button variant="ghost" className="mb-6 hover:bg-white/50 backdrop-blur-sm transition-all duration-300 group">
            <ArrowLeft className="ml-2 h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
            العودة للمنتجات
          </Button>
        </Link>
      </div>

      <div className="relative z-10 container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Product Images */}
          <div className="space-y-6">
            <div className="aspect-square bg-gradient-to-br from-white to-gray-50 rounded-3xl overflow-hidden relative group shadow-2xl border border-white/20">
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700 ease-out"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl bg-gradient-to-br from-rose-100 to-purple-100">
                  <span className="animate-pulse">👗</span>
                </div>
              )}
              
              {/* Floating action buttons */}
              <div className="absolute top-6 right-6 flex flex-col gap-3">
                <Button size="sm" className="bg-white/90 backdrop-blur-md hover:bg-white shadow-lg border-0 text-gray-700 hover:text-rose-600 transition-all duration-300 rounded-full w-12 h-12 p-0 group">
                  <Heart className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                </Button>
                <Button size="sm" className="bg-white/90 backdrop-blur-md hover:bg-white shadow-lg border-0 text-gray-700 hover:text-purple-600 transition-all duration-300 rounded-full w-12 h-12 p-0 group">
                  <Share2 className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                </Button>
              </div>
              
              {/* Sale badge */}
              <div className="absolute top-6 left-6">
                <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 text-sm font-bold shadow-lg animate-pulse">
                  خصم 20%
                </Badge>
              </div>
            </div>
                
            {/* Additional product images if available */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-3 gap-4">
                {product.images.slice(1, 4).map((img, index) => (
                  <div key={index} className="aspect-square bg-gradient-to-br from-white to-gray-50 rounded-2xl overflow-hidden shadow-lg border border-white/20 group cursor-pointer">
                    <img 
                      src={img} 
                      alt={`${product.name} ${index + 2}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500 ease-out"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-rose-500 text-white px-4 py-2 text-sm font-semibold shadow-lg">
                {product.category}
              </Badge>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6 leading-tight">
                {product.name}
              </h1>
                  
              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-6 w-6 fill-yellow-400 text-yellow-400 drop-shadow-sm animate-pulse"
                      style={{ animationDelay: `${star * 0.1}s` }}
                    />
                  ))}
                </div>
                <span className="text-lg font-medium text-gray-700 bg-yellow-50 px-3 py-1 rounded-full">
                  4.8 • 124 تقييم
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-6 mb-8">
                <div className="flex flex-col">
                  <span className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'DZD',
                      minimumFractionDigits: 0,
                    }).format(product.price)}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'DZD',
                      minimumFractionDigits: 0,
                    }).format(product.price * 1.25)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-orange-500" />
                  <span className="text-sm font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                    وفر 25%
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="bg-gradient-to-r from-gray-50 to-purple-50 rounded-2xl p-6 mb-8">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {product.description}
                </p>
              </div>

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-rose-500 to-purple-500 rounded-full"></div>
                    الألوان المتاحة
                  </h3>
                  <div className="flex gap-3 flex-wrap">
                    {product.colors.map((color, index) => (
                      <Badge 
                        key={index} 
                        className="px-4 py-2 bg-white border-2 border-gray-200 text-gray-700 hover:border-rose-300 hover:bg-rose-50 transition-all duration-300 cursor-pointer transform hover:scale-105 shadow-sm"
                      >
                        {color}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* SKU */}
              {product.sku && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-full w-fit">
                    <Award className="h-4 w-4" />
                    <span>رقم المنتج: {product.sku}</span>
                  </div>
                </div>
              )}

              {/* Stock Status */}
              <div className="flex items-center gap-3 mb-8">
                <div className={`w-4 h-4 rounded-full animate-pulse ${
                  product.stock > 0 ? 'bg-green-500 shadow-green-200 shadow-lg' : 'bg-red-500 shadow-red-200 shadow-lg'
                }`} />
                <span className={`text-lg font-semibold px-4 py-2 rounded-full ${
                  product.stock > 0 
                    ? 'text-green-700 bg-green-50 border border-green-200' 
                    : 'text-red-700 bg-red-50 border border-red-200'
                }`}>
                  {product.stock > 0 ? `متوفر (${product.stock} قطعة)` : 'نفد المخزون'}
                </span>
              </div>

              {/* Action Button */}
              <div className="mb-10">
                <Button 
                  onClick={() => setIsOrderModalOpen(true)}
                  className="w-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white py-4 text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={product.stock === 0}
                >
                  <Zap className="ml-3 h-6 w-6" />
                  {product.stock > 0 ? 'اشتري الآن' : 'نفد المخزون'}
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-rose-500 to-purple-500 rounded-full"></div>
                مميزات المنتج
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 group hover:shadow-lg transition-all duration-300">
                  <div className="bg-green-500 p-3 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Truck className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-lg font-medium text-gray-800">توصيل إلى 58 ولاية / Delivery to 58 wilayas</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-100 group hover:shadow-lg transition-all duration-300">
                  <div className="bg-blue-500 p-3 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <RotateCcw className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-lg font-medium text-gray-800">إمكانية الإرجاع خلال 30 يوم</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100 group hover:shadow-lg transition-all duration-300">
                  <div className="bg-purple-500 p-3 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-lg font-medium text-gray-800">ضمان الجودة والأصالة</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl border border-orange-100 group hover:shadow-lg transition-all duration-300">
                  <div className="bg-orange-500 p-3 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-lg font-medium text-gray-800">توصيل سريع خلال 24-48 ساعة</span>
                </div>
              </div>
            </div>
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
           image: product.image || ''
         }}
        onSubmit={handleOrderSubmit}
      />
    </div>
  );
}