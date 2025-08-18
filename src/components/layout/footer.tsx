'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Clock, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'منتجاتنا',
      items: [
        'البركيني',
        'الحجاب',
        'الملابس المحتشمة',
        'الأطقم',
        'الإكسسوارات',
      ]
    },
    {
      title: 'خدمة العملاء',
      items: [
        'كيفية الطلب',
        'سياسة الإرجاع',
        'سياسة الشحن',
        'الأسئلة الشائعة',
        'تواصل معنا',
      ]
    },
    {
      title: 'عن هيلينا',
      items: [
        'قصتنا',
        'قيمنا',
        'فريق العمل',
        'الشهادات',
        'المدونة',
      ]
    }
  ];

  const socialLinks = [
    { name: 'Facebook', href: '#', icon: Facebook, color: 'hover:text-blue-600' },
    { name: 'Instagram', href: '#', icon: Instagram, color: 'hover:text-pink-600' },
    { name: 'Twitter', href: '#', icon: Twitter, color: 'hover:text-blue-400' },
    { name: 'YouTube', href: '#', icon: Youtube, color: 'hover:text-red-600' },
  ];

  const contactInfo = [
    { icon: Phone, text: '+213 123 456 789', href: 'tel:+213123456789' },
    { icon: Mail, text: 'info@helenabrand.dz', href: 'mailto:info@helenabrand.dz' },
    { icon: MapPin, text: 'تيبازة، الجزائر', href: null },
    { icon: Clock, text: 'الأحد - الخميس: 9:00 ص - 6:00 م', href: null },
  ];

  return (
    <footer className="bg-gray-800 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="text-3xl font-bold bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Helena Brand
              </div>
              <p className="text-gray-300 leading-relaxed mb-6">
                نقدم أجمل وأرقى التصاميم المحتشمة للنساء المسلمات. 
                نؤمن بأن الأناقة والاحتشام يمكن أن يجتمعا في تصميم واحد.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                {contactInfo.map((contact, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 text-gray-300"
                  >
                    <contact.icon className="h-4 w-4 text-purple-400" />
                    {contact.href ? (
                      <a 
                        href={contact.href} 
                        className="text-sm hover:text-purple-300 transition-colors duration-200"
                      >
                        {contact.text}
                      </a>
                    ) : (
                      <span className="text-sm">{contact.text}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold text-white mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <span className="text-gray-300 text-sm">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="mt-16 pt-8 border-t border-gray-700">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              اشتركي في نشرتنا البريدية
            </h3>
            <p className="text-gray-300 mb-6">
              احصلي على آخر التحديثات والعروض الخاصة
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="أدخلي بريدك الإلكتروني"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-rose-500 to-purple-600 text-white font-medium rounded-lg hover:from-rose-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                اشتراك
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="text-gray-400 text-sm text-center md:text-right">
              © {currentYear} Helena Brand. جميع الحقوق محفوظة.
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm">تابعينا على:</span>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <Link
                    key={index}
                    href={social.href}
                    className={`p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-all duration-200 ${social.color}`}
                    aria-label={social.name}
                  >
                    <social.icon className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Made with love */}
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span>صنع بـ</span>
              <Heart className="h-4 w-4 text-rose-500 fill-current" />
              <span>في الجزائر</span>
            </div>
          </div>
        </div>
      </div>

      {/* Back to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-rose-500 to-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-40"
        aria-label="العودة للأعلى"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </footer>
  );
}