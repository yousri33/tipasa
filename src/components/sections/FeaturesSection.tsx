'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Truck, Shield, Heart, Sparkles, Star, Gift } from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  delay: number;
}

export default function FeaturesSection() {
  const [isVisible, setIsVisible] = useState(false);

  const features: Feature[] = [
    {
      icon: <Truck className="h-8 w-8" />,
      title: 'شحن مجاني',
      description: 'شحن مجاني لجميع الطلبات فوق 200 ريال',
      color: 'from-blue-500 to-cyan-500',
      delay: 0
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'ضمان الجودة',
      description: 'منتجات عالية الجودة مع ضمان الاستبدال',
      color: 'from-green-500 to-emerald-500',
      delay: 200
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: 'صنع بحب',
      description: 'كل قطعة مصنوعة بعناية واهتمام فائق',
      color: 'from-rose-500 to-pink-500',
      delay: 400
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: 'تقييم ممتاز',
      description: 'أكثر من 10,000 عميلة راضية عن منتجاتنا',
      color: 'from-yellow-500 to-orange-500',
      delay: 600
    },
    {
      icon: <Gift className="h-8 w-8" />,
      title: 'هدايا مجانية',
      description: 'هدايا مفاجئة مع كل طلب',
      color: 'from-purple-500 to-indigo-500',
      delay: 800
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: 'تصاميم حصرية',
      description: 'تصاميم فريدة لا تجدينها في أي مكان آخر',
      color: 'from-pink-500 to-purple-500',
      delay: 1000
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-20 w-40 h-40 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute bottom-10 right-20 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-cyan-200/30 rounded-full opacity-50 animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-gradient-to-br from-yellow-200/30 to-orange-200/30 rounded-full opacity-40 animate-pulse delay-500"></div>
        <div className="absolute bottom-1/3 left-1/4 w-24 h-24 bg-gradient-to-br from-green-200/30 to-emerald-200/30 rounded-full opacity-40 animate-pulse delay-700"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-purple-200 mb-6">
            <Sparkles className="h-4 w-4 text-purple-600 ml-2" />
            <span className="text-sm font-medium text-purple-700">مميزاتنا</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 bg-clip-text text-transparent mb-6">
            لماذا تختارين هيلينا؟
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            نحن نؤمن بأن كل امرأة تستحق الأفضل، لذلك نقدم لك تجربة تسوق استثنائية مع منتجات عالية الجودة وخدمة متميزة
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2 border border-white/50 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: `${feature.delay}ms`
              }}
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <CardContent className="relative p-8">
                {/* Icon container */}
                <div className={`relative mb-6 inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                  {feature.icon}
                  
                  {/* Floating particles around icon */}
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-white/50 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
                  <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-white/40 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300" style={{animationDelay: '0.5s'}}></div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-700 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  {feature.description}
                </p>
                
                {/* Bottom accent line */}
                <div className={`absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r ${feature.color} group-hover:w-full transition-all duration-500`}></div>
                
                {/* Hover glow effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`}></div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Stats section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: '10K+', label: 'عميلة سعيدة' },
            { number: '500+', label: 'منتج متنوع' },
            { number: '99%', label: 'رضا العملاء' },
            { number: '24/7', label: 'دعم العملاء' }
          ].map((stat, index) => (
            <div 
              key={index} 
              className={`text-center transform transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: `${1200 + index * 100}ms`
              }}
            >
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}