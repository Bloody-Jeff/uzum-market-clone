import Image from 'next/image'
import { OrderItem } from '@/contexts/order-context'

interface OrderSummaryProps {
  items: OrderItem[]
  totalAmount: number
  discount: number
  deliveryCost: number
  finalAmount: number
}

export default function OrderSummary({ 
  items, 
  totalAmount, 
  discount, 
  deliveryCost, 
  finalAmount 
}: OrderSummaryProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Ваш заказ</h3>
      
      {/* Список товаров */}
      <div className="space-y-3 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={item.media[0] || "/placeholder.svg?height=48&width=48"}
                alt={item.title}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                {item.title}
              </h4>
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm text-gray-600">
                  {item.quantity} шт.
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {(item.price * item.quantity).toLocaleString()} сум
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Расчет стоимости */}
      <div className="space-y-2 border-t border-gray-200 pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            Товары ({items.reduce((sum, item) => sum + item.quantity, 0)})
          </span>
          <span className="text-gray-900">
            {totalAmount.toLocaleString()} сум
          </span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Скидка</span>
            <span className="text-green-600">
              -{discount.toLocaleString()} сум
            </span>
          </div>
        )}
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Доставка</span>
          <span className="text-gray-900">
            {deliveryCost === 0 ? 'Бесплатно' : `${deliveryCost.toLocaleString()} сум`}
          </span>
        </div>
        
        <div className="border-t border-gray-200 pt-2">
          <div className="flex justify-between">
            <span className="text-base font-semibold text-gray-900">Итого</span>
            <span className="text-lg font-bold text-gray-900">
              {finalAmount.toLocaleString()} сум
            </span>
          </div>
        </div>
      </div>
      
      {/* Дополнительная информация */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg">
        <div className="text-xs text-gray-600 space-y-1">
          <p>• Бесплатная доставка от 100 000 сум</p>
          <p>• Возврат в течение 14 дней</p>
          <p>• Гарантия на все товары</p>
        </div>
      </div>
    </div>
  )
}
