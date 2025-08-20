'use client';

// Minimal change for redeployment - 2025
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Heart, Star, Award, Users, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const heroImages = [
    '/background.png',
    '/BURKINI.png',
    '/HIDJAB.png',
    '/MODEST.JPG'
  ];

  useEffect(() => {
    setIsVisible(true);
    
    // Auto-rotate hero images
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-cyan-50 overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-rose-300/20 to-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-cyan-300/20 to-blue-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-300/10 to-pink-300/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-rose-400 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping delay-300"></div>
        <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-ping delay-700"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
          <div className={`text-center lg:text-right space-y-10 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="space-y-6">
              <div className="flex items-center justify-center lg:justify-end gap-2">
                <Badge className="bg-gradient-to-r from-rose-500 to-purple-600 text-white border-0 px-4 py-2 text-sm font-medium animate-bounce">
                  <Sparkles className="w-4 h-4 ml-1" />
                  مجموعة جديدة 2026
                </Badge>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                أناقة
                <span className="bg-gradient-to-r from-rose-500 via-purple-600 to-cyan-500 bg-clip-text text-transparent animate-pulse">
                  {' '}محتشمة{' '}
                </span>
                <br className="hidden lg:block" />
                بلمسة عصرية
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                اكتشفي مجموعتنا الفريدة من البركيني والحجاب والملابس المحتشمة. 
                نجمع بين الأناقة والراحة والاحتشام في تصاميم عصرية تناسب المرأة المعاصرة.
              </p>
              
              {/* Enhanced Stats with animations */}
              <div className="flex flex-wrap justify-center lg:justify-end gap-8 pt-4">
                {[
                  { number: '1000+', label: 'عميلة سعيدة', color: 'text-rose-600' },
                  { number: '500+', label: 'منتج متنوع', color: 'text-purple-600' },
                  { number: '4.9★', label: 'تقييم العملاء', color: 'text-cyan-600' }
                ].map((stat, index) => (
                  <div 
                    key={index} 
                    className={`text-center transform transition-all duration-700 ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                    style={{ transitionDelay: `${index * 200}ms` }}
                  >
                    <div className={`text-3xl font-bold ${stat.color}`}>{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-end">
              <Link href="/products">
                <Button 
                  size="lg" 
                  disabled={isLoading}
                  onClick={() => {
                    setIsLoading(true);
                    // Simulate loading for navigation
                    setTimeout(() => setIsLoading(false), 1500);
                  }}
                  className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <Loader2 className="ml-2 h-6 w-6 animate-spin" />
                  ) : (
                    <ShoppingBag className="ml-2 h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                  )}
                  {isLoading ? 'جاري التحميل...' : 'تسوقي الآن'}
                  {!isLoading && (
                    <ArrowRight className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  )}
                </Button>
              </Link>
            </div>
          </div>
          
          <div className={`relative transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}>
            {/* Enhanced Main Image Container with auto-rotation */}
            <div className="relative aspect-square">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-200 via-purple-200 to-cyan-200 rounded-3xl transform rotate-6 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-rose-100 via-purple-100 to-cyan-100 rounded-3xl flex items-center justify-center aspect-square shadow-2xl overflow-hidden">
                {heroImages.map((image, index) => (
                  <Image 
                    key={index}
                    src={image} 
                    alt={`Helena Brand Collection ${index + 1}`}
                    fill
                    className={`object-cover rounded-3xl transition-all duration-1000 ${
                      index === currentImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            {/* Enhanced Floating Elements with better animations */}
            <div className="absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-xl animate-float hover:scale-110 transition-transform duration-300 cursor-pointer">
              <Heart className="h-8 w-8 text-rose-500" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl animate-float delay-1000 hover:scale-110 transition-transform duration-300 cursor-pointer">
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="absolute top-1/2 -left-8 bg-white rounded-2xl p-3 shadow-xl animate-float delay-500 hover:scale-110 transition-transform duration-300 cursor-pointer">
              <Award className="h-6 w-6 text-purple-500" />
            </div>
            <div className="absolute top-1/4 -right-8 bg-white rounded-2xl p-3 shadow-xl animate-float delay-700 hover:scale-110 transition-transform duration-300 cursor-pointer">
              <Users className="h-6 w-6 text-cyan-500" />
            </div>
            
            {/* Enhanced Decorative Elements */}
            <div className="absolute top-10 left-10 w-4 h-4 bg-rose-400 rounded-full animate-ping"></div>
            <div className="absolute bottom-20 right-16 w-3 h-3 bg-purple-400 rounded-full animate-ping delay-300"></div>
            <div className="absolute top-1/3 right-4 w-2 h-2 bg-cyan-400 rounded-full animate-ping delay-700"></div>
            
            {/* New floating elements */}
            <div className="absolute top-1/2 right-1/2 w-1 h-1 bg-pink-400 rounded-full animate-ping delay-1000"></div>
            <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping delay-500"></div>
          </div>
        </div>
      </div>
      
      {/* New: Floating CTA Cards */}
      <div className="absolute top-1/4 right-4 hidden lg:block">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl animate-float delay-300 hover:scale-105 transition-transform duration-300 cursor-pointer">
          <div className="text-center">
            <div className="text-2xl font-bold text-rose-600">50%</div>
            <div className="text-sm text-gray-600">خصم</div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-1/4 left-4 hidden lg:block">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl animate-float delay-700 hover:scale-105 transition-transform duration-300 cursor-pointer">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">شحن</div>
            <div className="text-sm text-gray-600">مجاني</div>
          </div>
        </div>
      </div>
    </section>
  );
}