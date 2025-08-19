'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Truck, Shield, Heart, Star } from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

export default function FeaturesSection() {
  const features: Feature[] = [
    {
      icon: <Truck className="h-6 w-6" />,
      title: 'توصيل سريع',
      description: 'توصيل لجميع الولايات',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'ضمان الجودة',
      description: 'منتجات راقية مع ضمان التبديل',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: 'مصنوع بالمحبة',
      description: 'كل قطعة مصنوعة بعناية',
      color: 'from-rose-500 to-pink-500'
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: 'تقييم ممتاز',
      description: 'أكثر من 10,000 زبونة راضية',
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            علاش تختاري هيلينا؟
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            نقدملك تجربة شراء استثنائية مع منتجات راقية وخدمة ممتازة
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group bg-white hover:shadow-lg transition-all duration-300 border-0 shadow-sm"
            >
              <CardContent className="p-6 text-center">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-4 group-hover:scale-105 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Simple stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { number: '10K+', label: 'زبونة راضية' },
            { number: '500+', label: 'منتج' },
            { number: '99%', label: 'رضا' },
            { number: '24/7', label: 'دعم' }
          ].map((stat, index) => (
            <div key={index}>
              <div className="text-2xl md:text-3xl font-bold text-purple-600 mb-1">
                {stat.number}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}