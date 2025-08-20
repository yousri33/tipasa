'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';

import { Menu, Phone, Facebook, Instagram, Loader2 } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingFacebook, setLoadingFacebook] = useState(false);
  const [loadingInstagram, setLoadingInstagram] = useState(false);

  const handleSocialClick = (platform: 'facebook' | 'instagram', url: string) => {
    if (platform === 'facebook') {
      setLoadingFacebook(true);
    } else {
      setLoadingInstagram(true);
    }
    
    // Simulate loading state for 1.5 seconds before opening the link
    setTimeout(() => {
      window.open(url, '_blank', 'noopener,noreferrer');
      if (platform === 'facebook') {
        setLoadingFacebook(false);
      } else {
        setLoadingInstagram(false);
      }
    }, 1500);
  };



  const navigation = [
    { name: 'الرئيسية', href: '/', ariaLabel: 'Home' },
    { name: 'البركيني', href: '/products?category=Burkinis', ariaLabel: 'Burkinis' },
    { name: 'الحجاب', href: '/products?category=Hijabs', ariaLabel: 'Hijabs' },
    { name: 'الملابس المحتشمة', href: '/products?category=Modest Wear', ariaLabel: 'Modest Wear' },
    { name: 'الأطقم', href: '/products?category=Ensemble', ariaLabel: 'Ensemble' },
  ];

  const quickActions = [
    { name: 'اتصل بنا', href: 'tel:+213123456789', icon: Phone, color: 'text-green-600' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/70">
      {/* Top bar with contact info */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white py-1 md:py-2 shadow-lg relative overflow-hidden">
        {/* Animated background overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse opacity-30"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)] animate-pulse"></div>
        <div className="container mx-auto px-2 md:px-4">
          <div className="flex items-center justify-between text-xs md:text-sm relative z-10">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="flex items-center gap-1 md:gap-2 hover:scale-105 transition-transform duration-200">
                  <Phone className="h-3 w-3 md:h-4 md:w-4 drop-shadow-sm" />
                  <a href="tel:+213123456789" className="font-medium tracking-wide drop-shadow-sm hover:text-purple-200 transition-colors duration-200">
                    <span dir="ltr" className="text-xs md:text-sm">+213 123 456 789</span>
                  </a>
                </div>
              <div className="hidden md:block text-white/70">|</div>
                <div className="hidden md:block font-medium animate-pulse drop-shadow-sm">✨ شحن مجاني للطلبات فوق 7000 دينار</div>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              {quickActions.map((action) => (
                <Link
                  key={action.name}
                  href={action.href}
                  className="flex items-center gap-1 md:gap-2 hover:text-purple-200 hover:scale-110 transition-all duration-300 bg-white/10 px-2 md:px-3 py-0.5 md:py-1 rounded-full backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:shadow-lg"
                >
                  <action.icon className="h-3 w-3 md:h-4 md:w-4 drop-shadow-sm" />
                  <span className="hidden sm:inline text-xs md:text-sm font-medium">{action.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-2 md:px-4">
        <div className="flex h-12 md:h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-rose-500 via-purple-600 to-rose-500 bg-clip-text text-transparent group-hover:from-rose-600 group-hover:via-purple-700 group-hover:to-rose-600 transition-all duration-300 drop-shadow-sm">
              Helena Brand
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-semibold text-gray-700 hover:text-rose-600 transition-all duration-300 relative group px-3 py-2 rounded-xl hover:bg-white/60 backdrop-blur-sm"
              >
                {item.name}
                <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-rose-500 to-purple-600 group-hover:w-3/4 transition-all duration-300 rounded-full"></span>
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2 md:gap-4">



            {/* Mobile menu */}
            <div className="lg:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative h-8 w-8 md:h-10 md:w-10">
                    <Menu className="h-4 w-4 md:h-5 md:w-5" />
                    <span className="sr-only">Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[320px] sm:w-[380px] bg-gradient-to-br from-white via-gray-50 to-purple-50/30 backdrop-blur-xl border-l border-gray-200/50 shadow-2xl">
                  <SheetTitle className="sr-only">قائمة التنقل</SheetTitle>
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-center py-6 md:py-8">
                      <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-rose-500 via-purple-600 to-rose-500 bg-clip-text text-transparent drop-shadow-sm">
                        Helena Brand
                      </div>
                    </div>
                    

                    
                    {/* Navigation */}
                    <nav className="flex flex-col space-y-2 px-4 md:px-6">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="group relative text-base md:text-lg font-semibold text-gray-700 hover:text-white transition-all duration-300 py-3 md:py-4 px-4 md:px-6 rounded-2xl hover:bg-gradient-to-r hover:from-rose-500 hover:to-purple-600 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] backdrop-blur-sm border border-transparent hover:border-white/20"
                          onClick={() => setIsOpen(false)}
                          aria-label={item.ariaLabel}
                        >
                          <span className="relative z-10">{item.name}</span>
                          <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </Link>
                      ))}
                    </nav>
                    
                    {/* Social Media Section */}
                    <div className="mt-8 px-4 md:px-6">
                      <div className="bg-gradient-to-r from-purple-500 to-rose-500 rounded-2xl p-4 md:p-6 text-white shadow-xl">
                        <h3 className="font-bold text-lg mb-4">تابعينا على</h3>
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => handleSocialClick('facebook', 'https://www.facebook.com/profile.php?id=61555613117953')}
                            disabled={loadingFacebook}
                            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:cursor-not-allowed px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 disabled:hover:scale-100 disabled:opacity-70"
                            aria-label="Facebook"
                          >
                            {loadingFacebook ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              <Facebook className="h-5 w-5" />
                            )}
                            <span className="text-sm font-medium">
                              {loadingFacebook ? 'جاري التحميل...' : 'Facebook'}
                            </span>
                          </button>
                          <button 
                            onClick={() => handleSocialClick('instagram', 'https://www.instagram.com/helena__brand_/')}
                            disabled={loadingInstagram}
                            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:cursor-not-allowed px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 disabled:hover:scale-100 disabled:opacity-70"
                            aria-label="Instagram"
                          >
                            {loadingInstagram ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              <Instagram className="h-5 w-5" />
                            )}
                            <span className="text-sm font-medium">
                              {loadingInstagram ? 'جاري التحميل...' : 'Instagram'}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Footer */}
                    <div className="mt-auto mb-6 px-6">
                      <div className="text-center text-sm text-gray-500 font-medium">
                        © 2024 Helena Brand
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}