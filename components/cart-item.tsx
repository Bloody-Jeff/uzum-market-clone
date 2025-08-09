'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { Product } from '@/lib/types'

interface CartItemProps {
  item: Product & { quantity: number }
  onUpdateQuantity: (id: string | number, quantity: number) => void
  onRemove: (id: string | number) => void
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const originalPrice = item.salePercentage > 0 
    ? Math.round(item.price / (1 - item.salePercentage / 100))
    : null

  return (
    <div className="flex items-center space-x-4 py-6 border-b border-gray-200 last:border-b-0">
      <Link href={`/product/${item.id}`} className="flex-shrink-0">
        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={item.media[0] || "/placeholder.svg?height=80&width=80"}
            alt={item.title}
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        </div>
      </Link>
      
      <div className="flex-1 min-w-0">
        <Link href={`/product/${item.id}`}>
          <h3 className="font-medium text-gray-900 mb-1 hover:text-purple-600 line-clamp-2">
            {item.title}
          </h3>
        </Link>
        
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold text-gray-900">
            {item.price.toLocaleString()} сум
          </span>
          {originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              {originalPrice.toLocaleString()} сум
            </span>
          )}
          {item.salePercentage > 0 && (
            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
              -{item.salePercentage}%
            </span>
          )}
        </div>
        
        <div className="text-sm text-gray-600 mt-1">
          За единицу: {item.price.toLocaleString()} сум
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={() => {
              if (item.quantity === 1) {
                onRemove(item.id)
              } else {
                onUpdateQuantity(item.id, item.quantity - 1)
              }
            }}
            className="p-2 hover:bg-gray-100 transition-colors"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="px-4 py-2 min-w-[3rem] text-center font-medium">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="p-2 hover:bg-gray-100 transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        
        <div className="text-right">
          <div className="font-semibold text-gray-900">
            {(item.price * item.quantity).toLocaleString()} сум
          </div>
          <button
            onClick={() => onRemove(item.id)}
            className="text-red-600 hover:text-red-700 text-sm flex items-center space-x-1 mt-1"
          >
            <Trash2 className="h-4 w-4" />
            <span>Удалить</span>
          </button>
        </div>
      </div>
    </div>
  )
}
