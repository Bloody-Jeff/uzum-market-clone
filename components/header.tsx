'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, User, Heart, ShoppingCart, LogOut, UserCircle } from 'lucide-react'
import SearchWidget from './search-widget'
import CatalogWidget from './catalog-widget'
import { useCart } from '@/contexts/cart-context'
import { useAuth } from '@/contexts/auth-context'

export default function Header() {
  const [showSearch, setShowSearch] = useState(false)
  const [showCatalog, setShowCatalog] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const { getTotalItems, favorites } = useCart()
  const { user, logout, isAuthenticated } = useAuth()

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 flex items-center justify-center">
              <Image
                src="/images/uzum-logo-new.png"
                alt="Uzum Market"
                width={32}
                height={32}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xl font-semibold text-gray-900">uzum market</span>
          </Link>

          {/* Left Navigation */}
          <div className="flex items-center space-x-6 ml-8">
            <button 
              className="bg-purple-100 text-purple-600 px-6 py-2 rounded-xl font-medium hover:bg-purple-200 transition-colors relative"
              onMouseEnter={() => setShowCatalog(true)}
              onMouseLeave={() => setShowCatalog(false)}
            >
              Каталог
              {showCatalog && <CatalogWidget />}
            </button>
            
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Искать товары"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onFocus={() => setShowSearch(true)}
                  onBlur={() => setTimeout(() => setShowSearch(false), 200)}
                  className="w-full pl-4 pr-12 py-2 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
                />
                <Search className="absolute right-4 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              {showSearch && searchValue && <SearchWidget query={searchValue} />}
            </div>
          </div>

          {/* Right Navigation */}
          <div className="flex items-center space-x-6">
            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="text-gray-700 hover:text-gray-900 flex items-center space-x-1"
                >
                  <UserCircle className="h-5 w-5" />
                  <span className="text-sm">{user?.firstName}</span>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <Link 
                      href="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Мой профиль
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Выйти</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login" className="text-gray-700 hover:text-gray-900 flex items-center space-x-1">
                <User className="h-5 w-5" />
                <span className="text-sm">Вход</span>
              </Link>
            )}
            
            <Link href="/favorites" className="text-gray-700 hover:text-gray-900 flex items-center space-x-1 relative">
              <Heart className="h-5 w-5" />
              <span className="text-sm">Избранное</span>
              {favorites.length > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>
            
            <Link href="/cart" className="text-gray-700 hover:text-gray-900 flex items-center space-x-1">
              <ShoppingCart className="h-5 w-5" />
              <span className="text-sm">Корзина</span>
            </Link>

            {/* Cart Counter - показывать только если есть товары */}
            {getTotalItems() > 0 && (
              <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                {getTotalItems()}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
