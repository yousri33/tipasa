'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Menu, Search, Phone } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);



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
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
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
            <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent group-hover:from-rose-600 group-hover:to-purple-700 transition-all duration-300">
              Helena Brand
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-rose-600 transition-colors duration-200 relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-rose-500 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search */}
            <div className="hidden md:flex items-center gap-1 md:gap-2 bg-gray-100 rounded-full px-3 md:px-4 py-1.5 md:py-2 hover:bg-gray-200 transition-colors duration-200">
              <Search className="h-3.5 w-3.5 md:h-4 md:w-4 text-gray-500" />
              <input
                type="text"
                placeholder="ابحثي عن منتج..."
                className="bg-transparent border-none outline-none text-xs md:text-sm text-gray-700 placeholder-gray-500 w-28 md:w-32"
              />
            </div>



            {/* Mobile menu */}
            <div className="lg:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative h-8 w-8 md:h-10 md:w-10">
                    <Menu className="h-4 w-4 md:h-5 md:w-5" />
                    <span className="sr-only">Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] sm:w-[350px] bg-white">
                  <SheetTitle className="sr-only">قائمة التنقل</SheetTitle>
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-center py-4 md:py-6 border-b border-gray-100">
                      <div className="text-lg md:text-xl font-bold bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
                        Helena Brand
                      </div>
                    </div>
                    
                    {/* Search in mobile menu */}
                    <div className="p-3 md:p-4 border-b border-gray-100">
                      <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 md:px-4 py-1.5 md:py-2">
                        <Search className="h-3.5 w-3.5 md:h-4 md:w-4 text-gray-500" />
                        <input
                          type="text"
                          placeholder="ابحثي عن منتج..."
                          className="bg-transparent border-none outline-none text-xs md:text-sm text-gray-700 placeholder-gray-500 flex-1"
                        />
                      </div>
                    </div>
                    
                    {/* Navigation */}
                    <nav className="flex flex-col space-y-1 md:space-y-2 mt-4 md:mt-6 px-2">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="text-base md:text-lg font-medium text-gray-700 hover:text-rose-600 hover:bg-rose-50 transition-all duration-200 py-2 md:py-3 px-3 md:px-4 rounded-lg"
                          onClick={() => setIsOpen(false)}
                          aria-label={item.ariaLabel}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </nav>
                    
                    {/* Mobile actions */}
                    <div className="mt-6 px-2 space-y-2">

                    </div>
                    
                    {/* Footer */}
                    <div className="mt-auto mb-6 px-6">
                      <div className="text-center text-sm text-gray-400">
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