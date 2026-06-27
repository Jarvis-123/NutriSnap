import { useCallback, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import MealCard from '../components/MealCard'
import { getMeals, deleteMeal } from '../lib/supabase'
import { Meal } from '../lib/types'
import { colors } from '../lib/theme'

export default function HistoryScreen() {
  const [meals, setMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchMeals = useCallback(async () => {
    const data = await getMeals()
    setMeals(data)
    setLoading(false)
    setRefreshing(false)
  }, [])

  useFocusEffect(
    useCallback(() => {
      fetchMeals()
    }, [fetchMeals])
  )

  async function handleDelete(id: string) {
    const ok = await deleteMeal(id)
    if (ok) setMeals(prev => prev.filter(m => m.id !== id))
  }

  const grouped = meals.reduce<Record<string, Meal[]>>((acc, meal) => {
    const date = new Date(meal.created_at).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    if (!acc[date]) acc[date] = []
    acc[date].push(meal)
    return acc
  }, {})

  const totalCaloriesToday = meals
    .filter(m => new Date(m.created_at).toDateString() === new Date().toDateString())
    .reduce((sum, m) => sum + m.total_calories, 0)

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  if (meals.length === 0) {
    return (
      <View style={styles.screen}>
        <Text style={styles.title}>Meal History</Text>
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>🍽️</Text>
          <Text style={styles.emptyTitle}>No meals yet</Text>
          <Text style={styles.emptyText}>Start tracking by analyzing your first meal</Text>
        </View>
      </View>
    )
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchMeals() }} colors={[colors.primary]} />}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Meal History</Text>
          <Text style={styles.subtitle}>{meals.length} meals logged</Text>
        </View>
        <View style={styles.todayBadge}>
          <Text style={styles.todayLabel}>Today</Text>
          <Text style={styles.todayValue}>{Math.round(totalCaloriesToday)}</Text>
          <Text style={styles.todayUnit}>kcal</Text>
        </View>
      </View>

      {Object.entries(grouped).map(([date, dayMeals]) => (
        <View key={date} style={styles.dayGroup}>
          <View style={styles.dayHeader}>
            <Text style={styles.dayDate}>{date}</Text>
            <View style={styles.dayLine} />
            <Text style={styles.dayTotal}>
              {Math.round(dayMeals.reduce((s, m) => s + m.total_calories, 0))} kcal
            </Text>
          </View>
          {dayMeals.map(meal => (
            <MealCard key={meal.id} meal={meal} onDelete={handleDelete} />
          ))}
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 32 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 14, color: colors.textMuted, marginTop: 2 },
  todayBadge: {
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  todayLabel: { fontSize: 10, color: colors.textMuted },
  todayValue: { fontSize: 18, fontWeight: '700', color: colors.primary },
  todayUnit: { fontSize: 10, color: colors.textMuted },
  emptyCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    marginTop: 24,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: colors.text },
  emptyText: { fontSize: 14, color: colors.textMuted, textAlign: 'center' },
  dayGroup: { marginBottom: 20 },
  dayHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  dayDate: { fontSize: 13, fontWeight: '600', color: colors.textMuted },
  dayLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dayTotal: { fontSize: 11, color: colors.textMuted },
})
