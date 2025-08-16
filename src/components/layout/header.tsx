'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: 'الرئيسية', href: '/', ariaLabel: 'Home' },
    { name: 'البركيني', href: '/products?category=Burkinis', ariaLabel: 'Burkinis' },
    { name: 'الحجاب', href: '/products?category=Hijabs', ariaLabel: 'Hijabs' },
    { name: 'الملابس المحتشمة', href: '/products?category=Modest Wear', ariaLabel: 'Modest Wear' },
    { name: 'الأطقم', href: '/products?category=Ensemble', ariaLabel: 'Ensemble' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
              Helena Brand
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-rose-600 transition-colors duration-200"
                aria-label={item.ariaLabel}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile menu */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-center justify-center py-6 border-b border-gray-100">
                    <div className="text-xl font-bold bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
                      Helena Brand
                    </div>
                  </div>
                  
                  {/* Navigation */}
                  <nav className="flex flex-col space-y-2 mt-6 px-2">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="text-lg font-medium text-gray-700 hover:text-rose-600 hover:bg-rose-50 transition-all duration-200 py-3 px-4 rounded-lg"
                        onClick={() => setIsOpen(false)}
                        aria-label={item.ariaLabel}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                  
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
    </header>
  );
}