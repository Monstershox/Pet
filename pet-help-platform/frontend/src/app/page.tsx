'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Heart, Camera, Users, Search, Star, Shield, TrendingUp, Award } from 'lucide-react'

export default function HomePage() {
  const [savedCount, setSavedCount] = useState(0)
  const [shelterCount, setShelterCount] = useState(0)
  const [volunteerCount, setVolunteerCount] = useState(0)

  useEffect(() => {
    // Анимация счетчиков
    const interval = setInterval(() => {
      setSavedCount(prev => prev < 1247 ? prev + 17 : 1247)
      setShelterCount(prev => prev < 23 ? prev + 1 : 23)
      setVolunteerCount(prev => prev < 156 ? prev + 3 : 156)
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Навигация */}
      <nav className="bg-white shadow-sm border-b fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-primary mr-2 animate-pulse" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Pet Help Uzbekistan
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/animals" className="text-gray-700 hover:text-primary transition">
                Найти питомца
              </Link>
              <Link href="/report" className="text-gray-700 hover:text-primary transition">
                Сообщить о находке
              </Link>
              <Link href="/shelters" className="text-gray-700 hover:text-primary transition">
                Приюты
              </Link>
              <Link href="/donate" className="text-gray-700 hover:text-primary transition">
                Помощь
              </Link>
              <Link href="/login" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-md hover:from-purple-600 hover:to-pink-600 transition">
                Войти
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Герой секция с видео фоном */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden mt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-500 to-pink-500 opacity-90"></div>

        {/* Анимированные круги на фоне */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center p-2 bg-white/20 backdrop-blur-sm rounded-full mb-8">
              <Star className="h-6 w-6 text-yellow-300 mr-2" />
              <span className="text-sm font-medium px-3">Более 1000+ животных спасено</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-6xl md:text-7xl font-bold mb-6"
          >
            Спасаем жизни
            <br />
            <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
              вместе с вами
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl mb-8 max-w-2xl mx-auto text-white/90"
          >
            Платформа помощи бездомным животным в Узбекистане.
            Используем AI для поиска и спасения животных
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/animals"
              className="group relative px-8 py-4 bg-white text-gray-900 rounded-xl text-lg font-medium overflow-hidden transition hover:scale-105"
            >
              <span className="relative z-10">Начать поиск питомца</span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition"></div>
              <Heart className="inline ml-2 h-5 w-5 animate-pulse" />
            </Link>
            <Link
              href="/report"
              className="px-8 py-4 bg-white/20 backdrop-blur-sm border-2 border-white text-white rounded-xl text-lg font-medium hover:bg-white/30 transition hover:scale-105"
            >
              Сообщить о находке
              <Camera className="inline ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>

        {/* Анимированная стрелка вниз */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <div className="text-white/70">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </motion.div>
      </section>

      {/* Статистика */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full mb-4">
                <Heart className="h-10 w-10" />
              </div>
              <h3 className="text-5xl font-bold text-gray-900 mb-2">{savedCount}+</h3>
              <p className="text-gray-600">Животных спасено</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 text-white rounded-full mb-4">
                <Shield className="h-10 w-10" />
              </div>
              <h3 className="text-5xl font-bold text-gray-900 mb-2">{shelterCount}</h3>
              <p className="text-gray-600">Приютов-партнеров</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-full mb-4">
                <Users className="h-10 w-10" />
              </div>
              <h3 className="text-5xl font-bold text-gray-900 mb-2">{volunteerCount}</h3>
              <p className="text-gray-600">Волонтеров</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Как это работает */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Как это <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">работает</span>
            </h2>
            <p className="text-xl text-gray-600">Простые шаги к спасению жизни</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl transform rotate-2 group-hover:rotate-3 transition"></div>
              <div className="relative bg-white p-8 rounded-2xl shadow-xl">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                  1
                </div>
                <Camera className="h-10 w-10 text-purple-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Фото и AI-анализ</h3>
                <p className="text-gray-600">
                  Сфотографируйте животное. Наш ИИ определит породу, возраст и состояние
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl transform -rotate-2 group-hover:-rotate-3 transition"></div>
              <div className="relative bg-white p-8 rounded-2xl shadow-xl">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                  2
                </div>
                <Search className="h-10 w-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Свайпы и матчинг</h3>
                <p className="text-gray-600">
                  Свайпайте как в Tinder. При совпадении мы связываем вас с приютом
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl transform rotate-2 group-hover:rotate-3 transition"></div>
              <div className="relative bg-white p-8 rounded-2xl shadow-xl">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-teal-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                  3
                </div>
                <Users className="h-10 w-10 text-green-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Помощь и спасение</h3>
                <p className="text-gray-600">
                  Приюты получают уведомления и выезжают за животными
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Истории успеха */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Истории счастья</h2>
            <p className="text-xl text-gray-600">Каждая спасенная жизнь - это победа</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6 hover:scale-105 transition"
            >
              <div className="aspect-square bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl mb-4 relative overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop"
                  alt="Барсик"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-lg mb-2">Барсик нашел дом!</h3>
              <p className="text-gray-600 text-sm mb-2">
                Был найден на улице Амира Темура. Теперь живет в любящей семье
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <Award className="h-4 w-4 mr-1 text-yellow-500" />
                Спасен 3 дня назад
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl p-6 hover:scale-105 transition"
            >
              <div className="aspect-square bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl mb-4 relative overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop"
                  alt="Рекс"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-lg mb-2">Рекс выздоровел!</h3>
              <p className="text-gray-600 text-sm mb-2">
                Прошел лечение в приюте Самарканда и готов к усыновлению
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <Award className="h-4 w-4 mr-1 text-yellow-500" />
                Спасен неделю назад
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gradient-to-br from-green-100 to-teal-100 rounded-2xl p-6 hover:scale-105 transition"
            >
              <div className="aspect-square bg-gradient-to-br from-green-400 to-teal-400 rounded-xl mb-4 relative overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=400&fit=crop"
                  alt="Мурка"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-lg mb-2">Мурка стала звездой!</h3>
              <p className="text-gray-600 text-sm mb-2">
                Теперь живет в Бухаре и даже снялась в рекламе корма
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <Award className="h-4 w-4 mr-1 text-yellow-500" />
                Спасена месяц назад
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA секция */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Готовы изменить жизнь к лучшему?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Каждое действие имеет значение. Начните помогать прямо сейчас!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/animals"
                className="px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold hover:scale-105 transition"
              >
                Найти питомца
              </Link>
              <Link
                href="/donate"
                className="px-8 py-4 bg-purple-700 text-white rounded-xl font-semibold hover:bg-purple-800 transition"
              >
                Сделать донат
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Футер */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Heart className="h-8 w-8 text-pink-500 mr-2 animate-pulse" />
                <span className="text-xl font-bold">Pet Help UZ</span>
              </div>
              <p className="text-gray-400">Спасаем животных вместе</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Быстрые ссылки</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/animals" className="hover:text-white transition">Найти питомца</Link></li>
                <li><Link href="/shelters" className="hover:text-white transition">Приюты</Link></li>
                <li><Link href="/donate" className="hover:text-white transition">Помощь</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Ресурсы</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/faq" className="hover:text-white transition">Вопросы</Link></li>
                <li><Link href="/about" className="hover:text-white transition">О нас</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Контакты</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Контакты</h3>
              <p className="text-gray-400 mb-2">📍 Ташкент, Узбекистан</p>
              <p className="text-gray-400 mb-2">📧 help@pethelp.uz</p>
              <p className="text-gray-400">📱 +998 90 123 45 67</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Pet Help Uzbekistan. С ❤️ для животных</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}