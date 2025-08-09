'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/header'
import CheckoutSteps from '@/components/checkout-steps'
import CustomerInfoForm from '@/components/customer-info-form'
import DeliveryForm from '@/components/delivery-form'
import PaymentForm from '@/components/payment-form'
import OrderSummary from '@/components/order-summary'
import { useCart } from '@/contexts/cart-context'
import { useAuth } from '@/contexts/auth-context'
import { useOrder } from '@/contexts/order-context'
import { Loader2 } from 'lucide-react'

export default function CheckoutPage() {
  const router = useRouter()
  const { cartItems, getTotalPrice, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()
  const { createOrder } = useOrder()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || ''
  })
  const [deliveryInfo, setDeliveryInfo] = useState({
    type: 'courier' as const,
    address: '',
    city: '',
    postalCode: '',
    pickupPoint: '',
    cost: 0
  })
  const [paymentInfo, setPaymentInfo] = useState({
    method: 'card' as const,
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  })

  // Перенаправляем на корзину если она пуста
  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/cart')
    }
  }, [cartItems, router])

  // Заполняем данные пользователя если он авторизован
  useEffect(() => {
    if (user) {
      setCustomerInfo({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone
      })
    }
  }, [user])

  const totalAmount = getTotalPrice()
  const discount = Math.round(totalAmount * 0.1) // 10% скидка
  const finalAmount = totalAmount - discount + deliveryInfo.cost

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handlePlaceOrder = async () => {
    setIsLoading(true)
    
    try {
      const orderId = await createOrder({
        items: cartItems,
        customerInfo,
        deliveryInfo,
        paymentInfo,
        totalAmount,
        discount,
        finalAmount
      })
      
      // Очищаем корзину после успешного оформления
      clearCart()
      
      // Перенаправляем на страницу подтверждения
      router.push(`/order-confirmation/${orderId}`)
    } catch (error) {
      console.error('Error placing order:', error)
      // Здесь можно показать уведомление об ошибке
    } finally {
      setIsLoading(false)
    }
  }

  if (cartItems.length === 0) {
    return null // Или показать загрузку пока происходит редирект
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Оформление заказа</h1>
        
        <CheckoutSteps currentStep={currentStep} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              {currentStep === 1 && (
                <CustomerInfoForm
                  customerInfo={customerInfo}
                  setCustomerInfo={setCustomerInfo}
                  onNext={handleNextStep}
                />
              )}
              
              {currentStep === 2 && (
                <DeliveryForm
                  deliveryInfo={deliveryInfo}
                  setDeliveryInfo={setDeliveryInfo}
                  onNext={handleNextStep}
                  onPrev={handlePrevStep}
                />
              )}
              
              {currentStep === 3 && (
                <PaymentForm
                  paymentInfo={paymentInfo}
                  setPaymentInfo={setPaymentInfo}
                  onPrev={handlePrevStep}
                  onPlaceOrder={handlePlaceOrder}
                  isLoading={isLoading}
                />
              )}
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <OrderSummary
              items={cartItems}
              totalAmount={totalAmount}
              discount={discount}
              deliveryCost={deliveryInfo.cost}
              finalAmount={finalAmount}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
