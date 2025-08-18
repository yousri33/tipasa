import ProductsClient from '@/components/products/ProductsClient';
import { getProducts } from '@/lib/airtable';

export default async function ProductsPage() {
  try {
    const products = await getProducts();
    return <ProductsClient initialProducts={products} />;
  } catch (error) {
    console.error('Error fetching products:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">خطأ في تحميل المنتجات</h1>
          <p className="text-gray-600">حدث خطأ أثناء تحميل المنتجات. يرجى المحاولة مرة أخرى.</p>
        </div>
      </div>
    );
  }
}