'use client';

import { useState, useMemo, useCallback } from 'react';
import { Product } from '@/lib/airtable';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Heart, ShoppingCart, Search, Filter, SortAsc } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import OrderModal, { OrderData } from './OrderModal';
import { toast } from '@/components/ui/toast';

// Types
type SortOption = 'name' | 'price-low' | 'price-high';
type CategoryOption = 'all' | 'Burkinis' | 'Hijabs' | 'Modest Wear' | 'Accessories';

interface ProductsClientProps {
  initialProducts: Product[];
}

interface FilterState {
  searchTerm: string;
  selectedCategory: CategoryOption;
  sortBy: SortOption;
}

// Constants
const CATEGORIES = [
  { value: 'all' as const, label: 'جميع المنتجات', icon: '🛍️' },
  { value: 'Burkinis' as const, label: 'البركيني', icon: '🏊‍♀️' },
  { value: 'Hijabs' as const, label: 'الحجاب', icon: '🧕' },
  { value: 'Modest Wear' as const, label: 'الملابس المحتشمة', icon: '👗' },
  { value: 'Accessories' as const, label: 'الإكسسوارات', icon: '💎' }
];

const SORT_OPTIONS = [
  { value: 'name' as const, label: 'الاسم', icon: '🔤' },
  { value: 'price-low' as const, label: 'السعر: من الأقل للأعلى', icon: '💰' },
  { value: 'price-high' as const, label: 'السعر: من الأعلى للأقل', icon: '💎' }
];

// Custom hooks
function useProductFilters(products: Product[], filters: FilterState) {
  return useMemo(() => {
    let filtered = [...products];

    // Filter by category
    if (filters.selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === filters.selectedCategory);
    }

    // Filter by search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
        default:
          return a.name.localeCompare(b.name, 'ar');
      }
    });

    return filtered;
  }, [products, filters]);
}

function useProductActions() {
  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 0
    }).format(price);
  }, []);

  const getCategoryLabel = useCallback((category: string) => {
    const categoryMap: Record<string, string> = {
      'Burkinis': 'بركيني',
      'Hijabs': 'حجاب',
      'Modest Wear': 'ملابس محتشمة',
      'Accessories': 'إكسسوارات'
    };
    return categoryMap[category] || category;
  }, []);

  return { formatPrice, getCategoryLabel };
}

// Components
function ProductFilters({ 
  filters, 
  onFiltersChange, 
  resultCount 
}: {
  filters: FilterState;
  onFiltersChange: (filters: Partial<FilterState>) => void;
  resultCount: number;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-900">تصفية المنتجات</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="ابحثي عن منتج..."
            value={filters.searchTerm}
            onChange={(e) => onFiltersChange({ searchTerm: e.target.value })}
            className="pr-10 border-gray-200 focus:border-rose-300 focus:ring-rose-200"
          />
        </div>

        {/* Category Filter */}
        <Select 
          value={filters.selectedCategory} 
          onValueChange={(value: CategoryOption) => onFiltersChange({ selectedCategory: value })}
        >
          <SelectTrigger className="border-gray-200 focus:border-rose-300 focus:ring-rose-200">
            <SelectValue placeholder="اختاري الفئة" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                <div className="flex items-center gap-2">
                  <span>{category.icon}</span>
                  <span>{category.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select 
          value={filters.sortBy} 
          onValueChange={(value: SortOption) => onFiltersChange({ sortBy: value })}
        >
          <SelectTrigger className="border-gray-200 focus:border-rose-300 focus:ring-rose-200">
            <SortAsc className="h-4 w-4 ml-2" />
            <SelectValue placeholder="ترتيب حسب" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  <span>{option.icon}</span>
                  <span>{option.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Results Count */}
        <div className="flex items-center justify-center md:justify-start bg-gray-50 rounded-lg px-4 py-2">
          <span className="text-gray-700 font-medium">
            {resultCount} منتج
          </span>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ 
  product, 
  onAddToCart, 
  formatPrice, 
  getCategoryLabel 
}: {
  product: Product;
  onAddToCart: (product: Product) => void;
  formatPrice: (price: number) => string;
  getCategoryLabel: (category: string) => string;
}) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  return (
    <Card className="group relative overflow-hidden bg-white rounded-2xl border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 backdrop-blur-sm">
      {/* Decorative gradient border */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 rounded-2xl p-[1px]">
        <div className="bg-white rounded-2xl h-full w-full" />
      </div>
      
      <div className="relative z-10">
        <div className="aspect-[4/5] bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden rounded-t-2xl">
          {/* Product image or placeholder */}
          {product.image ? (
            <Image 
              src={product.image} 
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-8xl opacity-30 filter drop-shadow-lg">
                {product.category === 'Burkinis' ? '🏊‍♀️' : 
                 product.category === 'Hijabs' ? '🧕' : '👗'}
              </div>
            </div>
          )}
          
          {/* Elegant overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Wishlist Button */}
          <button 
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="absolute top-4 left-4 p-3 bg-white/95 backdrop-blur-sm hover:bg-white rounded-full shadow-xl transition-all duration-300 hover:scale-110 border border-white/20"
          >
            <Heart className={`h-5 w-5 transition-all duration-300 ${
              isWishlisted 
                ? 'text-pink-500 fill-pink-500 scale-110' 
                : 'text-gray-600 hover:text-pink-500 hover:scale-110'
            }`} />
          </button>
          
          {/* Stock Badge */}
          {product.stock <= 5 && product.stock > 0 && (
            <Badge className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 shadow-xl px-3 py-1 rounded-full font-medium">
              {product.stock} متبقي
            </Badge>
          )}
          
          {product.stock === 0 && (
            <Badge className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-xl px-3 py-1 rounded-full font-medium">
              نفد المخزون
            </Badge>
          )}
        </div>
        
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <Badge 
              variant="outline" 
              className="text-xs font-medium bg-gradient-to-r from-pink-50 to-purple-50 text-pink-700 border-pink-200 hover:bg-gradient-to-r hover:from-pink-100 hover:to-purple-100 transition-all duration-200 px-3 py-1 rounded-full"
            >
              {getCategoryLabel(product.category)}
            </Badge>
            
            {product.size && (
              <div className="flex items-center gap-1 text-xs text-slate-600 bg-slate-100 px-3 py-1 rounded-full font-medium">
                <span>المقاس:</span>
                <span className="font-bold text-slate-800">{product.size}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 line-clamp-2 group-hover:text-pink-600 transition-colors text-xl leading-tight tracking-tight">
              {product.name}
            </h3>
            
            <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          </div>
          
          <div className="pt-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              {formatPrice(product.price)}
            </span>
          </div>
        </CardContent>
        
        <CardFooter className="p-6 pt-0">
          <div className="flex gap-3">
            <Link href={`/products/${product.id}`} className="flex-1">
              <Button 
                variant="outline" 
                size="sm"
                className="w-full border-2 border-slate-200 hover:border-pink-300 hover:text-pink-600 hover:bg-pink-50 transition-all duration-300 rounded-lg font-medium py-2 text-sm"
              >
                عرض التفاصيل
              </Button>
            </Link>
            
            <Button 
              size="sm"
              className="flex-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 rounded-lg font-medium py-2 text-sm border-0 min-w-[120px]"
              disabled={product.stock === 0}
              onClick={() => onAddToCart(product)}
            >
              <ShoppingCart className="ml-1 h-4 w-4" />
              {product.stock === 0 ? 'نفد المخزون' : 'اشتري الآن'}
            </Button>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20">
      <div className="text-8xl mb-6 opacity-50">🔍</div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        لم نجد أي منتجات
      </h3>
      <p className="text-gray-600 text-lg max-w-md mx-auto">
        جربي تغيير معايير البحث أو الفلترة للعثور على المنتجات المطلوبة
      </p>
    </div>
  );
}

// Main component
export function ProductsClient({ initialProducts }: ProductsClientProps) {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    selectedCategory: 'all',
    sortBy: 'name'
  });
  const [orderModal, setOrderModal] = useState<{ isOpen: boolean; product: Product | null }>({ isOpen: false, product: null });

  const filteredProducts = useProductFilters(initialProducts, filters);
  const { formatPrice, getCategoryLabel } = useProductActions();

  const handleFiltersChange = useCallback((newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const handleBuyNow = (product: Product) => {
    setOrderModal({ isOpen: true, product });
  };

  const handleOrderSubmit = async (orderData: OrderData) => {
    if (!orderModal.product) return;

    // Show loading toast
    const loadingToast = toast.loading('جاري إرسال طلبك... / Submitting your order...');

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...orderData,
          productId: orderModal.product.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit order');
      }

      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success('🎉 تم إرسال طلبك بنجاح! سنتواصل معك قريباً / Order submitted successfully! We will contact you soon.', {
        duration: 6000,
      });
      setOrderModal({ isOpen: false, product: null });
    } catch (error) {
      console.error('Order submission error:', error);
      // Dismiss loading toast and show error
      toast.dismiss(loadingToast);
      toast.error('❌ حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى / Error occurred while submitting order. Please try again.', {
        duration: 5000,
      });
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent mb-4">
            مجموعة هيلينا
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            اكتشفي أحدث تشكيلة من البركيني والحجاب والملابس المحتشمة العصرية
          </p>
          <div className="mt-6 flex justify-center">
            <div className="h-1 w-24 bg-gradient-to-r from-rose-500 to-purple-600 rounded-full"></div>
          </div>
        </div>

        {/* Filters */}
        <ProductFilters 
          filters={filters}
          onFiltersChange={handleFiltersChange}
          resultCount={filteredProducts.length}
        />

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => handleBuyNow(product)}
                formatPrice={formatPrice}
                getCategoryLabel={getCategoryLabel}
              />
            ))}
          </div>
        )}

        {/* Load More Button (for future pagination) */}
        {filteredProducts.length > 0 && (
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              عرض {filteredProducts.length} من أصل {initialProducts.length} منتج
            </p>
          </div>
        )}
      </div>

      {/* Order Modal */}
       {orderModal.product && (
         <OrderModal
           isOpen={orderModal.isOpen}
           onClose={() => setOrderModal({ isOpen: false, product: null })}
           product={{
              id: orderModal.product.id,
              name: orderModal.product.name,
              price: orderModal.product.price,
              image: orderModal.product.images?.[0] || '/placeholder.jpg'
            }}
           onSubmit={handleOrderSubmit}
         />
       )}
    </div>
  );
}