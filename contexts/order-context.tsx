'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Product } from '@/lib/types'

export interface OrderItem extends Product {
  quantity: number
}

export interface DeliveryInfo {
  type: 'pickup' | 'courier' | 'post'
  address?: string
  city?: string
  postalCode?: string
  pickupPoint?: string
  cost: number
}

export interface PaymentInfo {
  method: 'card' | 'cash' | 'online'
  cardNumber?: string
  cardHolder?: string
  expiryDate?: string
  cvv?: string
}

export interface Order {
  id: string
  items: OrderItem[]
  customerInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  deliveryInfo: DeliveryInfo
  paymentInfo: PaymentInfo
  totalAmount: number
  discount: number
  finalAmount: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
  estimatedDelivery?: string
}

interface OrderContextType {
  orders: Order[]
  currentOrder: Partial<Order> | null
  createOrder: (orderData: Omit<Order, 'id' | 'status' | 'createdAt'>) => Promise<string>
  getOrderById: (id: string) => Order | undefined
  updateOrderStatus: (id: string, status: Order['status']) => void
  setCurrentOrder: (order: Partial<Order> | null) => void
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [currentOrder, setCurrentOrder] = useState<Partial<Order> | null>(null)

  // Загружаем заказы из localStorage при инициализации
  useEffect(() => {
    const savedOrders = localStorage.getItem('uzum-orders')
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders))
    }
  }, [])

  // Сохраняем заказы в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('uzum-orders', JSON.stringify(orders))
  }, [orders])

  const createOrder = async (orderData: Omit<Order, 'id' | 'status' | 'createdAt'>): Promise<string> => {
    // Симуляция API запроса
    await new Promise(resolve => setTimeout(resolve, 1000))

    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() // +3 дня
    }

    setOrders(prev => [newOrder, ...prev])
    return newOrder.id
  }

  const getOrderById = (id: string): Order | undefined => {
    return orders.find(order => order.id === id)
  }

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === id ? { ...order, status } : order
    ))
  }

  return (
    <OrderContext.Provider value={{
      orders,
      currentOrder,
      createOrder,
      getOrderById,
      updateOrderStatus,
      setCurrentOrder
    }}>
      {children}
    </OrderContext.Provider>
  )
}

export function useOrder() {
  const context = useContext(OrderContext)
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider')
  }
  return context
}
