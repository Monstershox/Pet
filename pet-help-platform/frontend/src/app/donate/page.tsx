'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, CreditCard, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

export default function DonatePage() {
  const [amount, setAmount] = useState('')
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault()
    const finalAmount = selectedAmount || parseInt(amount)
    toast.success(`Спасибо за вашу помощь! ${finalAmount} сум помогут спасти животных`)
  }

  const presetAmounts = [10000, 50000, 100000, 250000, 500000]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад
        </Link>

        <h1 className="text-3xl font-bold mb-2">Помочь животным</h1>
        <p className="text-gray-600 mb-8">
          Ваша помощь спасает жизни. Каждый рубль идет на корм, лечение и содержание животных.
        </p>

        <form onSubmit={handleDonate} className="bg-white rounded-2xl shadow-lg p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Выберите сумму
            </label>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setSelectedAmount(preset)
                    setAmount(preset.toString())
                  }}
                  className={`py-3 rounded-lg border-2 transition ${
                    selectedAmount === preset
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-gray-300 hover:border-primary'
                  }`}
                >
                  {preset} сум
                </button>
              ))}
            </div>

            <div>
              <label htmlFor="custom-amount" className="block text-sm text-gray-600 mb-2">
                Или введите свою сумму
              </label>
              <input
                type="number"
                id="custom-amount"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value)
                  setSelectedAmount(null)
                }}
                placeholder="Введите сумму"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                min="10"
                required
              />
            </div>
          </div>

          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">На что пойдут деньги:</h3>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• 10,000 сум - корм на день для одного животного</li>
              <li>• 50,000 сум - прививка для щенка или котенка</li>
              <li>• 100,000 сум - стерилизация кошки</li>
              <li>• 250,000 сум - полное обследование животного</li>
              <li>• 500,000 сум - сложная операция</li>
            </ul>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition flex items-center justify-center"
          >
            <CreditCard className="h-5 w-5 mr-2" />
            Помочь сейчас
          </button>
        </form>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center text-gray-600">
            <Heart className="h-5 w-5 text-red-500 mr-2" />
            <span>Уже помогли: 1,247 человек</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Собрано за месяц: 45,830,000 сум
          </p>
        </div>

        <div className="mt-8 bg-green-50 rounded-lg p-6">
          <h2 className="font-semibold text-green-900 mb-2">Другие способы помочь</h2>
          <ul className="space-y-2 text-green-800">
            <li>• Стать волонтером в приюте</li>
            <li>• Взять животное на передержку</li>
            <li>• Привезти корм или лекарства</li>
            <li>• Рассказать друзьям о платформе</li>
          </ul>
        </div>
      </div>
    </div>
  )
}