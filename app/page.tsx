'use client'

import { useState } from 'react'
import Header from '@/components/header'
import HeroBanner from '@/components/hero-banner'
import ProductGrid from '@/components/product-grid'
import { allProducts } from '@/lib/mock-data'

export default function HomePage() {
  const furnitureProducts = allProducts.filter(p => p.type === 'furniture').slice(0, 15)
  const pcProducts = allProducts.filter(p => p.type === 'PC').slice(0, 5)
  const audioProducts = allProducts.filter(p => p.type === 'audio').slice(0, 5)
  const tvProducts = allProducts.filter(p => p.type === 'TV').slice(0, 5)
  const kitchenProducts = allProducts.filter(p => p.type === 'kitchen').slice(0, 5)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <HeroBanner />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <ProductGrid title="Популярное" products={furnitureProducts} />
          <ProductGrid title="Компьютеры и комплектующие" products={pcProducts} />
          <ProductGrid title="Аудиотехника" products={audioProducts} />
          <ProductGrid title="Телевизоры" products={tvProducts} />
          <ProductGrid title="Бытовая техника" products={kitchenProducts} />
        </div>
      </main>
    </div>
  )
}
