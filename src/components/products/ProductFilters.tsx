'use client';

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Filter, SortAsc } from 'lucide-react';

export type SortOption = 'name' | 'price-low' | 'price-high';
export type CategoryOption = 'all' | 'Burkinis' | 'Hijabs' | 'Modest Wear' | 'Accessories';

export interface FilterState {
  searchTerm: string;
  selectedCategory: CategoryOption;
  sortBy: SortOption;
}

interface ProductFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: Partial<FilterState>) => void;
  resultCount: number;
}

// Constants
const CATEGORIES = [
  { value: 'all' as const, label: 'جميع المنتجات', icon: '🛍️' },
  { value: 'Burkinis' as const, label: 'البركيني', icon: '🏊‍♀️' },
  { value: 'Hijabs' as const, label: 'الحجاب', icon: '🧕' },
  { value: 'Modest Wear' as const, label: 'الملابس المحتشمة', icon: '👗' },
  { value: 'Accessories' as const, label: 'الإكسسوارات', icon: '💎' }
];

const SORT_OPTIONS = [
  { value: 'name' as const, label: 'الاسم', icon: '🔤' },
  { value: 'price-low' as const, label: 'السعر: من الأقل للأعلى', icon: '💰' },
  { value: 'price-high' as const, label: 'السعر: من الأعلى للأقل', icon: '💎' }
];

export default function ProductFilters({ 
  filters, 
  onFiltersChange, 
  resultCount 
}: ProductFiltersProps) {
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="h-6 w-6 text-purple-600" />
        <h2 className="text-xl font-semibold text-gray-900">تصفية المنتجات</h2>
        <button
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="ml-auto text-sm text-purple-600 hover:text-purple-700 transition-colors duration-200"
        >
          {showAdvancedFilters ? 'إخفاء' : 'عرض'} المزيد
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Search */}
        <div className="relative">
          <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="ابحثي عن منتج..."
            value={filters.searchTerm}
            onChange={(e) => onFiltersChange({ searchTerm: e.target.value })}
            className="pr-10 border-gray-200 focus:border-purple-300 focus:ring-purple-200 rounded-xl"
          />
        </div>

        {/* Category Filter */}
        <Select 
          value={filters.selectedCategory} 
          onValueChange={(value: CategoryOption) => onFiltersChange({ selectedCategory: value })}
        >
          <SelectTrigger className="border-gray-200 focus:border-purple-300 focus:ring-purple-200 rounded-xl">
            <SelectValue placeholder="اختاري الفئة" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                <div className="flex items-center gap-2">
                  <span>{category.icon}</span>
                  <span>{category.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select 
          value={filters.sortBy} 
          onValueChange={(value: SortOption) => onFiltersChange({ sortBy: value })}
        >
          <SelectTrigger className="border-gray-200 focus:border-purple-300 focus:ring-purple-200 rounded-xl">
            <SortAsc className="h-4 w-4 ml-2" />
            <SelectValue placeholder="ترتيب حسب" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  <span>{option.icon}</span>
                  <span>{option.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Results Count */}
        <div className="flex items-center justify-center md:justify-start bg-gradient-to-r from-purple-50 to-rose-50 rounded-xl px-4 py-3 border border-purple-200">
          <span className="text-purple-700 font-semibold">
            {resultCount} منتج
          </span>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="border-t border-gray-100 pt-6 space-y-4">
          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              نطاق السعر (دينار جزائري)
            </label>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  placeholder="من"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <span className="text-gray-500">إلى</span>
                <input
                  type="number"
                  placeholder="إلى"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 10000])}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="w-full bg-gray-200 rounded-lg h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-rose-500 h-2 rounded-lg transition-all duration-300"
                  style={{ width: `${((priceRange[1] - priceRange[0]) / 10000) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Quick Price Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              أسعار سريعة
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'أقل من 1000', range: [0, 1000] },
                { label: '1000 - 3000', range: [1000, 3000] },
                { label: '3000 - 5000', range: [3000, 5000] },
                { label: 'أكثر من 5000', range: [5000, 10000] }
              ].map((priceFilter, index) => (
                <button
                  key={index}
                  onClick={() => setPriceRange(priceFilter.range)}
                  className={`px-3 py-1 text-sm rounded-full border transition-all duration-200 ${
                    priceRange[0] === priceFilter.range[0] && priceRange[1] === priceFilter.range[1]
                      ? 'bg-purple-500 text-white border-purple-500'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-purple-300 hover:text-purple-600'
                  }`}
                >
                  {priceFilter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Stock Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              حالة المخزون
            </label>
            <div className="flex gap-3">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded text-purple-600 focus:ring-purple-500" />
                <span className="text-sm text-gray-600">متوفر</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded text-purple-600 focus:ring-purple-500" />
                <span className="text-sm text-gray-600">آخر قطعة</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded text-purple-600 focus:ring-purple-500" />
                <span className="text-sm text-gray-600">نفد المخزون</span>
              </label>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => {
                onFiltersChange({ searchTerm: '', selectedCategory: 'all', sortBy: 'name' });
                setPriceRange([0, 10000]);
              }}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:border-gray-400 transition-all duration-200"
            >
              مسح الفلاتر
            </button>
            <button
              onClick={() => setShowAdvancedFilters(false)}
              className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200"
            >
              تطبيق
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 