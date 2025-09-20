'use client'

import Link from 'next/link'
import { MapPin, Phone, Users, ArrowLeft } from 'lucide-react'

const shelters = [
  {
    id: 1,
    name: 'Приют "Мехр"',
    city: 'Ташкент',
    address: 'ул. Амира Темура, 15',
    phone: '+998 (71) 123-45-67',
    animals: 45,
    capacity: 60,
  },
  {
    id: 2,
    name: 'Центр помощи животным Самарканда',
    city: 'Самарканд',
    address: 'ул. Регистан, 100',
    phone: '+998 (66) 987-65-43',
    animals: 32,
    capacity: 50,
  },
  {
    id: 3,
    name: 'Приют "Дўст"',
    city: 'Бухара',
    address: 'ул. Накшбанди, 78',
    phone: '+998 (65) 555-44-33',
    animals: 28,
    capacity: 40,
  },
  {
    id: 4,
    name: 'Дом для животных',
    city: 'Наманган',
    address: 'ул. Навои, 23',
    phone: '+998 (69) 777-88-99',
    animals: 38,
    capacity: 45,
  },
  {
    id: 5,
    name: 'Приют "Рахмат"',
    city: 'Андижан',
    address: 'ул. Бобур, 45',
    phone: '+998 (74) 222-33-44',
    animals: 25,
    capacity: 35,
  },
]

export default function SheltersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад
        </Link>

        <h1 className="text-3xl font-bold mb-2">Приюты для животных</h1>
        <p className="text-gray-600 mb-8">
          Найдите ближайший приют и помогите животным обрести дом
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shelters.map((shelter) => (
            <div key={shelter.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
              <div className="bg-primary/10 h-32 flex items-center justify-center">
                <Users className="h-16 w-16 text-primary/50" />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{shelter.name}</h3>

                <div className="space-y-2 text-gray-600 mb-4">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm">{shelter.city}, {shelter.address}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm">{shelter.phone}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div>
                    <p className="text-sm text-gray-500">Животных</p>
                    <p className="font-semibold">{shelter.animals} / {shelter.capacity}</p>
                  </div>
                  <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition">
                    Связаться
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-green-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-green-900 mb-3">
            Как помочь приютам?
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-green-800">
              <h3 className="font-medium mb-1">Волонтерство</h3>
              <p className="text-sm">Помогайте ухаживать за животными и выгуливать их</p>
            </div>
            <div className="text-green-800">
              <h3 className="font-medium mb-1">Донаты</h3>
              <p className="text-sm">Помогите с кормом, лекарствами и содержанием</p>
            </div>
            <div className="text-green-800">
              <h3 className="font-medium mb-1">Передержка</h3>
              <p className="text-sm">Временно приютите животное у себя дома</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}