'use client'

import { useState } from 'react'
import { NutritionData, FoodItem } from '@/lib/types'

interface Props { data: NutritionData }

function MacroPill({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  return (
    <div className={`flex flex-col items-center px-4 py-2 rounded-xl ${color}`}>
      <span className="text-lg font-bold">{Math.round(value * 10) / 10}{unit}</span>
      <span className="text-xs font-medium opacity-80">{label}</span>
    </div>
  )
}

function MicroRow({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-medium text-gray-800">{Math.round(value * 10) / 10} {unit}</span>
    </div>
  )
}

function FoodCard({ food }: { food: FoodItem }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between p-3 bg-gray-50">
        <div>
          <p className="font-semibold text-gray-800 capitalize text-sm">{food.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">{food.portion}</p>
        </div>
        <div className="text-right">
          <p className="text-base font-bold text-primary-600">{Math.round(food.calories)}</p>
          <p className="text-xs text-gray-400">kcal</p>
        </div>
      </div>
      <div className="px-3 py-2 flex gap-3">
        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-lg font-medium">P: {Math.round(food.protein * 10) / 10}g</span>
        <span className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-lg font-medium">C: {Math.round(food.carbs * 10) / 10}g</span>
        <span className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded-lg font-medium">F: {Math.round(food.fat * 10) / 10}g</span>
        <button
          onClick={() => setExpanded(!expanded)}
          className="ml-auto text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          {expanded ? '▲ Less' : '▼ Micros'}
        </button>
      </div>
      {expanded && (
        <div className="px-3 pb-3 border-t border-gray-50 pt-2">
          <MicroRow label="Fiber" value={food.fiber} unit="g" />
          <MicroRow label="Sugar" value={food.sugar} unit="g" />
          <MicroRow label="Sodium" value={food.sodium} unit="mg" />
          <MicroRow label="Calcium" value={food.calcium} unit="mg" />
          <MicroRow label="Iron" value={food.iron} unit="mg" />
          <MicroRow label="Vitamin C" value={food.vitamin_c} unit="mg" />
          <MicroRow label="Vitamin A" value={food.vitamin_a} unit="mcg" />
          <MicroRow label="Potassium" value={food.potassium} unit="mg" />
        </div>
      )}
    </div>
  )
}

export default function NutritionResult({ data }: Props) {
  return (
    <div className="space-y-4">
      {/* Totals */}
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Meal total</h2>
        <div className="flex gap-2 justify-between">
          <div className="flex flex-col items-center px-4 py-2 rounded-xl bg-primary-50">
            <span className="text-lg font-bold text-primary-700">{Math.round(data.total_calories)}</span>
            <span className="text-xs font-medium text-primary-500">kcal</span>
          </div>
          <MacroPill label="Protein" value={data.total_protein} unit="g" color="bg-blue-50 text-blue-700" />
          <MacroPill label="Carbs" value={data.total_carbs} unit="g" color="bg-amber-50 text-amber-700" />
          <MacroPill label="Fat" value={data.total_fat} unit="g" color="bg-red-50 text-red-700" />
        </div>
      </div>

      {/* Food items */}
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Items detected ({data.foods.length})
        </h2>
        <div className="space-y-2">
          {data.foods.map((food, i) => (
            <FoodCard key={i} food={food} />
          ))}
        </div>
      </div>

      {/* Assessment */}
      {data.meal_assessment && (
        <div className="bg-primary-50 border border-primary-100 rounded-2xl p-4">
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide mb-1.5">AI Assessment</p>
          <p className="text-sm text-primary-800 leading-relaxed">{data.meal_assessment}</p>
        </div>
      )}

      {/* Suggestions */}
      {data.suggestions?.length > 0 && (
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Suggestions</h2>
          <ul className="space-y-2">
            {data.suggestions.map((s, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-700">
                <span className="text-primary-500 mt-0.5 shrink-0">💡</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
