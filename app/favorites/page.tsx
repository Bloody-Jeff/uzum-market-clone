'use client'

import Header from '@/components/header'
import ProductCard from '@/components/product-card'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/contexts/cart-context'

export default function FavoritesPage() {
  const { favorites } = useCart()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          Избранное
          {favorites.length > 0 && (
            <span className="text-sm font-normal text-gray-600 ml-2">
              ({favorites.length} товаров)
            </span>
          )}
        </h1>
        
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Image
              src="/images/empty-favorites.png"
              alt="Empty favorites"
              width={200}
              height={150}
              className="mb-6"
            />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Добавьте то, что понравилось
            </h2>
            <p className="text-gray-600 text-center max-w-md mb-4">
              Перейдите на главную страницу и нажмите на ♡ в товаре
            </p>
            <Link 
              href="/"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              На главную
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {favorites.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
