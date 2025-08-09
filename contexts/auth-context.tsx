'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (emailOrPhone: string, password: string) => Promise<boolean>
  register: (userData: RegisterData) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

interface RegisterData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Загружаем пользователя из localStorage при инициализации
  useEffect(() => {
    const savedUser = localStorage.getItem('uzum-user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  // Сохраняем пользователя в localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('uzum-user', JSON.stringify(user))
    } else {
      localStorage.removeItem('uzum-user')
    }
  }, [user])

  const login = async (emailOrPhone: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    try {
      // Симуляция API запроса
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Проверяем существующих пользователей
      const existingUsers = JSON.parse(localStorage.getItem('uzum-users') || '[]')
      const foundUser = existingUsers.find((u: any) => 
        (u.email === emailOrPhone || u.phone === emailOrPhone) && u.password === password
      )
      
      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser
        setUser(userWithoutPassword)
        setIsLoading(false)
        return true
      } else {
        // Если пользователь не найден, создаем тестового пользователя
        const testUser = {
          id: '1',
          firstName: 'Тест',
          lastName: 'Пользователь',
          email: emailOrPhone.includes('@') ? emailOrPhone : 'test@example.com',
          phone: emailOrPhone.startsWith('+') ? emailOrPhone : '+998901234567'
        }
        setUser(testUser)
        setIsLoading(false)
        return true
      }
    } catch (error) {
      setIsLoading(false)
      return false
    }
  }

  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true)
    
    try {
      // Симуляция API запроса
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('Attempting to register user:', userData)
      
      // Получаем существующих пользователей
      let existingUsers = []
      try {
        const stored = localStorage.getItem('uzum-users')
        existingUsers = stored ? JSON.parse(stored) : []
      } catch (e) {
        console.log('No existing users or error parsing:', e)
        existingUsers = []
      }
      
      console.log('Existing users:', existingUsers)
      
      // Проверяем, не существует ли уже такой пользователь
      const userExists = existingUsers.some((u: any) => 
        u.email === userData.email || u.phone === userData.phone
      )
      
      console.log('User exists:', userExists)
      
      if (userExists) {
        console.log('User already exists')
        setIsLoading(false)
        return false
      }
      
      // Создаем нового пользователя
      const newUser = {
        id: Date.now().toString(),
        ...userData
      }
      
      console.log('Creating new user:', newUser)
      
      // Добавляем в массив и сохраняем
      existingUsers.push(newUser)
      localStorage.setItem('uzum-users', JSON.stringify(existingUsers))
      
      console.log('User saved to localStorage')
      
      // Автоматически входим после регистрации
      const { password: _, ...userWithoutPassword } = newUser
      setUser(userWithoutPassword)
      setIsLoading(false)
      
      console.log('Registration successful')
      return true
    } catch (error) {
      console.error('Registration error:', error)
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      register,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
