import Link from 'next/link';
import { Facebook, Instagram, Phone, Sparkles, Heart, Star } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30 border-t border-purple-200/50 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-gradient-to-br from-blue-200/20 to-cyan-200/20 rounded-full opacity-50 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-br from-yellow-200/15 to-orange-200/15 rounded-full opacity-40 animate-pulse delay-500"></div>
        
        {/* Floating particles */}
        <div className="absolute top-20 right-20 w-2 h-2 bg-purple-300/30 rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 left-32 w-1.5 h-1.5 bg-pink-300/40 rounded-full animate-pulse delay-700"></div>
        <div className="absolute top-40 left-20 w-3 h-3 bg-blue-300/25 rounded-full animate-pulse delay-300"></div>
      </div>
      
      {/* Decorative icons */}
      <div className="absolute inset-0 pointer-events-none">
        <Star className="absolute top-16 left-16 h-4 w-4 text-yellow-300/20 animate-pulse" />
        <Heart className="absolute top-32 right-24 h-3 w-3 text-pink-300/30 animate-pulse delay-500" />
        <Sparkles className="absolute bottom-24 left-24 h-5 w-5 text-purple-300/25 animate-pulse delay-1000" />
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        {/* Top Section - Links */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-12">
          {[
            { href: '/', label: 'الرئيسية' },
            { href: '/products', label: 'المنتجات' },
            { href: '/products?category=Burkinis', label: 'البركيني' },
            { href: '/products?category=Hijabs', label: 'الحجاب' },
            { href: '/about', label: 'من نحن' },
            { href: '/contact', label: 'اتصل بنا' },
            { href: '/privacy', label: 'سياسة الخصوصية' },
            { href: '/terms', label: 'الشروط والأحكام' }
          ].map((link, index) => (
            <Link 
              key={index}
              href={link.href} 
              className="group relative text-sm text-gray-600 hover:text-purple-700 transition-all duration-300 font-medium transform hover:scale-105"
            >
              <span className="relative z-10">{link.label}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 scale-110"></div>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300"></div>
            </Link>
          ))}
        </div>

        {/* Middle Section - Social & Contact */}
        <div className="flex flex-col items-center space-y-6 mb-10">
          {/* Social Links */}
          <div className="flex items-center space-x-6">
            <Link 
              href="https://www.instagram.com/helena__brand_/" 
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl border border-white/50 text-gray-500 hover:text-pink-500 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
            >
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link 
              href="https://www.facebook.com/profile.php?id=61555613117953" 
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl border border-white/50 text-gray-500 hover:text-blue-600 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
            >
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link 
              href="tel:0556457966" 
              className="group relative p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl border border-white/50 text-gray-500 hover:text-green-600 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
            >
              <Phone className="h-5 w-5" />
              <span className="sr-only">Phone</span>
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>

          {/* Contact Info */}
          <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/50 shadow-lg">
            <p className="text-sm text-gray-700 mb-2 font-medium flex items-center justify-center">
              <Phone className="h-4 w-4 ml-2 text-purple-600" />
              0556457966
            </p>
            <p className="text-sm text-gray-600 flex items-center justify-center">
              <span className="ml-2">📍</span>
              الجزائر - توصيل لجميع الولايات
            </p>
          </div>
        </div>

        {/* Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-purple-200 mb-4">
            <Sparkles className="h-4 w-4 text-purple-600 ml-2" />
            <span className="text-sm font-medium text-purple-700">علامة تجارية موثوقة</span>
          </div>
          <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent mb-4">
            Helena Brand
          </div>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed bg-white/40 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/30">
            علامتك التجارية الموثوقة للأزياء المحتشمة الأنيقة. نتخصص في البركيني والحجاب الجميل الذي يجمع بين الأناقة والراحة والاحتشام.
          </p>
        </div>

        {/* Stats section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {[
            { number: '10K+', label: 'عميلة سعيدة' },
            { number: '500+', label: 'منتج متنوع' },
            { number: '99%', label: 'رضا العملاء' },
            { number: '24/7', label: 'دعم العملاء' }
          ].map((stat, index) => (
            <div key={index} className="text-center bg-white/60 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-lg md:text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
                {stat.number}
              </div>
              <div className="text-xs text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Bottom Section - Copyright */}
        <div className="text-center pt-6 border-t border-purple-200/50">
          <p className="text-sm text-gray-500 bg-white/40 backdrop-blur-sm rounded-full px-6 py-2 inline-block border border-white/30">
            © 2024 Helena Brand. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}