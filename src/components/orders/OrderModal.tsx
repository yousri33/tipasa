'use client'

import { useState } from 'react'
import Image from 'next/image'
import { MapPin, Phone, User, Truck, Building, Ruler, CheckCircle, AlertCircle, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { toast } from '@/components/ui/toast'

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
  'Ghardaia', 'Relizane', 'Ouled Djellal', 'Bordj Badji Mokhtar', 'Béni Abbès', 'Timimoun',
  'Touggourt', 'Djanet', 'In Salah', 'In Guezzam', 'Ménéa', 'El Meghaier'
]

const SIZES = [
  { value: 'S', label: 'S - صغير / Small' },
  { value: 'M', label: 'M - متوسط / Medium' },
  { value: 'L', label: 'L - كبير / Large' },
  { value: 'XL', label: 'XL - كبير جداً / Extra Large' },
  { value: 'XXL', label: 'XXL - كبير جداً جداً / Double Extra Large' }
]

export default function OrderModal({ isOpen, onClose, product, onSubmit }: OrderModalProps) {
  // console.log('🎭 OrderModal rendered with props:', { isOpen, product: product?.name })
  
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
  const [currentStep, setCurrentStep] = useState(1)
  const [isSuccess, setIsSuccess] = useState(false)

  const steps = [
    { number: 1, title: 'معلومات المنتج', icon: CheckCircle },
    { number: 2, title: 'معلومات العميل', icon: User },
    { number: 3, title: 'التوصيل', icon: Truck },
    { number: 4, title: 'التأكيد', icon: CheckCircle }
  ]

  const validateForm = () => {
    // console.log('🔍 Validating form with data:', formData)
    const newErrors: Record<string, string> = {}

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'الاسم مطلوب / Name is required'
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'رقم الهاتف مطلوب / Phone number is required'
    } else if (!/^(\+213|0)[5-7][0-9]{8}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      // console.log('❌ Phone validation failed for:', formData.phoneNumber)
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

    // console.log('📋 Validation errors:', newErrors)
    const isValid = Object.keys(newErrors).length === 0
    // console.log('✅ Form is valid:', isValid)
    
    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    // console.log('🚀 Form submitted!')
    e.preventDefault()
    
    // console.log('📝 Starting form validation...')
    if (!validateForm()) {
      // console.log('❌ Form validation failed, stopping submission')
      return
    }

    // console.log('✅ Form validation passed, proceeding with submission')
    setIsSubmitting(true)
    
    // Show loading toast
    const loadingToast = toast.loading('جاري إرسال طلبك...')
    
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

      // console.log('📦 Calling onSubmit with order data:', orderData)
      await onSubmit(orderData)
      
      // Dismiss loading toast
      toast.dismiss(loadingToast)
      
      // console.log('✅ Order submission completed successfully')
      setIsSuccess(true)
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          customerName: '',
          phoneNumber: '',
          wilaya: '',
          commune: '',
          deliveryType: 'home',
          size: ''
        })
        setCurrentStep(1)
        setIsSuccess(false)
        onClose()
      }, 3000)
      
    } catch (error) {
      console.error('❌ Order submission failed:', error)
      toast.error('فشل في إرسال الطلب. يرجى المحاولة مرة أخرى')
      toast.dismiss(loadingToast)
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

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  if (!isOpen) return null

  if (isSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-full max-w-md text-center">
          <div className="p-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">تم إرسال الطلب بنجاح! 🎉</h3>
            <p className="text-gray-600 mb-6">سنقوم بالتواصل معك قريباً لتأكيد الطلب</p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-800">
                رقم الطلب: <span className="font-bold">#{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
            >
              إغلاق
            </button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-xl font-bold text-gray-900 mb-6">
          تأكيد الطلب / Confirm Order
        </DialogTitle>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  currentStep >= step.number 
                    ? 'bg-purple-600 border-purple-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-500'
                }`}>
                  {currentStep > step.number ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.number}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 ${
                    currentStep > step.number ? 'bg-purple-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {steps.map((step) => (
              <span 
                key={step.number} 
                className={`text-xs ${
                  currentStep >= step.number ? 'text-purple-600 font-medium' : 'text-gray-500'
                }`}
              >
                {step.title}
              </span>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-6 border-b border-gray-100 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20">
              <Image
                src={product.image || '/placeholder-image.svg'}
                alt={product.name}
                fill
                sizes="80px"
                className="object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-image.svg';
                }}
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg">{product.name}</h3>
              <p className="text-2xl font-bold text-purple-600">{product.price} DZD</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-gray-500">المنتج:</span>
                <span className="text-sm font-medium text-gray-700">{product.name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Product Selection */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">اختيار المنتج</h4>
              
              {/* Size Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Ruler className="w-4 h-4 inline mr-2" />
                  الحجم / Size *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {SIZES.map((size) => (
                    <button
                      key={size.value}
                      type="button"
                      onClick={() => handleInputChange('size', size.value)}
                      className={`p-4 border-2 rounded-lg text-center transition-all ${
                        formData.size === size.value
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-300 hover:border-purple-300 hover:bg-purple-50'
                      }`}
                    >
                      <div className="font-medium">{size.value}</div>
                      <div className="text-xs text-gray-500 mt-1">{size.label.split(' - ')[1]}</div>
                    </button>
                  ))}
                </div>
                {errors.size && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {errors.size}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Customer Information */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">معلومات العميل</h4>
              
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
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                    errors.customerName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="أدخل اسمك الكامل / Enter your full name"
                />
                {errors.customerName && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {errors.customerName}
                  </p>
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
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                    errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0555 123 456 أو +213 555 123 456"
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {errors.phoneNumber}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Delivery Information */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">معلومات التوصيل</h4>
              
              {/* Wilaya */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  الولاية / Wilaya *
                </label>
                <select
                  value={formData.wilaya}
                  onChange={(e) => handleInputChange('wilaya', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
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
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {errors.wilaya}
                  </p>
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
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                    errors.commune ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="أدخل اسم البلدية / Enter commune name"
                />
                {errors.commune && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {errors.commune}
                  </p>
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
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-300 hover:border-purple-300'
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
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-300 hover:border-purple-300'
                    }`}
                  >
                    <Building className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">مكتب بريد</div>
                    <div className="text-xs text-gray-500">Bureau/Office</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Order Summary */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">ملخص الطلب</h4>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">المنتج:</span>
                  <span className="font-medium">{product.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">الحجم:</span>
                  <span className="font-medium">{formData.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">السعر:</span>
                  <span className="font-medium text-purple-600">{product.price} DZD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">الاسم:</span>
                  <span className="font-medium">{formData.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">الهاتف:</span>
                  <span className="font-medium">{formData.phoneNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">العنوان:</span>
                  <span className="font-medium">{formData.commune}, {formData.wilaya}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">نوع التوصيل:</span>
                  <span className="font-medium">
                    {formData.deliveryType === 'home' ? 'توصيل منزلي' : 'مكتب بريد'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6 gap-4">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                السابق
              </button>
            ) : (
              <div className="flex-1"></div>
            )}
            
            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                التالي
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    تأكيد الطلب
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}