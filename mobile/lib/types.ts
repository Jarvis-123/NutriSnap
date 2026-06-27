export interface FoodItem {
  name: string
  portion: string
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  sugar: number
  sodium: number
  calcium: number
  iron: number
  vitamin_c: number
  vitamin_a: number
  potassium: number
}

export interface NutritionData {
  foods: FoodItem[]
  total_calories: number
  total_protein: number
  total_carbs: number
  total_fat: number
  meal_assessment: string
  suggestions: string[]
}

export interface Meal {
  id: string
  created_at: string
  image_url: string | null
  foods: FoodItem[]
  total_calories: number
  total_protein: number
  total_carbs: number
  total_fat: number
  meal_type: string
  meal_assessment?: string
  suggestions?: string[]
}

export interface DailyGoals {
  calories: number
  protein: number
  carbs: number
  fat: number
}

export const DEFAULT_GOALS: DailyGoals = {
  calories: 2000,
  protein: 150,
  carbs: 250,
  fat: 65,
}
