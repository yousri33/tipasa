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
      
      {/* Content */}
      <div className="relative z-10">
        {/* Image Section */}
        <CardContent className="p-0">
          <div className="relative aspect-square overflow-hidden rounded-t-2xl">
            <img
              src={product.image || '/api/placeholder/400/400'}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              onError={(e) => {
                e.currentTarget.src = '/api/placeholder/400/400';
              }}
            />
            
            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex gap-3">
                <Button
                  size="sm"
                  variant="secondary"
                  className="rounded-full bg-white/90 hover:bg-white text-gray-900 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsWishlisted(!isWishlisted);
                  }}
                >
                  <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                <Button
                  size="sm"
                  className="rounded-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75"
                  onClick={(e) => {
                    e.preventDefault();
                    onAddToCart(product);
                  }}
                >
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Stock badge */}
            {product.stock <= 5 && product.stock > 0 && (
              <Badge className="absolute top-3 right-3 bg-orange-500 hover:bg-orange-600 text-white border-0">
                {product.stock} متبقي
              </Badge>
            )}
            
            {product.stock === 0 && (
              <Badge className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white border-0">
                نفد المخزون
              </Badge>
            )}
            
            {/* Category badge */}
            <Badge className="absolute top-3 left-3 bg-white/90 text-gray-900 border-0 backdrop-blur-sm">
              {getCategoryLabel(product.category)}
            </Badge>
          </div>
        </CardContent>
        
        {/* Product Info */}
        <CardFooter className="p-6">
          <div className="w-full space-y-3">
            <div>
              <h3 className="font-bold text-lg text-gray-900 group-hover:text-purple-600 transition-colors duration-300 line-clamp-1">
                {product.name}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-2 mt-1">
                {product.description}
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </div>
                {product.size && (
                  <div className="text-sm text-gray-500">
                    المقاس: {product.size}
                  </div>
                )}
              </div>
              
              {product.colors && product.colors.length > 1 && (
                <div className="flex gap-1">
                  {product.colors.slice(0, 3).map((color, index) => (
                    <div
                      key={index}
                      className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    />
                  ))}
                  {product.colors.length > 3 && (
                    <div className="w-4 h-4 rounded-full bg-gray-200 border-2 border-white shadow-sm flex items-center justify-center">
                      <span className="text-xs text-gray-600">+</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16">
      <div className="text-6xl mb-4">🔍</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">لم يتم العثور على منتجات</h3>
      <p className="text-gray-600">جربي تغيير معايير البحث أو التصفية</p>
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
  
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const filteredProducts = useProductFilters(initialProducts, filters);
  const { formatPrice, getCategoryLabel } = useProductActions();
  
  const handleFiltersChange = useCallback((newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);
  
  const handleAddToCart = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsOrderModalOpen(true);
  }, []);
  
  const handleOrderSubmit = useCallback(async (orderData: OrderData) => {
    try {
      // Here you would typically send the order to your backend
      console.log('Order submitted:', orderData);
      
      // Show success message
      toast({
        title: "تم إرسال الطلب بنجاح! 🎉",
        description: "سنتواصل معك قريباً لتأكيد الطلب",
      });
      
      setIsOrderModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error submitting order:', error);
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من إرسال الطلب. يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    }
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            مجموعة منتجاتنا
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            اكتشفي أحدث صيحات الموضة المحتشمة من مجموعتنا المختارة بعناية
          </p>
        </div>
        
        {/* Filters */}
        <ProductFilters 
          filters={filters}
          onFiltersChange={handleFiltersChange}
          resultCount={filteredProducts.length}
        />
        
        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                  formatPrice={formatPrice}
                  getCategoryLabel={getCategoryLabel}
                />
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
        
        {/* Order Modal */}
        <OrderModal
          isOpen={isOrderModalOpen}
          onClose={() => {
            setIsOrderModalOpen(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
          onSubmit={handleOrderSubmit}
        />
      </div>
    </div>
  );
}