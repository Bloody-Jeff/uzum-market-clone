'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { Product } from '@/lib/types'
import { useCart } from '@/contexts/cart-context'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, addToFavorites, removeFromFavorites, isInFavorites } = useCart()
  const isFavorite = isInFavorites(product.id)
  
  const originalPrice = product.salePercentage > 0 
    ? Math.round(product.price / (1 - product.salePercentage / 100))
    : null

  const handleFavoriteClick = () => {
    if (isFavorite) {
      removeFromFavorites(product.id)
    } else {
      addToFavorites(product)
    }
  }

  const handleAddToCart = () => {
    addToCart(product)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      <div className="relative p-4">
        {product.isBlackFriday && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded z-10">
            BLACK FRIDAY
          </div>
        )}
        
        {product.salePercentage > 0 && (
          <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded z-10">
            -{product.salePercentage}%
          </div>
        )}
        
        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-6 right-6 z-10 w-8 h-8 flex items-center justify-center"
        >
          <Heart 
            className={`h-6 w-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-gray-600'}`} 
          />
        </button>
        
        {/* Product Image */}
        <Link href={`/product/${product.id}`}>
          <div className="aspect-square bg-gray-100 rounded-2xl mb-4 overflow-hidden flex items-center justify-center">
            <Image
              src={product.media[0] || "/placeholder.svg?height=200&width=200"}
              alt={product.title}
              width={200}
              height={200}
              className="w-full h-full object-cover"
            />
          </div>
        </Link>
        
        {/* Product Title */}
        <Link href={`/product/${product.id}`}>
          <h3 className="text-sm text-gray-900 mb-3 line-clamp-2 hover:text-purple-600 leading-5">
            {product.title}
          </h3>
        </Link>
        
        {/* Rating Stars */}
        <div className="flex items-center mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(product.rating) 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'text-gray-200'
              }`}
            />
          ))}
          <span className="text-xs text-gray-500 ml-2">({product.rating})</span>
        </div>
        
        {/* Price Section */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {originalPrice && (
              <span className="text-xs text-gray-400 line-through mb-1">
                {originalPrice.toLocaleString()} сум
              </span>
            )}
            <span className="text-base font-semibold text-gray-900">
              {product.price.toLocaleString()} сум
            </span>
          </div>
          
          {/* Add to Cart Button */}
          <button 
            onClick={handleAddToCart}
            className="w-10 h-10 bg-gray-100 hover:bg-purple-100 rounded-xl flex items-center justify-center transition-colors group"
          >
            <ShoppingCart className="h-5 w-5 text-gray-600 group-hover:text-purple-600" />
          </button>
        </div>
      </div>
    </div>
  )
}
