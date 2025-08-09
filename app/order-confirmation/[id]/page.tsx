'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/header'
import Image from 'next/image'
import { CheckCircle, Package, Truck, MapPin, CreditCard, Calendar } from 'lucide-react'
import { useOrder } from '@/contexts/order-context'
import { Order } from '@/contexts/order-context'

export default function OrderConfirmationPage({ params }: { params: { id: string } }) {
  const { getOrderById } = useOrder()
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    const foundOrder = getOrderById(params.id)
    setOrder(foundOrder || null)
  }, [params.id, getOrderById])

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Заказ не найден</h1>
            <Link href="/" className="text-purple-600 hover:text-purple-700">
              Вернуться на главную
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const getDeliveryIcon = () => {
    switch (order.deliveryInfo.type) {
      case 'courier': return Truck
      case 'pickup': return MapPin
      case 'post': return Package
      default: return Package
    }
  }

  const getDeliveryTitle = () => {
    switch (order.deliveryInfo.type) {
      case 'courier': return 'Курьерская доставка'
      case 'pickup': return 'Самовывоз'
      case 'post': return 'Почтовая доставка'
      default: return 'Доставка'
    }
  }

  const getPaymentTitle = () => {
    switch (order.paymentInfo.method) {
      case 'card': return 'Банковская карта'
      case 'cash': return 'Наличными при получении'
      case 'online': return 'Онлайн платеж'
      default: return 'Оплата'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const DeliveryIcon = getDeliveryIcon()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Заголовок с подтверждением */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Заказ успешно оформлен!
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              Номер заказа: <span className="font-semibold">#{order.id}</span>
            </p>
            <p className="text-gray-600">
              Мы отправили подтверждение на {order.customerInfo.email}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Основная информация */}
          <div className="lg:col-span-2 space-y-6">
            {/* Информация о доставке */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <DeliveryIcon className="w-6 h-6 text-purple-600 mr-3" />
                <h2 className="text-lg font-semibold text-gray-900">
                  {getDeliveryTitle()}
                </h2>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                {order.deliveryInfo.type === 'courier' && (
                  <>
                    <p><span className="font-medium">Адрес:</span> {order.deliveryInfo.address}</p>
                    <p><span className="font-medium">Город:</span> {order.deliveryInfo.city}</p>
                    {order.deliveryInfo.postalCode && (
                      <p><span className="font-medium">Индекс:</span> {order.deliveryInfo.postalCode}</p>
                    )}
                  </>
                )}
                
                {order.deliveryInfo.type === 'pickup' && (
                  <p><span className="font-medium">Пункт выдачи:</span> {order.deliveryInfo.pickupPoint}</p>
                )}
                
                {order.deliveryInfo.type === 'post' && (
                  <>
                    <p><span className="font-medium">Адрес:</span> {order.deliveryInfo.address}</p>
                    <p><span className="font-medium">Город:</span> {order.deliveryInfo.city}</p>
                    <p><span className="font-medium">Индекс:</span> {order.deliveryInfo.postalCode}</p>
                  </>
                )}
                
                <p><span className="font-medium">Стоимость доставки:</span> {
                  order.deliveryInfo.cost === 0 ? 'Бесплатно' : `${order.deliveryInfo.cost.toLocaleString()} сум`
                }</p>
                
                {order.estimatedDelivery && (
                  <p><span className="font-medium">Ожидаемая доставка:</span> {formatDate(order.estimatedDelivery)}</p>
                )}
              </div>
            </div>

            {/* Информация об оплате */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <CreditCard className="w-6 h-6 text-purple-600 mr-3" />
                <h2 className="text-lg font-semibold text-gray-900">Оплата</h2>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium">Способ оплаты:</span> {getPaymentTitle()}</p>
                
                {order.paymentInfo.method === 'card' && order.paymentInfo.cardNumber && (
                  <p><span className="font-medium">Карта:</span> **** **** **** {order.paymentInfo.cardNumber.slice(-4)}</p>
                )}
                
                <p><span className="font-medium">Статус:</span> 
                  <span className="ml-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                    Ожидает обработки
                  </span>
                </p>
              </div>
            </div>

            {/* Контактная информация */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Контактная информация</h2>
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium">Имя:</span> {order.customerInfo.firstName} {order.customerInfo.lastName}</p>
                <p><span className="font-medium">Email:</span> {order.customerInfo.email}</p>
                <p><span className="font-medium">Телефон:</span> {order.customerInfo.phone}</p>
              </div>
            </div>

            {/* Товары в заказе */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Товары в заказе ({order.items.length})
              </h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 pb-4 border-b border-gray-100 last:border-b-0">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.media[0] || "/placeholder.svg?height=64&width=64"}
                        alt={item.title}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 line-clamp-2">
                        {item.title}
                      </h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-600">
                          Количество: {item.quantity}
                        </span>
                        <span className="font-medium text-gray-900">
                          {(item.price * item.quantity).toLocaleString()} сум
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Сводка заказа */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Сводка заказа</h3>
              
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Заказ от {formatDate(order.createdAt)}</span>
                </div>
                
                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Товары ({order.items.reduce((sum, item) => sum + item.quantity, 0)})
                    </span>
                    <span className="text-gray-900">
                      {order.totalAmount.toLocaleString()} сум
                    </span>
                  </div>
                  
                  {order.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Скидка</span>
                      <span className="text-green-600">
                        -{order.discount.toLocaleString()} сум
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Доставка</span>
                    <span className="text-gray-900">
                      {order.deliveryInfo.cost === 0 ? 'Бесплатно' : `${order.deliveryInfo.cost.toLocaleString()} сум`}
                    </span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between">
                      <span className="text-base font-semibold text-gray-900">Итого</span>
                      <span className="text-xl font-bold text-purple-600">
                        {order.finalAmount.toLocaleString()} сум
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <Link
                  href="/profile"
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors text-center block"
                >
                  Отследить заказ
                </Link>
                
                <Link
                  href="/"
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center block"
                >
                  Продолжить покупки
                </Link>
              </div>
              
              <div className="mt-6 p-3 bg-blue-50 rounded-lg">
                <div className="text-xs text-blue-700 space-y-1">
                  <p className="font-medium">Что дальше?</p>
                  <p>• Мы обработаем ваш заказ в течение 1-2 часов</p>
                  <p>• Отправим SMS с трек-номером</p>
                  <p>• Уведомим о готовности к получению</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
