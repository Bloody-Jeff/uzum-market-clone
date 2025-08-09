'use client'

import Header from '@/components/header'
import CartItem from '@/components/cart-item'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/contexts/cart-context'

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart()

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = getTotalPrice()
  const discount = Math.round(totalPrice * 0.1) // 10% скидка для примера
  const finalTotal = totalPrice - discount

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Корзина товаров</h1>
          <div className="flex flex-col items-center justify-center py-16">
            <Image
              src="/images/empty-cart.png"
              alt="Empty cart"
              width={200}
              height={150}
              className="mb-6"
            />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              В корзине пока нет товаров
            </h2>
            <p className="text-gray-600 text-center max-w-md mb-4">
              Начните с подборок на главной странице или найдите нужный товар через поиск
            </p>
            <Link 
              href="/"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              На главную
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Корзина товаров
            <span className="text-sm font-normal text-gray-600 ml-2">
              ({totalItems} товаров)
            </span>
          </h1>
          
          {cartItems.length > 0 && (
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 font-medium text-sm"
            >
              Очистить корзину
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {finalTotal.toLocaleString()} сум
              </h3>
              
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span>Товары ({totalItems})</span>
                  <span>{totalPrice.toLocaleString()} сум</span>
                </div>
                <div className="flex justify-between text-sm text-green-600">
                  <span>Скидка</span>
                  <span>-{discount.toLocaleString()} сум</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Итого</span>
                    <span>{finalTotal.toLocaleString()} сум</span>
                  </div>
                </div>
              </div>
              
              <Link
                href="/checkout"
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors mb-4 block text-center"
              >
                Оформить заказ
              </Link>
              
              <div className="text-xs text-gray-500 text-center">
                Доставка рассчитывается на следующем шаге
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
