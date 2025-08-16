'use client'

import { useState } from 'react'
import Image from 'next/image'
import { MapPin, Phone, User, Truck, Building, Ruler } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

interface OrderModalProps {
  isOpen: boolean
  onClose: () => void
  product: {
    id: string
    name: string
    price: number
    image: string
  }
  onSubmit: (orderData: OrderData) => void
}

export interface OrderData {
  customerName: string
  phoneNumber: string
  wilaya: string
  commune: string
  deliveryType: 'home' | 'bureau'
  productName: string
  productPrice: number
  size: string
}

const WILAYAS = [
  'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra', 'Béchar',
  'Blida', 'Bouira', 'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Alger',
  'Djelfa', 'Jijel', 'Sétif', 'Saïda', 'Skikda', 'Sidi Bel Abbès', 'Annaba', 'Guelma',
  'Constantine', 'Médéa', 'Mostaganem', 'M\'Sila', 'Mascara', 'Ouargla', 'Oran', 'El Bayadh',
  'Illizi', 'Bordj Bou Arréridj', 'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued',
  'Khenchela', 'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma', 'Aïn Témouchent',
  'Ghardaïa', 'Relizane', 'Ouled Djellal', 'Bordj Badji Mokhtar', 'Béni Abbès', 'Timimoun',
  'Touggourt', 'Djanet', 'In Salah', 'In Guezzam', 'Ménéa', 'El Meghaier'
]

export default function OrderModal({ isOpen, onClose, product, onSubmit }: OrderModalProps) {
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    wilaya: '',
    commune: '',
    deliveryType: 'home' as 'home' | 'bureau',
    size: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'الاسم مطلوب / Name is required'
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'رقم الهاتف مطلوب / Phone number is required'
    } else if (!/^(\+213|0)[5-7][0-9]{8}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'رقم هاتف جزائري صحيح مطلوب / Valid Algerian phone number required'
    }

    if (!formData.wilaya) {
      newErrors.wilaya = 'الولاية مطلوبة / Wilaya is required'
    }

    if (!formData.commune.trim()) {
      newErrors.commune = 'البلدية مطلوبة / Commune is required'
    }

    if (!formData.size.trim()) {
      newErrors.size = 'الحجم مطلوب / Size is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      const orderData: OrderData = {
        customerName: formData.customerName,
        phoneNumber: formData.phoneNumber,
        wilaya: formData.wilaya,
        commune: formData.commune,
        deliveryType: formData.deliveryType,
        productName: product.name,
        productPrice: product.price,
        size: formData.size
      }

      await onSubmit(orderData)
      
      // Reset form
      setFormData({
        customerName: '',
        phoneNumber: '',
        wilaya: '',
        commune: '',
        deliveryType: 'home',
        size: ''
      })
      
      onClose()
    } catch (error) {
      console.error('Order submission failed:', error)
      alert('فشل في إرسال الطلب. يرجى المحاولة مرة أخرى / Order submission failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-xl font-bold text-gray-900">
          تأكيد الطلب / Confirm Order
        </DialogTitle>

        {/* Product Info */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{product.name}</h3>
              <p className="text-lg font-bold text-rose-600">{product.price} DZD</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Customer Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              الاسم الكامل / Full Name *
            </label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => handleInputChange('customerName', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors ${
                errors.customerName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="أدخل اسمك الكامل / Enter your full name"
            />
            {errors.customerName && (
              <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-2" />
              رقم الهاتف / Phone Number *
            </label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors ${
                errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0555 123 456 أو +213 555 123 456"
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Wilaya */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              الولاية / Wilaya *
            </label>
            <select
              value={formData.wilaya}
              onChange={(e) => handleInputChange('wilaya', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors ${
                errors.wilaya ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">اختر الولاية / Select Wilaya</option>
              {WILAYAS.map((wilaya) => (
                <option key={wilaya} value={wilaya}>
                  {wilaya}
                </option>
              ))}
            </select>
            {errors.wilaya && (
              <p className="text-red-500 text-sm mt-1">{errors.wilaya}</p>
            )}
          </div>

          {/* Commune */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              البلدية / Commune *
            </label>
            <input
              type="text"
              value={formData.commune}
              onChange={(e) => handleInputChange('commune', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors ${
                errors.commune ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="أدخل اسم البلدية / Enter commune name"
            />
            {errors.commune && (
              <p className="text-red-500 text-sm mt-1">{errors.commune}</p>
            )}
          </div>

          {/* Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Ruler className="w-4 h-4 inline mr-2" />
              الحجم / Size *
            </label>
            <select
              value={formData.size}
              onChange={(e) => handleInputChange('size', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors ${
                errors.size ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">اختر الحجم / Select Size</option>
              <option value="S">S - صغير / Small</option>
              <option value="M">M - متوسط / Medium</option>
              <option value="L">L - كبير / Large</option>
              <option value="XL">XL - كبير جداً / Extra Large</option>
              <option value="XXL">XXL - كبير جداً جداً / Double Extra Large</option>
            </select>
            {errors.size && (
              <p className="text-red-500 text-sm mt-1">{errors.size}</p>
            )}
          </div>

          {/* Delivery Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Truck className="w-4 h-4 inline mr-2" />
              نوع التوصيل / Delivery Type *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleInputChange('deliveryType', 'home')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  formData.deliveryType === 'home'
                    ? 'border-rose-500 bg-rose-50 text-rose-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Truck className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-medium">توصيل منزلي</div>
                <div className="text-xs text-gray-500">Home Delivery</div>
              </button>
              <button
                type="button"
                onClick={() => handleInputChange('deliveryType', 'bureau')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  formData.deliveryType === 'bureau'
                    ? 'border-rose-500 bg-rose-50 text-rose-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Building className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-medium">مكتب بريد</div>
                <div className="text-xs text-gray-500">Bureau/Office</div>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white py-4 rounded-lg font-semibold hover:from-rose-600 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  جاري الإرسال... / Submitting...
                </div>
              ) : (
                'تأكيد الطلب / Confirm Order'
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}