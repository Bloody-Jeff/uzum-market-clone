'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const totalSlides = 6

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-3xl relative overflow-hidden min-h-[400px] flex items-center">
        {/* Left Navigation Arrow */}
        <button
          onClick={prevSlide}
          className="absolute left-6 z-10 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        {/* Content */}
        <div className="flex-1 px-20 py-12">
          <h1 className="text-5xl font-bold text-white mb-6">Подсолнечное масло</h1>
          <p className="text-3xl text-white mb-8">30,000 сум</p>
          <p className="text-white/90 text-lg max-w-2xl leading-relaxed">
            Станьте востребованным разработчиком. Вы изучите основы 
            программирования и основные концепции компьютерных наук, цифровые 
            технологии, операционные системы, программное обеспечение, базы 
            данных, системы аналитики, языки программирования и многое другое. 
            Познакомитесь с тестированием и системным анализом. На программе 
            сможете сделать осознанный выбор специализации и технологий, 
            прокачаться в выбранном направлении.
          </p>
        </div>

        {/* Right Navigation Arrow */}
        <button
          onClick={nextSlide}
          className="absolute right-6 z-10 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {[...Array(totalSlides)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>

        {/* Decorative elements */}
        <div className="absolute top-8 right-8 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-8 left-8 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
      </div>
    </div>
  )
}
