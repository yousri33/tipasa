import { Button } from '@/components/ui/button';
import { getProductById } from '@/lib/airtable';
import ProductDetailClient from '@/components/products/ProductDetailClient';
import { notFound } from 'next/navigation';

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