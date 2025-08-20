'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Sparkles, Loader2, Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { formatPrice, getCategoryLabel } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ 
  product
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <div 
      className="group relative"

    >
      <Card className="relative overflow-hidden bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-700 hover:-translate-y-3 hover:rotate-1">
        {/* Animated gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br from-rose-50 via-purple-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
        
        {/* Floating sparkles effect */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
          <Sparkles className="h-5 w-5 text-purple-400 animate-pulse" />
        </div>
        
        {/* Content */}
        <div className="relative z-10">
        {/* Modern Image Section */}
        <CardContent className="p-0">
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-3xl">
            {/* Image overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
            
            {product.image ? (
              <Image 
                src={product.image} 
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-all duration-700 ease-out filter group-hover:brightness-110"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-2 bg-gray-200 rounded-full flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-gray-400" />
                  </div>
                  <span className="text-gray-400 text-sm">لا توجد صورة</span>
                </div>
              </div>
            )}
            
            {/* Modern badges and controls */}
            <div className="absolute inset-0 z-20">
              {/* Stock badges */}
              {product.stock <= 5 && product.stock > 0 && (
                <Badge className="absolute top-4 right-4 bg-gradient-to-r from-orange-400 to-red-500 text-white border-0 shadow-lg backdrop-blur-sm animate-pulse px-3 py-1 text-xs font-medium">
                  {product.stock} متبقي
                </Badge>
              )}
              
              {product.stock === 0 && (
                <Badge className="absolute top-4 right-4 bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white border-0 shadow-xl backdrop-blur-sm px-4 py-2 text-sm font-bold rounded-full animate-pulse hover:animate-none hover:scale-105 transition-all duration-300 ring-2 ring-red-300/50">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                    نفد المخزون
                  </span>
                </Badge>
              )}
              
              {/* Category badge */}
              <Badge className="absolute top-4 left-4 bg-white/95 text-gray-800 border-0 backdrop-blur-md hover:bg-white transition-all duration-300 shadow-md px-3 py-1 text-xs font-medium">
                {getCategoryLabel(product.category)}
              </Badge>
              
              {/* Wishlist button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsWishlisted(!isWishlisted);
                }}
                className={`absolute bottom-4 right-4 p-3 rounded-full shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 ${
                  isWishlisted 
                    ? 'bg-rose-500 text-white' 
                    : 'bg-white/95 text-gray-700 hover:bg-white'
                }`}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </CardContent>
        
        {/* Modern Product Info */}
        <CardFooter className="p-6 space-y-4">
          <div className="w-full">
            {/* Product title and description */}
            <div className="space-y-2 mb-4">
              <h3 className="font-bold text-xl text-gray-900 group-hover:text-purple-600 transition-colors duration-300 line-clamp-1 leading-tight">
                {product.name}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                {product.description}
              </p>
            </div>
            
            {/* Price and details */}
            <div className="flex items-end justify-between mb-4">
              <div className="space-y-1">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-rose-600 bg-clip-text text-transparent group-hover:from-purple-700 group-hover:to-rose-700 transition-all duration-300">
                  {formatPrice(product.price)}
                </div>
                {product.size && (
                  <div className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300 flex items-center gap-1">
                    <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                    المقاس: {product.size}
                  </div>
                )}
              </div>
              
              {/* Modern color display */}
              {product.colors && product.colors.length > 0 && (
                <div className="flex flex-col items-end gap-2">
                  <span className="text-xs text-gray-500 font-medium">الألوان المتاحة</span>
                  <div className="flex gap-2">
                    {product.colors.slice(0, 3).map((color, index) => (
                      <div
                        key={index}
                        className="w-6 h-6 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform duration-200 cursor-pointer"
                        style={{ backgroundColor: color.toLowerCase() }}
                        title={color}
                      />
                    ))}
                    {product.colors.length > 3 && (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-white shadow-md flex items-center justify-center hover:scale-110 transition-transform duration-200 cursor-pointer">
                        <span className="text-xs text-gray-600 font-bold">+{product.colors.length - 3}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Modern action button */}
            <div className="pt-2">
              <Link href={`/products/${product.id}`} className="block">
                <button
                  disabled={isLoading}
                  onClick={() => {
                    if (!isLoading) {
                      setIsLoading(true);
                      // Simulate loading for navigation
                      setTimeout(() => setIsLoading(false), 1500);
                    }
                  }}
                  className={`w-full relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 hover:from-purple-700 hover:via-purple-800 hover:to-indigo-700 text-white py-4 px-6 rounded-2xl font-bold transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-purple-500/30 hover:scale-[1.03] border border-purple-400/30 backdrop-blur-sm disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none group`}
                >
                  {/* Animated background overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                  
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400/20 to-indigo-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative flex items-center justify-center gap-2.5">
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span className="text-lg tracking-wide">جاري التحميل...</span>
                      </>
                    ) : (
                      <>
                        <Eye className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                        <span className="text-lg tracking-wide">عرض المنتج</span>
                      </>
                    )}
                  </div>
                </button>
              </Link>
            </div>
          </div>
        </CardFooter>
        </div>
      </Card>
    </div>
  );
}