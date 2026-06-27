import { createClient } from '@supabase/supabase-js'
import { Meal, NutritionData } from './types'
import { config } from './config'

export const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey)

export async function saveMeal(
  nutrition: NutritionData,
  imageUrl: string | null,
  mealType: string = 'other'
): Promise<Meal | null> {
  const { data, error } = await supabase
    .from('meals')
    .insert({
      image_url: imageUrl,
      foods: nutrition.foods,
      total_calories: Math.round(nutrition.total_calories),
      total_protein: nutrition.total_protein,
      total_carbs: nutrition.total_carbs,
      total_fat: nutrition.total_fat,
      meal_type: mealType,
      meal_assessment: nutrition.meal_assessment,
      suggestions: nutrition.suggestions,
    })
    .select()
    .single()

  if (error) {
    console.error('Error saving meal:', error)
    return null
  }
  return data as Meal
}

export async function getMeals(): Promise<Meal[]> {
  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching meals:', error)
    return []
  }
  return data as Meal[]
}

export async function getTodaysMeals(): Promise<Meal[]> {
  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)

  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .gte('created_at', startOfDay.toISOString())
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching today meals:', error)
    return []
  }
  return data as Meal[]
}

export async function getWeeklyMeals(): Promise<Meal[]> {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
  sevenDaysAgo.setHours(0, 0, 0, 0)

  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .gte('created_at', sevenDaysAgo.toISOString())
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching weekly meals:', error)
    return []
  }
  return data as Meal[]
}

export async function deleteMeal(id: string): Promise<boolean> {
  const { error } = await supabase.from('meals').delete().eq('id', id)
  if (error) {
    console.error('Error deleting meal:', error)
    return false
  }
  return true
}
