import { useState } from 'react'
import { ChevronLeft, CreditCard, Banknote, Smartphone, Loader2 } from 'lucide-react'

interface PaymentInfo {
  method: 'card' | 'cash' | 'online'
  cardNumber?: string
  cardHolder?: string
  expiryDate?: string
  cvv?: string
}

interface PaymentFormProps {
  paymentInfo: PaymentInfo
  setPaymentInfo: (info: PaymentInfo) => void
  onPrev: () => void
  onPlaceOrder: () => void
  isLoading: boolean
}

export default function PaymentForm({ 
  paymentInfo, 
  setPaymentInfo, 
  onPrev, 
  onPlaceOrder,
  isLoading 
}: PaymentFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const paymentMethods = [
    {
      id: 'card',
      title: 'Банковская карта',
      description: 'Visa, MasterCard, UzCard',
      icon: CreditCard
    },
    {
      id: 'cash',
      title: 'Наличными при получении',
      description: 'Оплата курьеру или в пункте выдачи',
      icon: Banknote
    },
    {
      id: 'online',
      title: 'Онлайн платежи',
      description: 'Click, Payme, Apelsin',
      icon: Smartphone
    }
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (paymentInfo.method === 'card') {
      if (!paymentInfo.cardNumber?.trim()) {
        newErrors.cardNumber = 'Введите номер карты'
      } else if (paymentInfo.cardNumber.replace(/\s/g, '').length < 16) {
        newErrors.cardNumber = 'Номер карты должен содержать 16 цифр'
      }
      
      if (!paymentInfo.cardHolder?.trim()) {
        newErrors.cardHolder = 'Введите имя держателя карты'
      }
      
      if (!paymentInfo.expiryDate?.trim()) {
        newErrors.expiryDate = 'Введите срок действия'
      } else if (!/^\d{2}\/\d{2}$/.test(paymentInfo.expiryDate)) {
        newErrors.expiryDate = 'Формат: ММ/ГГ'
      }
      
      if (!paymentInfo.cvv?.trim()) {
        newErrors.cvv = 'Введите CVV код'
      } else if (paymentInfo.cvv.length < 3) {
        newErrors.cvv = 'CVV должен содержать 3 цифры'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onPlaceOrder()
    }
  }

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
  }

  const formatExpiryDate = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length >= 2) {
      return numbers.substring(0, 2) + '/' + numbers.substring(2, 4)
    }
    return numbers
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Способ оплаты</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Выбор способа оплаты */}
        <div className="space-y-3">
          {paymentMethods.map((method) => {
            const Icon = method.icon
            return (
              <label
                key={method.id}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                  paymentInfo.method === method.id
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={paymentInfo.method === method.id}
                  onChange={(e) => {
                    setPaymentInfo({ ...paymentInfo, method: e.target.value as any })
                    setErrors({})
                  }}
                  className="sr-only"
                />
                <Icon className="w-6 h-6 text-purple-600 mr-4" />
                <div>
                  <div className="font-medium text-gray-900">{method.title}</div>
                  <div className="text-sm text-gray-600">{method.description}</div>
                </div>
              </label>
            )
          })}
        </div>

        {/* Форма для банковской карты */}
        {paymentInfo.method === 'card' && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900">Данные карты</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Номер карты *
              </label>
              <input
                type="text"
                value={paymentInfo.cardNumber || ''}
                onChange={(e) => {
                  const formatted = formatCardNumber(e.target.value)
                  if (formatted.replace(/\s/g, '').length <= 16) {
                    setPaymentInfo({ ...paymentInfo, cardNumber: formatted })
                    if (errors.cardNumber) setErrors({ ...errors, cardNumber: '' })
                  }
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
              {errors.cardNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Имя держателя карты *
              </label>
              <input
                type="text"
                value={paymentInfo.cardHolder || ''}
                onChange={(e) => {
                  setPaymentInfo({ ...paymentInfo, cardHolder: e.target.value.toUpperCase() })
                  if (errors.cardHolder) setErrors({ ...errors, cardHolder: '' })
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.cardHolder ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="IVAN IVANOV"
              />
              {errors.cardHolder && (
                <p className="mt-1 text-sm text-red-600">{errors.cardHolder}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Срок действия *
                </label>
                <input
                  type="text"
                  value={paymentInfo.expiryDate || ''}
                  onChange={(e) => {
                    const formatted = formatExpiryDate(e.target.value)
                    if (formatted.replace(/\D/g, '').length <= 4) {
                      setPaymentInfo({ ...paymentInfo, expiryDate: formatted })
                      if (errors.expiryDate) setErrors({ ...errors, expiryDate: '' })
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="12/25"
                  maxLength={5}
                />
                {errors.expiryDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV *
                </label>
                <input
                  type="text"
                  value={paymentInfo.cvv || ''}
                  onChange={(e) => {
                    const numbers = e.target.value.replace(/\D/g, '')
                    if (numbers.length <= 3) {
                      setPaymentInfo({ ...paymentInfo, cvv: numbers })
                      if (errors.cvv) setErrors({ ...errors, cvv: '' })
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.cvv ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="123"
                  maxLength={3}
                />
                {errors.cvv && (
                  <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Информация для наличной оплаты */}
        {paymentInfo.method === 'cash' && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <Banknote className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
              <div>
                <h4 className="font-medium text-blue-900">Оплата наличными</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Вы сможете оплатить заказ наличными при получении. 
                  Убедитесь, что у вас есть точная сумма или сдача.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Информация для онлайн платежей */}
        {paymentInfo.method === 'online' && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start">
              <Smartphone className="w-5 h-5 text-green-600 mt-0.5 mr-3" />
              <div>
                <h4 className="font-medium text-green-900">Онлайн платежи</h4>
                <p className="text-sm text-green-700 mt-1">
                  После подтверждения заказа вы будете перенаправлены на страницу 
                  выбранной платежной системы для завершения оплаты.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-between">
          <button
            type="button"
            onClick={onPrev}
            disabled={isLoading}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Назад</span>
          </button>
          
          <button
            type="submit"
            disabled={isLoading}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Оформление...</span>
              </>
            ) : (
              <span>Оформить заказ</span>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
