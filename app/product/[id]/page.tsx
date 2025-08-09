'use client'

import { useState } from 'react'
import Header from '@/components/header'
import ProductCard from '@/components/product-card'
import Image from 'next/image'
import { Minus, Plus, Star, Heart } from 'lucide-react'
import { allProducts } from '@/lib/mock-data'
import { useCart } from '@/contexts/cart-context'

export default function ProductPage({ params }: { params: { id: string } }) {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  
  const { addToCart, addToFavorites, removeFromFavorites, isInFavorites } = useCart()
  
  const product = allProducts.find(p => p.id.toString() === params.id) || allProducts[0]
  const relatedProducts = allProducts.filter(p => p.type === product.type && p.id !== product.id).slice(0, 5)
  const isFavorite = isInFavorites(product.id)
  
  const originalPrice = product.salePercentage > 0 
    ? Math.round(product.price / (1 - product.salePercentage / 100))
    : null

  const handleAddToCart = () => {
    addToCart(product, quantity)
  }

  const handleFavoriteClick = () => {
    if (isFavorite) {
      removeFromFavorites(product.id)
    } else {
      addToFavorites(product)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="flex space-x-4">
            <div className="flex flex-col space-y-2">
              {product.media.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-16 h-16 border-2 rounded-lg overflow-hidden ${
                    selectedImage === index ? 'border-purple-600' : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Product image ${index + 1}`}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
            
            <div className="flex-1 bg-white rounded-lg p-8">
              <div className="relative">
                {product.isBlackFriday && (
                  <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded text-sm font-medium">
                    BLACK FRIDAY
                  </span>
                )}
                {product.salePercentage > 0 && (
                  <span className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded text-sm font-medium">
                    -{product.salePercentage}%
                  </span>
                )}
                <Image
                  src={product.media[selectedImage] || "/placeholder.svg"}
                  alt="Product main image"
                  width={400}
                  height={400}
                  className="w-full h-full object-contain"
                />
              </div>
              
              {/* Image navigation dots */}
              <div className="flex justify-center space-x-2 mt-4">
                {product.media.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-2 h-2 rounded-full ${
                      selectedImage === index ? 'bg-gray-800' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Product Info */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {product.title}
            </h1>
            
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating) 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-600 ml-2">{product.rating}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-2xl font-bold text-gray-900">
                {product.price.toLocaleString()} сум
              </span>
              {originalPrice && (
                <span className="text-lg text-gray-400 line-through">
                  {originalPrice.toLocaleString()} сум
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-4 mb-8">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-100"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-6 py-3 min-w-[4rem] text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-gray-100"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {product.description && (
              <p className="text-gray-600 mb-8 leading-relaxed">
                {product.description.replace(/<br>/g, ' ').substring(0, 500)}...
              </p>
            )}
            
            <div className="flex space-x-4">
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                Добавить в корзину
              </button>
              <button 
                onClick={handleFavoriteClick}
                className={`px-6 py-3 border rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                  isFavorite 
                    ? 'border-red-500 text-red-500 bg-red-50' 
                    : 'border-purple-600 text-purple-600 hover:bg-purple-50'
                }`}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                <span>{isFavorite ? 'В избранном' : 'Добавить в избранное'}</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Product Description */}
        {product.description && (
          <div className="bg-white rounded-lg p-8 mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Описание товара</h2>
            <div 
              className="text-gray-600 leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: product.description.replace(/<br>/g, '<br/>') 
              }}
            />
          </div>
        )}
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Похожие товары</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
