'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, CreditCard, Truck, Shield, MapPin, Phone, Mail, User } from 'lucide-react';
import { createCustomer, createOrder } from '@/lib/airtable';

interface CheckoutForm {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Shipping Address
  address: string;
  city: string;
  postalCode: string;
  country: string;
  
  // Payment
  paymentMethod: string;
  
  // Additional
  notes: string;
  newsletter: boolean;
}

export default function CheckoutPage() {
  const [formData, setFormData] = useState<CheckoutForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'المغرب',
    paymentMethod: 'cod',
    notes: '',
    newsletter: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<CheckoutForm>>({});

  // Mock cart data - in real app this would come from context
  const cartItems = [
    {
      id: '1',
      name: 'بركيني أنيق - أزرق داكن',
      price: 450,
      quantity: 1,
      size: 'M'
    },
    {
      id: '2',
      name: 'حجاب حريري فاخر - ذهبي وردي',
      price: 120,
      quantity: 2,
      size: 'One Size'
    }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-MA', {
      style: 'currency',
      currency: 'MAD'
    }).format(price);
  };

  const handleInputChange = (field: keyof CheckoutForm, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSelectChange = (field: keyof CheckoutForm) => (value: string) => {
    handleInputChange(field, value);
  };

  const handleCheckboxChange = (field: keyof CheckoutForm) => (checked: boolean) => {
    handleInputChange(field, checked);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CheckoutForm> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'الاسم الأول مطلوب';
    if (!formData.lastName.trim()) newErrors.lastName = 'اسم العائلة مطلوب';
    if (!formData.email.trim()) newErrors.email = 'البريد الإلكتروني مطلوب';
    if (!formData.phone.trim()) newErrors.phone = 'رقم الهاتف مطلوب';
    if (!formData.address.trim()) newErrors.address = 'العنوان مطلوب';
    if (!formData.city.trim()) newErrors.city = 'المدينة مطلوبة';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }

    // Phone validation (Moroccan format)
    const phoneRegex = /^(\+212|0)[5-7][0-9]{8}$/;
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'رقم الهاتف غير صحيح';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create customer
      const customer = await createCustomer({
        'Full Name': `${formData.firstName} ${formData.lastName}`,
        'Email': formData.email,
        'Phone': formData.phone,
        'Address': formData.address,
        'City': formData.city,
        'Country': formData.country,
        'Postal Code': formData.postalCode,
        'Customer Notes': formData.newsletter ? 'Subscribed to newsletter' : ''
      });

      // Create order
      const orderItems = cartItems.map(item => `${item.name} (${item.size}) x${item.quantity}`).join(', ');
      const orderId = `ORD-${Date.now()}`;
      
      if (customer?.id) {
        await createOrder({
          'Order ID': orderId,
          'Customer': [customer.id],
          'Products': orderItems,
          'Order Status': 'Pending',
          'Total Amount': total,
          'Shipping Address': `${formData.address}, ${formData.city}, ${formData.postalCode}, ${formData.country}`,
          'Payment Method': formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit Card',
          'Order Notes': formData.notes || ''
        });
      }

      // Redirect to success page or show success message
      alert('تم إرسال طلبك بنجاح! سنتواصل معك قريباً.');
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'المغرب',
        paymentMethod: 'cod',
        notes: '',
        newsletter: false
      });

    } catch (error) {
      console.error('Error submitting order:', error);
      alert('حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const moroccanCities = [
    'الرباط', 'الدار البيضاء', 'فاس', 'مراكش', 'أغادير', 'طنجة', 'مكناس', 'وجدة', 'القنيطرة', 'تطوان',
    'سلا', 'المحمدية', 'خريبكة', 'جديدة', 'بني ملال', 'الناظور', 'برشيد', 'تازة', 'خنيفرة', 'سطات'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/cart">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 ml-2" />
              العودة للسلة
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إتمام الطلب</h1>
            <p className="text-gray-600">املئي البيانات لإتمام طلبك</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    المعلومات الشخصية
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">الاسم الأول *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className={errors.firstName ? 'border-red-500' : ''}
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName">اسم العائلة *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className={errors.lastName ? 'border-red-500' : ''}
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">البريد الإلكتروني *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">رقم الهاتف *</Label>
                    <Input
                      id="phone"
                      placeholder="+212 6XX XXX XXX"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={errors.phone ? 'border-red-500' : ''}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    عنوان التوصيل
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="address">العنوان *</Label>
                    <Input
                      id="address"
                      placeholder="الشارع، الحي، رقم المنزل"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className={errors.address ? 'border-red-500' : ''}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">المدينة *</Label>
                      <Select value={formData.city} onValueChange={handleSelectChange('city')}>
                        <SelectTrigger className={errors.city ? 'border-red-500' : ''}>
                          <SelectValue placeholder="اختاري المدينة" />
                        </SelectTrigger>
                        <SelectContent>
                          {moroccanCities.map((city) => (
                            <SelectItem key={city} value={city}>{city}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="postalCode">الرمز البريدي</Label>
                      <Input
                        id="postalCode"
                        placeholder="12000"
                        value={formData.postalCode}
                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="country">البلد</Label>
                    <Select value={formData.country} onValueChange={handleSelectChange('country')}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="المغرب">المغرب</SelectItem>
                        <SelectItem value="الجزائر">الجزائر</SelectItem>
                        <SelectItem value="تونس">تونس</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    طريقة الدفع
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup 
                    value={formData.paymentMethod} 
                    onValueChange={handleSelectChange('paymentMethod')}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-2 space-x-reverse p-4 border rounded-lg">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">الدفع عند التوصيل</p>
                            <p className="text-sm text-gray-600">ادفعي نقداً عند استلام الطلب</p>
                          </div>
                          <Truck className="h-5 w-5 text-gray-400" />
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 space-x-reverse p-4 border rounded-lg opacity-50">
                      <RadioGroupItem value="card" id="card" disabled />
                      <Label htmlFor="card" className="flex-1 cursor-not-allowed">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">بطاقة ائتمانية</p>
                            <p className="text-sm text-gray-600">قريباً...</p>
                          </div>
                          <CreditCard className="h-5 w-5 text-gray-400" />
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Additional Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>ملاحظات إضافية</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="أي ملاحظات خاصة بطلبك (اختياري)"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={3}
                  />
                  
                  <div className="flex items-center space-x-2 space-x-reverse mt-4">
                    <Checkbox 
                      id="newsletter"
                      checked={formData.newsletter}
                      onCheckedChange={handleCheckboxChange('newsletter')}
                    />
                    <Label htmlFor="newsletter" className="text-sm cursor-pointer">
                      أريد الاشتراك في النشرة الإخبارية لتلقي العروض الخاصة
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>ملخص الطلب</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Cart Items */}
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-gray-600">المقاس: {item.size} × {item.quantity}</p>
                        </div>
                        <p className="font-medium text-sm">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>المجموع الفرعي</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>الشحن</span>
                      <span>
                        {shipping === 0 ? (
                          <Badge className="bg-green-100 text-green-800 text-xs">مجاني</Badge>
                        ) : (
                          formatPrice(shipping)
                        )}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-bold text-lg">
                    <span>المجموع الكلي</span>
                    <span className="text-rose-600">{formatPrice(total)}</span>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-lg py-6 mt-6"
                  >
                    {isSubmitting ? 'جاري الإرسال...' : 'تأكيد الطلب'}
                  </Button>

                  {/* Security Features */}
                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span>معلوماتك محمية وآمنة</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Truck className="h-4 w-4 text-blue-500" />
                      <span>توصيل سريع وموثوق</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}