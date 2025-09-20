'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Camera, MapPin, Heart, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ReportPage() {
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Спасибо! Ваше сообщение отправлено в ближайшие приюты')
    setDescription('')
    setLocation('')
    setPhoto(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад
        </Link>

        <h1 className="text-3xl font-bold mb-2">Сообщить о найденном животном</h1>
        <p className="text-gray-600 mb-8">
          Помогите бездомному животному найти помощь. Мы отправим информацию в ближайшие приюты.
        </p>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Фото животного
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition cursor-pointer">
              <Camera className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">Нажмите для загрузки фото</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                className="hidden"
              />
              {photo && (
                <p className="mt-2 text-sm text-green-600">
                  Загружено: {photo.name}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="inline h-4 w-4 mr-1" />
              Местоположение
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Например: улица Ленина, 25"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Описание
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Опишите состояние животного, особые приметы..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition flex items-center justify-center"
          >
            <Heart className="h-5 w-5 mr-2" />
            Отправить в приюты
          </button>
        </form>

        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h2 className="font-semibold text-blue-900 mb-2">Что происходит дальше?</h2>
          <ul className="space-y-2 text-blue-800">
            <li>• Наш ИИ проанализирует фото и определит породу</li>
            <li>• Мы проверим базу потерянных животных</li>
            <li>• Уведомим ближайшие приюты о находке</li>
            <li>• Вы получите обновления о статусе животного</li>
          </ul>
        </div>
      </div>
    </div>
  )
}