'use client'

import { useEffect, useState } from 'react'
import { getMeals, deleteMeal } from '@/lib/supabase'
import { Meal } from '@/lib/types'
import MealCard from '@/components/MealCard'
import Link from 'next/link'

export default function HistoryPage() {
  const [meals, setMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMeals()
  }, [])

  async function fetchMeals() {
    setLoading(true)
    const data = await getMeals()
    setMeals(data)
    setLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this meal from history?')) return
    const ok = await deleteMeal(id)
    if (ok) setMeals(prev => prev.filter(m => m.id !== id))
  }

  if (loading) {
    return (
      <div className="py-6 space-y-4 animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-900">Meal History</h1>
        {[1, 2, 3].map(i => (
          <div key={i} className="card p-4 space-y-3">
            <div className="skeleton h-5 w-2/3" />
            <div className="skeleton h-4 w-1/3" />
            <div className="flex gap-2">
              <div className="skeleton h-6 w-16 rounded-full" />
              <div className="skeleton h-6 w-16 rounded-full" />
              <div className="skeleton h-6 w-16 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (meals.length === 0) {
    return (
      <div className="py-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Meal History</h1>
        <div className="card p-10 text-center space-y-4">
          <div className="text-5xl">🍽️</div>
          <h2 className="text-lg font-semibold text-gray-700">No meals yet</h2>
          <p className="text-gray-400 text-sm">Start tracking by analyzing your first meal</p>
          <Link href="/" className="btn-primary inline-flex items-center gap-2 mt-2">
            ✨ Analyze a meal
          </Link>
        </div>
      </div>
    )
  }

  // Group meals by date
  const grouped = meals.reduce<Record<string, Meal[]>>((acc, meal) => {
    const date = new Date(meal.created_at).toLocaleDateString('en-IN', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    })
    if (!acc[date]) acc[date] = []
    acc[date].push(meal)
    return acc
  }, {})

  const totalCaloriesToday = meals
    .filter(m => new Date(m.created_at).toDateString() === new Date().toDateString())
    .reduce((sum, m) => sum + m.total_calories, 0)

  return (
    <div className="py-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meal History</h1>
          <p className="text-gray-500 text-sm mt-0.5">{meals.length} meals logged</p>
        </div>
        <div className="card px-3 py-2 text-center">
          <p className="text-xs text-gray-500">Today</p>
          <p className="text-lg font-bold text-primary-600">{Math.round(totalCaloriesToday)}</p>
          <p className="text-xs text-gray-400">kcal</p>
        </div>
      </div>

      {Object.entries(grouped).map(([date, dayMeals]) => (
        <div key={date} className="space-y-3">
          <div className="flex items-center gap-3">
            <p className="text-sm font-semibold text-gray-500">{date}</p>
            <div className="flex-1 h-px bg-gray-100" />
            <p className="text-xs text-gray-400">
              {Math.round(dayMeals.reduce((s, m) => s + m.total_calories, 0))} kcal
            </p>
          </div>
          {dayMeals.map(meal => (
            <MealCard key={meal.id} meal={meal} onDelete={handleDelete} />
          ))}
        </div>
      ))}
    </div>
  )
}
