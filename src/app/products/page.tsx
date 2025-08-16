import { getProducts } from '@/lib/airtable';
import type { Product } from '@/lib/airtable';
import { ProductsClient } from '@/components/ProductsClient';

// Error boundary component
function ProductsError({ error }: { error: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
      <div className="text-center space-y-6 max-w-md mx-auto px-6">
        <div className="text-8xl mb-6 opacity-60">⚠️</div>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">
            خطأ في تحميل المنتجات
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            {error}
          </p>
          <div className="pt-4">
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-lg font-medium hover:from-rose-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading component
function ProductsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="text-center mb-12">
          <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mx-auto mb-4 w-64 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded-lg mx-auto mb-6 w-96 animate-pulse"></div>
          <div className="h-1 w-24 bg-gray-200 rounded-full mx-auto animate-pulse"></div>
        </div>

        {/* Filters Skeleton */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>

        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="aspect-square bg-gray-200 animate-pulse"></div>
              <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-full"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-24"></div>
              </div>
              <div className="p-5 pt-0 space-y-3">
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function ProductsPage() {
  let products: Product[] = [];
  let error: string | null = null;

  try {
    console.log('🚀 Starting to fetch products...');
    products = await getProducts();
    console.log('✅ Products fetched successfully:', products.length, 'products');
  } catch (err) {
    console.error('❌ Error in fetchProducts:', err);
    error = 'فشل في تحميل المنتجات. يرجى التحقق من إعدادات قاعدة البيانات.';
  }

  if (error) {
    return <ProductsError error={error} />;
  }

  return <ProductsClient initialProducts={products} />;
}