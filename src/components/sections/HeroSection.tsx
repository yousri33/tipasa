'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Heart, Star, Award, Users, ArrowRight, Play, Sparkles } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-cyan-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-rose-300/20 to-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-cyan-300/20 to-blue-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-300/10 to-pink-300/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
          <div className="text-center lg:text-right space-y-10">
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
              
              {/* Stats */}
              <div className="flex flex-wrap justify-center lg:justify-end gap-8 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-rose-600">1000+</div>
                  <div className="text-sm text-gray-600">عميلة سعيدة</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">500+</div>
                  <div className="text-sm text-gray-600">منتج متنوع</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-600">4.9★</div>
                  <div className="text-sm text-gray-600">تقييم العملاء</div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-end">
              <Button size="lg" className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <ShoppingBag className="ml-2 h-6 w-6" />
                تسوقي الآن
                <ArrowRight className="mr-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 rounded-full border-2 border-gray-300 hover:border-rose-500 hover:text-rose-600 transition-all duration-300">
                <Play className="ml-2 h-5 w-5" />
                شاهدي الفيديو
              </Button>
            </div>
          </div>
          
          <div className="relative">
            {/* Main Image Container */}
            <div className="relative aspect-square">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-200 via-purple-200 to-cyan-200 rounded-3xl transform rotate-6 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-rose-100 via-purple-100 to-cyan-100 rounded-3xl flex items-center justify-center aspect-square shadow-2xl overflow-hidden">
                <img 
                  src="/background.png" 
                  alt="Helena Brand Collection" 
                  className="w-full h-full object-cover rounded-3xl hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-xl animate-float">
              <Heart className="h-8 w-8 text-rose-500" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl animate-float delay-1000">
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="absolute top-1/2 -left-8 bg-white rounded-2xl p-3 shadow-xl animate-float delay-500">
              <Award className="h-6 w-6 text-purple-500" />
            </div>
            <div className="absolute top-1/4 -right-8 bg-white rounded-2xl p-3 shadow-xl animate-float delay-700">
              <Users className="h-6 w-6 text-cyan-500" />
            </div>
            
            {/* Decorative Circles */}
            <div className="absolute top-10 left-10 w-4 h-4 bg-rose-400 rounded-full animate-ping"></div>
            <div className="absolute bottom-20 right-16 w-3 h-3 bg-purple-400 rounded-full animate-ping delay-300"></div>
            <div className="absolute top-1/3 right-4 w-2 h-2 bg-cyan-400 rounded-full animate-ping delay-700"></div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}