'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/header'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [inputType, setInputType] = useState<'email' | 'phone'>('phone')
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: ''
  })
  const [errors, setErrors] = useState({
    emailOrPhone: '',
    password: '',
    general: ''
  })

  // Определяем тип ввода на основе содержимого
  const detectInputType = (value: string) => {
    if (value.startsWith('+') || /^[\d\s\-()]+$/.test(value.replace(/\s/g, ''))) {
      return 'phone'
    }
    if (value.includes('@')) {
      return 'email'
    }
    return 'phone'
  }

  // Форматирование номера телефона
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    
    if (numbers.startsWith('998')) {
      return `+${numbers}`
    }
    if (numbers.length > 0 && !value.startsWith('+')) {
      return `+998${numbers}`
    }
    
    return value
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    const detectedType = detectInputType(value)
    
    if (detectedType === 'phone') {
      value = formatPhoneNumber(value)
    }
    
    setInputType(detectedType)
    setFormData({ ...formData, emailOrPhone: value })
    
    if (errors.emailOrPhone || errors.general) {
      setErrors({ ...errors, emailOrPhone: '', general: '' })
    }
  }

  const validateForm = () => {
    const newErrors = { emailOrPhone: '', password: '', general: '' }
    let isValid = true

    if (!formData.emailOrPhone.trim()) {
      newErrors.emailOrPhone = 'Введите email или номер телефона'
      isValid = false
    } else if (inputType === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.emailOrPhone)) {
        newErrors.emailOrPhone = 'Введите корректный email адрес'
        isValid = false
      }
    } else if (inputType === 'phone') {
      const phoneRegex = /^\+998\d{9}$/
      if (!phoneRegex.test(formData.emailOrPhone.replace(/\s/g, ''))) {
        newErrors.emailOrPhone = 'Введите корректный номер телефона (+998XXXXXXXXX)'
        isValid = false
      }
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Введите пароль'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const success = await login(formData.emailOrPhone, formData.password)
    
    if (success) {
      router.push('/')
    } else {
      setErrors({
        ...errors,
        general: 'Неверный email/телефон или пароль. Попробуйте снова или зарегистрируйтесь.'
      })
    }
  }

  const getPlaceholder = () => {
    return inputType === 'phone' ? '+998 90 123 45 67' : 'example@email.com'
  }

  const getHelpText = () => {
    if (inputType === 'phone') {
      return 'Введите номер телефона в формате +998XXXXXXXXX'
    }
    return 'Введите адрес электронной почты'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Вход в аккаунт
          </h1>
          
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="emailOrPhone" className="block text-sm font-medium text-gray-700 mb-2">
                Email или номер телефона
              </label>
              <input
                type="text"
                id="emailOrPhone"
                value={formData.emailOrPhone}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 ${
                  errors.emailOrPhone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={getPlaceholder()}
              />
              {errors.emailOrPhone && (
                <p className="mt-1 text-sm text-red-600">{errors.emailOrPhone}</p>
              )}
              {!errors.emailOrPhone && formData.emailOrPhone && (
                <p className="mt-1 text-xs text-gray-500">{getHelpText()}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Пароль
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({...formData, password: e.target.value})
                    if (errors.password || errors.general) {
                      setErrors({...errors, password: '', general: ''})
                    }
                  }}
                  disabled={isLoading}
                  className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Введите пароль"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  disabled={isLoading}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 disabled:opacity-50" 
                />
                <span className="ml-2 text-sm text-gray-600">Запомнить меня</span>
              </label>
              <Link href="/auth/forgot-password" className="text-sm text-purple-600 hover:text-purple-700">
                Забыли пароль?
              </Link>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Вход...
                </>
              ) : (
                'Войти'
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Нет аккаунта?{' '}
              <Link href="/auth/register" className="text-purple-600 hover:text-purple-700 font-medium">
                Зарегистрироваться
              </Link>
            </p>
          </div>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Или войдите через</span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button 
                disabled={isLoading}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Google
              </button>
              <button 
                disabled={isLoading}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Telegram
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
