import { Meal } from '@/lib/types'

interface Props {
  meal: Meal
  onDelete: (id: string) => void
}

export default function MealCard({ meal, onDelete }: Props) {
  const time = new Date(meal.created_at).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit'
  })
  const foodNames = meal.foods.slice(0, 2).map(f => f.name).join(', ')
  const extra = meal.foods.length > 2 ? ` +${meal.foods.length - 2} more` : ''

  return (
    <div className="card p-4 flex items-center gap-4 animate-fade-in">
      {/* Icon placeholder */}
      <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-2xl shrink-0">
        {meal.meal_type === 'breakfast' ? '🌅' :
         meal.meal_type === 'lunch' ? '☀️' :
         meal.meal_type === 'dinner' ? '🌙' :
         meal.meal_type === 'snack' ? '🍎' : '🍽️'}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-semibold text-gray-800 capitalize">{meal.meal_type}</p>
          <span className="text-xs text-gray-400">{time}</span>
        </div>
        <p className="text-xs text-gray-500 truncate capitalize">{foodNames}{extra}</p>
        <div className="flex gap-1.5 mt-1.5">
          <span className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-medium">
            P {Math.round(meal.total_protein)}g
          </span>
          <span className="text-xs bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded font-medium">
            C {Math.round(meal.total_carbs)}g
          </span>
          <span className="text-xs bg-red-50 text-red-500 px-1.5 py-0.5 rounded font-medium">
            F {Math.round(meal.total_fat)}g
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 shrink-0">
        <div className="text-right">
          <p className="text-base font-bold text-gray-900">{Math.round(meal.total_calories)}</p>
          <p className="text-xs text-gray-400">kcal</p>
        </div>
        <button
          onClick={() => onDelete(meal.id)}
          className="text-gray-300 hover:text-red-400 transition-colors text-lg leading-none"
          aria-label="Delete meal"
        >
          🗑
        </button>
      </div>
    </div>
  )
}
