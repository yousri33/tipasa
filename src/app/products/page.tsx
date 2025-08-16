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