'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react'

const faqs = [
  {
    id: 1,
    question: 'Как работает приложение?',
    answer: 'Вы можете фотографировать найденных животных, и наш ИИ автоматически анализирует фото, определяет породу и состояние животного. Затем информация отправляется в ближайшие приюты. Также вы можете просматривать доступных для усыновления животных в режиме свайпов.',
    category: 'Общие'
  },
  {
    id: 2,
    question: 'Что делать, если я нашел бездомное животное?',
    answer: 'Сфотографируйте животное через приложение, укажите местоположение и краткое описание состояния. Мы автоматически уведомим ближайшие приюты и волонтеров. Если возможно, оставайтесь рядом с животным до прибытия помощи.',
    category: 'Помощь'
  },
  {
    id: 3,
    question: 'Как я могу усыновить животное?',
    answer: 'Перейдите в раздел "Найти питомца" и свайпайте карточки животных. Свайп вправо означает интерес. При совпадении мы свяжем вас с приютом для дальнейших шагов: знакомство, оформление документов и передача животного.',
    category: 'Усыновление'
  },
  {
    id: 4,
    question: 'Какие документы нужны для усыновления?',
    answer: 'Обычно требуется паспорт и договор об ответственном содержании животного. Некоторые приюты могут попросить справку о жилищных условиях. Точный список документов зависит от конкретного приюта.',
    category: 'Усыновление'
  },
  {
    id: 5,
    question: 'Как я могу помочь, кроме усыновления?',
    answer: 'Вы можете: стать волонтером в приюте, взять животное на передержку, сделать донат на корм и лечение, привезти необходимые вещи в приют, распространять информацию о животных, которые ищут дом.',
    category: 'Помощь'
  },
  {
    id: 6,
    question: 'Безопасно ли делать донаты через приложение?',
    answer: 'Да, мы используем защищенные платежные системы. Все транзакции шифруются. Вы можете отслеживать, на что пошли ваши средства, и получать отчеты от приютов.',
    category: 'Донаты'
  }
]

const categories = ['Все', 'Общие', 'Помощь', 'Усыновление', 'Донаты']

export default function FAQPage() {
  const [expandedItems, setExpandedItems] = useState<number[]>([])
  const [selectedCategory, setSelectedCategory] = useState('Все')

  const toggleExpanded = (id: number) => {
    setExpandedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const filteredFaqs = selectedCategory === 'Все'
    ? faqs
    : faqs.filter(faq => faq.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад
        </Link>

        <h1 className="text-3xl font-bold mb-2">Часто задаваемые вопросы</h1>
        <p className="text-gray-600 mb-8">
          Найдите ответы на популярные вопросы о платформе
        </p>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg transition ${
                selectedCategory === category
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredFaqs.map((faq) => (
            <div key={faq.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <button
                onClick={() => toggleExpanded(faq.id)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition"
              >
                <div>
                  <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                  <span className="text-sm text-primary mt-1">{faq.category}</span>
                </div>
                {expandedItems.includes(faq.id) ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>

              {expandedItems.includes(faq.id) && (
                <div className="px-6 pb-4">
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h2 className="font-semibold text-blue-900 mb-2">Не нашли ответ?</h2>
          <p className="text-blue-800 mb-4">
            Свяжитесь с нами, и мы обязательно поможем
          </p>
          <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition">
            Задать вопрос
          </button>
        </div>
      </div>
    </div>
  )
}