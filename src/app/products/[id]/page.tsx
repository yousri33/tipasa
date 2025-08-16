import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Star, Heart, Share2, Truck, Shield, RotateCcw, Zap, Award, Clock } from 'lucide-react';
import { getProductById } from '@/lib/airtable';
import type { Product } from '@/lib/airtable';
import ProductDetailClient from '@/components/ProductDetailClient';

interface ProductDetailPageProps {
  params: { id: string };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-purple-50">
        <div className="text-center space-y-6 p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20">
          <div className="text-8xl mb-6 animate-bounce">💔</div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent mb-4">
            خطأ في تحميل المنتج
          </h3>
          <p className="text-gray-600 text-lg">المنتج غير موجود</p>
          <Link href="/products">
            <Button className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <ArrowLeft className="ml-2 h-5 w-5" />
              العودة للمنتجات
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return <ProductDetailClient product={product} />;
}