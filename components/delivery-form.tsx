import { useState } from 'react'
import { ChevronLeft, ChevronRight, Truck, MapPin, Package } from 'lucide-react'

interface DeliveryInfo {
  type: 'pickup' | 'courier' | 'post'
  address?: string
  city?: string
  postalCode?: string
  pickupPoint?: string
  cost: number
}

interface DeliveryFormProps {
  deliveryInfo: DeliveryInfo
  setDeliveryInfo: (info: DeliveryInfo) => void
  onNext: () => void
  onPrev: () => void
}

export default function DeliveryForm({ 
  deliveryInfo, 
  setDeliveryInfo, 
  onNext, 
  onPrev 
}: DeliveryFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const deliveryOptions = [
    {
      id: 'courier',
      title: 'Курьерская доставка',
      description: 'Доставка по указанному адресу',
      icon: Truck,
      cost: 15000,
      time: '1-2 дня'
    },
    {
      id: 'pickup',
      title: 'Самовывоз',
      description: 'Забрать из пункта выдачи',
      icon: MapPin,
      cost: 0,
      time: 'Сегодня'
    },
    {
      id: 'post',
      title: 'Почтовая доставка',
      description: 'Доставка почтой России',
      icon: Package,
      cost: 8000,
      time: '3-5 дней'
    }
  ]

  const pickupPoints = [
    'ТЦ Mega Planet, ул. Ойбека 44',
    'ТЦ Next, ул. Шахрисабз 1',
    'ТЦ Compass, ул. Бабура 174',
    'Магазин на Чиланзаре, ул. Катартал 1'
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (deliveryInfo.type === 'courier') {
      if (!deliveryInfo.address?.trim()) {
        newErrors.address = 'Введите адрес доставки'
      }
      if (!deliveryInfo.city?.trim()) {
        newErrors.city = 'Введите город'
      }
    }

    if (deliveryInfo.type === 'pickup' && !deliveryInfo.pickupPoint) {
      newErrors.pickupPoint = 'Выберите пункт выдачи'
    }

    if (deliveryInfo.type === 'post') {
      if (!deliveryInfo.address?.trim()) {
        newErrors.address = 'Введите адрес доставки'
      }
      if (!deliveryInfo.city?.trim()) {
        newErrors.city = 'Введите город'
      }
      if (!deliveryInfo.postalCode?.trim()) {
        newErrors.postalCode = 'Введите почтовый индекс'
      }
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

  const handleDeliveryTypeChange = (type: 'pickup' | 'courier' | 'post') => {
    const option = deliveryOptions.find(opt => opt.id === type)
    setDeliveryInfo({
      ...deliveryInfo,
      type,
      cost: option?.cost || 0
    })
    setErrors({})
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Способ доставки</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Выбор способа доставки */}
        <div className="space-y-3">
          {deliveryOptions.map((option) => {
            const Icon = option.icon
            return (
              <label
                key={option.id}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                  deliveryInfo.type === option.id
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="deliveryType"
                  value={option.id}
                  checked={deliveryInfo.type === option.id}
                  onChange={(e) => handleDeliveryTypeChange(e.target.value as any)}
                  className="sr-only"
                />
                <Icon className="w-6 h-6 text-purple-600 mr-4" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{option.title}</div>
                  <div className="text-sm text-gray-600">{option.description}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {option.cost === 0 ? 'Бесплатно' : `${option.cost.toLocaleString()} сум`} • {option.time}
                  </div>
                </div>
              </label>
            )
          })}
        </div>

        {/* Форма для курьерской доставки */}
        {deliveryInfo.type === 'courier' && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900">Адрес доставки</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Город *
                </label>
                <input
                  type="text"
                  value={deliveryInfo.city || ''}
                  onChange={(e) => {
                    setDeliveryInfo({ ...deliveryInfo, city: e.target.value })
                    if (errors.city) setErrors({ ...errors, city: '' })
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.city ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ташкент"
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Почтовый индекс
                </label>
                <input
                  type="text"
                  value={deliveryInfo.postalCode || ''}
                  onChange={(e) => setDeliveryInfo({ ...deliveryInfo, postalCode: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="100000"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Адрес *
              </label>
              <input
                type="text"
                value={deliveryInfo.address || ''}
                onChange={(e) => {
                  setDeliveryInfo({ ...deliveryInfo, address: e.target.value })
                  if (errors.address) setErrors({ ...errors, address: '' })
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Улица, дом, квартира"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
              )}
            </div>
          </div>
        )}

        {/* Выбор пункта выдачи */}
        {deliveryInfo.type === 'pickup' && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900">Выберите пункт выдачи</h3>
            <div className="space-y-2">
              {pickupPoints.map((point, index) => (
                <label
                  key={index}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    deliveryInfo.pickupPoint === point
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="pickupPoint"
                    value={point}
                    checked={deliveryInfo.pickupPoint === point}
                    onChange={(e) => {
                      setDeliveryInfo({ ...deliveryInfo, pickupPoint: e.target.value })
                      if (errors.pickupPoint) setErrors({ ...errors, pickupPoint: '' })
                    }}
                    className="mr-3"
                  />
                  <span className="text-sm">{point}</span>
                </label>
              ))}
            </div>
            {errors.pickupPoint && (
              <p className="text-sm text-red-600">{errors.pickupPoint}</p>
            )}
          </div>
        )}

        {/* Форма для почтовой доставки */}
        {deliveryInfo.type === 'post' && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900">Почтовый адрес</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Город *
                </label>
                <input
                  type="text"
                  value={deliveryInfo.city || ''}
                  onChange={(e) => {
                    setDeliveryInfo({ ...deliveryInfo, city: e.target.value })
                    if (errors.city) setErrors({ ...errors, city: '' })
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.city ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ташкент"
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Почтовый индекс *
                </label>
                <input
                  type="text"
                  value={deliveryInfo.postalCode || ''}
                  onChange={(e) => {
                    setDeliveryInfo({ ...deliveryInfo, postalCode: e.target.value })
                    if (errors.postalCode) setErrors({ ...errors, postalCode: '' })
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.postalCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="100000"
                />
                {errors.postalCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Адрес *
              </label>
              <input
                type="text"
                value={deliveryInfo.address || ''}
                onChange={(e) => {
                  setDeliveryInfo({ ...deliveryInfo, address: e.target.value })
                  if (errors.address) setErrors({ ...errors, address: '' })
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Улица, дом, квартира"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
              )}
            </div>
          </div>
        )}
        
        <div className="flex justify-between">
          <button
            type="button"
            onClick={onPrev}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center space-x-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Назад</span>
          </button>
          
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
