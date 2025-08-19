'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Product } from '@/lib/types';
import ProductCard from './ProductCard';
import ProductFilters, { FilterState } from './ProductFilters';
import OrderModal, { OrderData } from '../orders/OrderModal';
import Link from 'next/link';

interface ProductsClientProps {
  initialProducts: Product[];
}

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
          return a.name.localeCompare(a.name, 'ar');
      }
    });

    return filtered;
  }, [products, filters]);
}

// Main component
export default function ProductsClient({ initialProducts }: ProductsClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    selectedCategory: 'all',
    sortBy: 'name'
  });
  
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Fetch fresh data on component mount and periodically
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsRefreshing(true);
        const response = await fetch('/api/products', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        if (response.ok) {
          const freshProducts = await response.json();
          setProducts(freshProducts);
        }
      } catch (error) {
        console.error('Error fetching fresh products:', error);
      } finally {
        setIsRefreshing(false);
      }
    };

    // Fetch fresh data immediately
    fetchProducts();

    // Set up interval to refresh data every 30 seconds
    const interval = setInterval(fetchProducts, 30000);

    return () => clearInterval(interval);
  }, []);
  
  const filteredProducts = useProductFilters(products, filters);
  
  const handleFiltersChange = useCallback((newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);
  
  const handleAddToCart = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsOrderModalOpen(true);
  }, []);
  
  const handleQuickView = useCallback((product: Product) => {
    // Navigate to product detail page
    window.location.href = `/products/${product.id}`;
  }, []);
  
  const handleOrderSubmit = useCallback(async (orderData: OrderData) => {
    try {
      // Here you would typically send the order to your backend
      // console.log('Order submitted:', orderData);
      
      // Show success message
      // console.log("تم إرسال الطلب بنجاح! 🎉");
      
      setIsOrderModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error submitting order:', error);
      console.error("حدث خطأ - لم نتمكن من إرسال الطلب. يرجى المحاولة مرة أخرى");
    }
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            مجموعة منتجاتنا
            {isRefreshing && (
              <span className="inline-block ml-3 text-sm">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 inline-block"></div>
              </span>
            )}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            اكتشفي أحدث صيحات الموضة المحتشمة من مجموعتنا المختارة بعناية
            {isRefreshing && (
              <span className="block text-sm text-purple-600 mt-2 font-medium">
                جاري تحديث المنتجات...
              </span>
            )}
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
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onQuickView={handleQuickView}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">لم يتم العثور على منتجات</h3>
            <p className="text-gray-600">جربي تغيير معايير البحث أو التصفية</p>
          </div>
        )}
        
        {/* Order Modal */}
        {selectedProduct && (
          <OrderModal
            isOpen={isOrderModalOpen}
            onClose={() => {
              setIsOrderModalOpen(false);
              setSelectedProduct(null);
            }}
            product={{
              id: selectedProduct.id,
              name: selectedProduct.name,
              price: selectedProduct.price,
              image: selectedProduct.image || '/api/placeholder/400/400'
            }}
            onSubmit={handleOrderSubmit}
          />
        )}
      </div>
    </div>
  );
}