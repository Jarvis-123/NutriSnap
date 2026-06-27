'use client'

import { useEffect, useState } from 'react'
import { getTodaysMeals, getWeeklyMeals } from '@/lib/supabase'
import { Meal, DEFAULT_GOALS } from '@/lib/types'
import MacroBar from '@/components/MacroBar'
import DailyRing from '@/components/DailyRing'
import WeeklyChart from '@/components/WeeklyChart'
import Link from 'next/link'

export default function DashboardPage() {
  const [todayMeals, setTodayMeals] = useState<Meal[]>([])
  const [weeklyMeals, setWeeklyMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [today, weekly] = await Promise.all([getTodaysMeals(), getWeeklyMeals()])
      setTodayMeals(today)
      setWeeklyMeals(weekly)
      setLoading(false)
    }
    load()
  }, [])

  const totals = todayMeals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.total_calories,
      protein: acc.protein + meal.total_protein,
      carbs: acc.carbs + meal.total_carbs,
      fat: acc.fat + meal.total_fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )

  // Build last 7 days data for chart
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const label = d.toLocaleDateString('en-IN', { weekday: 'short' })
    const dayMeals = weeklyMeals.filter(
      m => new Date(m.created_at).toDateString() === d.toDateString()
    )
    const calories = Math.round(dayMeals.reduce((s, m) => s + m.total_calories, 0))
    return { label, calories }
  })

  if (loading) {
    return (
      <div className="py-6 space-y-5 animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="card p-6 flex justify-center">
          <div className="skeleton rounded-full" style={{ width: 160, height: 160 }} />
        </div>
        <div className="card p-5 space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-1.5">
              <div className="skeleton h-3 w-24" />
              <div className="skeleton h-3 w-full rounded-full" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const remaining = Math.max(0, DEFAULT_GOALS.calories - Math.round(totals.calories))

  return (
    <div className="py-6 space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Calorie ring */}
      <div className="card p-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Today's calories</h2>
        <div className="flex items-center gap-8">
          <DailyRing consumed={Math.round(totals.calories)} goal={DEFAULT_GOALS.calories} />
          <div className="space-y-3 flex-1">
            <div>
              <p className="text-xs text-gray-500">Consumed</p>
              <p className="text-xl font-bold text-gray-900">{Math.round(totals.calories)} kcal</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Remaining</p>
              <p className="text-xl font-bold text-primary-600">{remaining} kcal</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Goal</p>
              <p className="text-sm font-medium text-gray-700">{DEFAULT_GOALS.calories} kcal</p>
            </div>
          </div>
        </div>
      </div>

      {/* Macros */}
      <div className="card p-5 space-y-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Macros</h2>
        <MacroBar label="Protein" value={Math.round(totals.protein * 10) / 10} max={DEFAULT_GOALS.protein} unit="g" color="bg-blue-500" />
        <MacroBar label="Carbs" value={Math.round(totals.carbs * 10) / 10} max={DEFAULT_GOALS.carbs} unit="g" color="bg-amber-400" />
        <MacroBar label="Fat" value={Math.round(totals.fat * 10) / 10} max={DEFAULT_GOALS.fat} unit="g" color="bg-red-400" />
      </div>

      {/* Weekly chart */}
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">This week</h2>
        <WeeklyChart data={last7Days} goal={DEFAULT_GOALS.calories} />
      </div>

      {/* Today's meals */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Today's meals</h2>
          <Link href="/history" className="text-primary-600 text-sm font-medium">View all</Link>
        </div>
        {todayMeals.length === 0 ? (
          <div className="text-center py-6 space-y-3">
            <p className="text-3xl">🥗</p>
            <p className="text-gray-500 text-sm">No meals logged today</p>
            <Link href="/" className="btn-primary inline-flex items-center gap-1.5 text-sm">
              ✨ Analyze a meal
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {todayMeals.map(meal => (
              <div key={meal.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-800 capitalize">
                    {meal.meal_type} · {meal.foods.length} item{meal.foods.length !== 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(meal.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{Math.round(meal.total_calories)}</p>
                  <p className="text-xs text-gray-400">kcal</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
