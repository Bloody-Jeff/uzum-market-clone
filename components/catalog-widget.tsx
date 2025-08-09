import Link from 'next/link'
import { categories } from '@/lib/mock-data'

export default function CatalogWidget() {
  return (
    <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50 w-64">
      <div className="p-4">
        <div className="text-xs text-gray-500 mb-3">Категории товаров</div>
        <Link
          href="/catalog"
          className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center justify-between block"
        >
          <span className="text-sm font-medium">Все категории</span>
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/catalog?category=${category.id}`}
            className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center justify-between block"
          >
            <span className="text-sm font-medium">{category.name}</span>
            <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">
              {category.count} товаров
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
