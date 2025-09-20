'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import TinderCard from 'react-tinder-card'
import { Heart, X, Info, MapPin, ArrowLeft } from 'lucide-react'
import { animalsApi, swipesApi } from '@/lib/api'
import toast from 'react-hot-toast'

interface Animal {
  id: number
  name: string
  type: string
  breed: string
  age: number
  size: string
  location: string
  description: string
  photos: Array<{ url: string; is_primary: boolean }>
}

export default function AnimalsPage() {
  const [animals, setAnimals] = useState<Animal[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    loadAnimals()
  }, [])

  useEffect(() => {
    // Automatically reload when animals list is empty
    if (!loading && animals.length === 0) {
      const timer = setTimeout(() => {
        loadAnimals()
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [animals.length, loading])

  const loadAnimals = async () => {
    try {
      setLoading(true)
      const response = await animalsApi.getFeed()
      setAnimals(response.data)
    } catch (error) {
      toast.error('Не удалось загрузить животных')
    } finally {
      setLoading(false)
    }
  }

  const handleSwipe = async (direction: string, animalId: number, index: number) => {
    try {
      const swipeDirection = direction === 'right' ? 'right' : 'left'
      await swipesApi.create(animalId, swipeDirection)

      if (direction === 'right') {
        toast.success('Совпадение! Мы уведомим приют')
      }

      // Удаляем животное из массива после свайпа
      setAnimals(prev => prev.filter(a => a.id !== animalId))

      if (animals.length <= 3) {
        loadAnimals()
      }
    } catch (error) {
      toast.error('Не удалось сохранить выбор')
    }
  }

  const handleCardLeftScreen = (animalId: number) => {
    console.log(animalId + ' left the screen')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Загружаем милых животных...</p>
        </div>
      </div>
    )
  }

  if (animals.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-md mx-auto pt-8 px-4">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-primary mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад
          </Link>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-gray-600">Загружаем новых животных...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-md mx-auto pt-8 px-4">
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад
        </Link>
        <h1 className="text-3xl font-bold text-center mb-8">Найдите своего идеального питомца</h1>

        <div className="relative h-[600px]">
          {animals.map((animal, index) => (
            <TinderCard
              key={animal.id}
              className="absolute w-full"
              onSwipe={(dir) => handleSwipe(dir, animal.id, index)}
              onCardLeftScreen={() => handleCardLeftScreen(animal.id)}
              preventSwipe={['up', 'down']}
            >
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden cursor-grab active:cursor-grabbing">
                <div className="relative h-96">
                  <img
                    src={animal.photos[0]?.url || '/placeholder.jpg'}
                    alt={animal.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
                    <h2 className="text-2xl font-bold">{animal.name || 'Без имени'}</h2>
                    <p className="text-sm opacity-90">{animal.breed} • {animal.age} {animal.age === 1 ? 'год' : animal.age < 5 ? 'года' : 'лет'}</p>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">{animal.location || 'Местонахождение неизвестно'}</span>
                  </div>

                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {animal.description || 'Это прекрасное животное ищет любящий дом!'}
                  </p>

                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {animal.type === 'cat' ? 'Кошка' : animal.type === 'dog' ? 'Собака' : animal.type}
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      {animal.size === 'small' ? 'Маленький' : animal.size === 'medium' ? 'Средний' : animal.size === 'large' ? 'Большой' : animal.size} размер
                    </span>
                  </div>
                </div>
              </div>
            </TinderCard>
          ))}
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => {
              if (animals.length > 0) {
                const topAnimal = animals[animals.length - 1]
                handleSwipe('left', topAnimal.id, animals.length - 1)
              }
            }}
            className="bg-white shadow-lg rounded-full p-4 hover:scale-110 transition"
          >
            <X className="h-8 w-8 text-red-500" />
          </button>

          <button
            onClick={() => {
              if (animals.length > 0) {
                const topAnimal = animals[animals.length - 1]
                toast(`${topAnimal.name}: ${topAnimal.description}`, {
                  duration: 4000,
                  icon: '💙'
                })
              }
            }}
            className="bg-white shadow-lg rounded-full p-4 hover:scale-110 transition"
          >
            <Info className="h-8 w-8 text-blue-500" />
          </button>

          <button
            onClick={() => {
              if (animals.length > 0) {
                const topAnimal = animals[animals.length - 1]
                handleSwipe('right', topAnimal.id, animals.length - 1)
              }
            }}
            className="bg-white shadow-lg rounded-full p-4 hover:scale-110 transition"
          >
            <Heart className="h-8 w-8 text-green-500" />
          </button>
        </div>

        <div className="text-center mt-6 text-gray-600">
          <p className="text-sm">Свайпните вправо, если понравилось</p>
          <p className="text-sm">Свайпните влево, чтобы пропустить</p>
        </div>
      </div>
    </div>
  )
}