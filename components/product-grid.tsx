import ProductCard from './product-card'
import { Product } from '@/lib/types'

interface ProductGridProps {
  title: string
  products: Product[]
}

export default function ProductGrid({ title, products }: ProductGridProps) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {products.length >= 15 && (
        <div className="text-center mt-6">
          <button className="text-purple-600 hover:text-purple-700 font-medium">
            Показать еще 30
          </button>
        </div>
      )}
    </section>
  )
}
