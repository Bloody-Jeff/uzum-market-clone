import { useState } from 'react'
import { ChevronRight } from 'lucide-react'

interface CustomerInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
}

interface CustomerInfoFormProps {
  customerInfo: CustomerInfo
  setCustomerInfo: (info: CustomerInfo) => void
  onNext: () => void
}

export default function CustomerInfoForm({ 
  customerInfo, 
  setCustomerInfo, 
  onNext 
}: CustomerInfoFormProps) {
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({})

  const validateForm = () => {
    const newErrors: Partial<CustomerInfo> = {}

    if (!customerInfo.firstName.trim()) {
      newErrors.firstName = 'Введите имя'
    }
    if (!customerInfo.lastName.trim()) {
      newErrors.lastName = 'Введите фамилию'
    }
    if (!customerInfo.email.trim()) {
      newErrors.email = 'Введите email'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      newErrors.email = 'Введите корректный email'
    }
    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'Введите номер телефона'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onNext()
    }
  }

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.startsWith('998')) {
      return `+${numbers}`
    }
    if (numbers.length > 0 && !value.startsWith('+')) {
      return `+998${numbers}`
    }
    return value
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Контактные данные</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Имя *
            </label>
            <input
              type="text"
              value={customerInfo.firstName}
              onChange={(e) => {
                setCustomerInfo({ ...customerInfo, firstName: e.target.value })
                if (errors.firstName) setErrors({ ...errors, firstName: '' })
              }}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ваше имя"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Фамилия *
            </label>
            <input
              type="text"
              value={customerInfo.lastName}
              onChange={(e) => {
                setCustomerInfo({ ...customerInfo, lastName: e.target.value })
                if (errors.lastName) setErrors({ ...errors, lastName: '' })
              }}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ваша фамилия"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            value={customerInfo.email}
            onChange={(e) => {
              setCustomerInfo({ ...customerInfo, email: e.target.value })
              if (errors.email) setErrors({ ...errors, email: '' })
            }}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="example@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Номер телефона *
          </label>
          <input
            type="tel"
            value={customerInfo.phone}
            onChange={(e) => {
              const formatted = formatPhoneNumber(e.target.value)
              setCustomerInfo({ ...customerInfo, phone: formatted })
              if (errors.phone) setErrors({ ...errors, phone: '' })
            }}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="+998 90 123 45 67"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center space-x-2"
          >
            <span>Далее</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  )
}
