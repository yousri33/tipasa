import { getProductById } from '@/lib/airtable';
import ProductDetailClient from '@/components/products/ProductDetailClient';
import { notFound } from 'next/navigation';

// Force dynamic rendering to prevent caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);
  
  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}