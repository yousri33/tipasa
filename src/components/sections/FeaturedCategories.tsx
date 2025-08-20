'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ArrowRight, ShoppingBag, Loader2 } from 'lucide-react';
import { preloadCategoryImages } from '@/lib/airtable-images';

interface Category {
  name: string;
  description: string;
  image: string;
  href: string;
  category: string;
}

export default function FeaturedCategories() {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const featuredCategories: Category[] = [
    {
      name: 'البركيني',
      description: 'ملابس سباحة محتشمة وأنيقة',
      image: '/BURKINI.png',
      href: '/products?category=Burkinis',
      category: 'Burkinis'
    },
    {
      name: 'الحجاب',
      description: 'حجاب فاخر بأقمشة عالية الجودة',
      image: '/HIDJAB.png',
      href: '/products?category=Hijabs',
      category: 'Hijabs'
    },
    {
      name: 'الملابس المحتشمة',
      description: 'أزياء عصرية ومحتشمة',
      image: '/MODEST.JPG',
      href: '/products?category=Modest Wear',
      category: 'Modest Wear'
    }
  ];

  useEffect(() => {
    const loadCategoryImages = async () => {
      try {
        await preloadCategoryImages();
        setImagesLoaded(true);
      } catch (error) {
        console.error('Failed to load category images:', error);
        setImagesLoaded(true);
      }
    };

    loadCategoryImages();
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            تسوقي حسب الفئة
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            اكتشفي مجموعتنا المختارة من المنتجات المميزة
          </p>
        </div>
        
        {/* Categories Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {featuredCategories.map((category, index) => (
            <Link key={index} href={category.href}>
              <div className="group relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 active:shadow-inner active:translate-y-1 hover:-translate-y-1">
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  {(imagesLoaded && category.image !== '/api/placeholder/400/300') || category.image === '/MODEST.JPG' || category.image === '/BURKINI.png' ? (
                    <Image 
                      src={category.image} 
                      alt={category.name}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse flex items-center justify-center">
                      <ShoppingBag className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                  
                  {/* Content */}
                  <div className="absolute bottom-4 right-4 text-white">
                    <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                    <p className="text-sm text-white/90">{category.description}</p>
                  </div>
                </div>
                
                {/* Action Button */}
                <div className="p-4">
                  <div className="flex items-center justify-between text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                    <span className="font-medium">تسوقي الآن</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* View All Button */}
        <div className="text-center">
          <Link href="/products">
            <button
              disabled={isLoading}
              onClick={() => {
                setIsLoading(true);
                // Simulate loading for navigation
                setTimeout(() => setIsLoading(false), 1200);
              }}
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed active:shadow-inner active:translate-y-1 hover:-translate-y-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>جاري التحميل...</span>
                </>
              ) : (
                <>
                  <span>عرض جميع الفئات</span>
                  <ArrowRight className="mr-2 h-4 w-4" />
                </>
              )}
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}