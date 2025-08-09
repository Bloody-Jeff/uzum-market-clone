'use client'

import { useState } from 'react'
import Header from '@/components/header'
import Image from 'next/image'
import { User, Package, Heart, Settings, LogOut, Edit2, Eye, Calendar, Truck } from 'lucide-react'
import { useOrder } from '@/contexts/order-context'
import { useCart } from '@/contexts/cart-context'
import Link from 'next/link'

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const { orders } = useOrder()
  const { favorites } = useCart()
  const [userInfo, setUserInfo] = useState({
    firstName: 'Иван',
    lastName: 'Иванов',
    email: 'ivan@example.com',
    phone: '+998 90 123 45 67',
    birthDate: '1990-01-01',
    gender: 'male'
  })

  const tabs = [
    { id: 'profile', name: 'Профиль', icon: User },
    { id: 'orders', name: 'Заказы', icon: Package, count: orders.length },
    { id: 'favorites', name: 'Избранное', icon: Heart, count: favorites.length },
    { id: 'settings', name: 'Настройки', icon: Settings }
  ]

  const handleSave = () => {
    setIsEditing(false)
    // Save user info logic here
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-purple-100 text-purple-800'
      case 'shipped': return 'bg-indigo-100 text-indigo-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Ожидает обработки'
      case 'confirmed': return 'Подтвержден'
      case 'processing': return 'Обрабатывается'
      case 'shipped': return 'Отправлен'
      case 'delivered': return 'Доставлен'
      case 'cancelled': return 'Отменен'
      default: return status
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {userInfo.firstName[0]}{userInfo.lastName[0]}
                  </span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {userInfo.firstName} {userInfo.lastName}
                  </h2>
                  <p className="text-sm text-gray-600">{userInfo.email}</p>
                </div>
              </div>
              
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-purple-100 text-purple-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="h-5 w-5" />
                        <span>{tab.name}</span>
                      </div>
                      {tab.count !== undefined && tab.count > 0 && (
                        <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                          {tab.count}
                        </span>
                      )}
                    </button>
                  )
                })}
                <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors">
                  <LogOut className="h-5 w-5" />
                  <span>Выйти</span>
                </button>
              </nav>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              {activeTab === 'profile' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Личная информация</h1>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center space-x-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                      <span>{isEditing ? 'Отменить' : 'Редактировать'}</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Имя
                      </label>
                      <input
                        type="text"
                        value={userInfo.firstName}
                        onChange={(e) => setUserInfo({...userInfo, firstName: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Фамилия
                      </label>
                      <input
                        type="text"
                        value={userInfo.lastName}
                        onChange={(e) => setUserInfo({...userInfo, lastName: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={userInfo.email}
                        onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Телефон
                      </label>
                      <input
                        type="tel"
                        value={userInfo.phone}
                        onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Дата рождения
                      </label>
                      <input
                        type="date"
                        value={userInfo.birthDate}
                        onChange={(e) => setUserInfo({...userInfo, birthDate: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Пол
                      </label>
                      <select
                        value={userInfo.gender}
                        onChange={(e) => setUserInfo({...userInfo, gender: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
                      >
                        <option value="male">Мужской</option>
                        <option value="female">Женский</option>
                      </select>
                    </div>
                  </div>
                  
                  {isEditing && (
                    <div className="mt-6 flex space-x-4">
                      <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Сохранить
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Отменить
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'orders' && (
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-6">Мои заказы</h1>
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">У вас пока нет заказов</h3>
                      <p className="text-gray-600 mb-4">Начните покупки, чтобы увидеть свои заказы здесь</p>
                      <Link
                        href="/"
                        className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Начать покупки
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-4">
                              <h3 className="font-semibold text-gray-900">
                                Заказ #{order.id}
                              </h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                {getStatusText(order.status)}
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-gray-900">
                                {order.finalAmount.toLocaleString()} сум
                              </div>
                              <div className="text-sm text-gray-600 flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {formatDate(order.createdAt)}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="flex -space-x-2">
                                {order.items.slice(0, 3).map((item, index) => (
                                  <div key={index} className="w-10 h-10 bg-gray-100 rounded-lg border-2 border-white overflow-hidden">
                                    <Image
                                      src={item.media[0] || "/placeholder.svg?height=40&width=40"}
                                      alt={item.title}
                                      width={40}
                                      height={40}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ))}
                                {order.items.length > 3 && (
                                  <div className="w-10 h-10 bg-gray-200 rounded-lg border-2 border-white flex items-center justify-center">
                                    <span className="text-xs font-medium text-gray-600">
                                      +{order.items.length - 3}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {order.items.reduce((sum, item) => sum + item.quantity, 0)} товаров
                                </div>
                                <div className="text-sm text-gray-600 flex items-center">
                                  <Truck className="w-4 h-4 mr-1" />
                                  {order.deliveryInfo.type === 'courier' && 'Курьерская доставка'}
                                  {order.deliveryInfo.type === 'pickup' && 'Самовывоз'}
                                  {order.deliveryInfo.type === 'post' && 'Почтовая доставка'}
                                </div>
                              </div>
                            </div>
                            
                            <Link
                              href={`/order-confirmation/${order.id}`}
                              className="flex items-center space-x-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              <span>Подробнее</span>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'favorites' && (
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-6">Избранные товары</h1>
                  {favorites.length === 0 ? (
                    <div className="text-center py-12">
                      <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Список избранного пуст</h3>
                      <p className="text-gray-600 mb-4">Добавляйте товары в избранное, чтобы не потерять их</p>
                      <Link
                        href="/"
                        className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Начать покупки
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {favorites.map((product) => (
                        <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                            <Image
                              src={product.media[0] || "/placeholder.svg?height=200&width=200"}
                              alt={product.title}
                              width={200}
                              height={200}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">
                            {product.title}
                          </h3>
                          <div className="text-lg font-semibold text-gray-900">
                            {product.price.toLocaleString()} сум
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'settings' && (
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-6">Настройки</h1>
                  <div className="space-y-6">
                    <div className="border-b border-gray-200 pb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Уведомления</h3>
                      <div className="space-y-4">
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" defaultChecked />
                          <span className="ml-3 text-sm text-gray-700">Email уведомления о заказах</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                          <span className="ml-3 text-sm text-gray-700">SMS уведомления</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" defaultChecked />
                          <span className="ml-3 text-sm text-gray-700">Уведомления о скидках и акциях</span>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Безопасность</h3>
                      <button className="text-purple-600 hover:text-purple-700 font-medium">
                        Изменить пароль
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
