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
import MacroBar from '../components/MacroBar'
import { getTodaysMeals, getWeeklyMeals } from '../lib/supabase'
import { Meal, DEFAULT_GOALS } from '../lib/types'
import { colors } from '../lib/theme'

export default function DashboardScreen() {
  const [todayMeals, setTodayMeals] = useState<Meal[]>([])
  const [weeklyMeals, setWeeklyMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async () => {
    const [today, weekly] = await Promise.all([getTodaysMeals(), getWeeklyMeals()])
    setTodayMeals(today)
    setWeeklyMeals(weekly)
    setLoading(false)
    setRefreshing(false)
  }, [])

  useFocusEffect(
    useCallback(() => {
      load()
    }, [load])
  )

  const totals = todayMeals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.total_calories,
      protein: acc.protein + meal.total_protein,
      carbs: acc.carbs + meal.total_carbs,
      fat: acc.fat + meal.total_fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )

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

  const maxWeekly = Math.max(DEFAULT_GOALS.calories, ...last7Days.map(d => d.calories), 1)
  const consumed = Math.round(totals.calories)
  const remaining = Math.max(0, DEFAULT_GOALS.calories - consumed)
  const ringPct = Math.min(100, (consumed / DEFAULT_GOALS.calories) * 100)

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load() }} colors={[colors.primary]} />}
    >
      <View>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.date}>
          {new Date().toLocaleDateString('en-IN', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>TODAY'S CALORIES</Text>
        <View style={styles.ringRow}>
          <View style={styles.ringOuter}>
            <View style={[styles.ringFill, { height: `${ringPct}%` }]} />
            <View style={styles.ringInner}>
              <Text style={styles.ringValue}>{consumed}</Text>
              <Text style={styles.ringUnit}>kcal</Text>
            </View>
          </View>
          <View style={styles.stats}>
            <View>
              <Text style={styles.statLabel}>Consumed</Text>
              <Text style={styles.statValue}>{consumed} kcal</Text>
            </View>
            <View>
              <Text style={styles.statLabel}>Remaining</Text>
              <Text style={[styles.statValue, styles.remaining]}>{remaining} kcal</Text>
            </View>
            <View>
              <Text style={styles.statLabel}>Goal</Text>
              <Text style={styles.statGoal}>{DEFAULT_GOALS.calories} kcal</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>MACROS</Text>
        <MacroBar label="Protein" value={Math.round(totals.protein * 10) / 10} max={DEFAULT_GOALS.protein} unit="g" color={colors.blue} />
        <MacroBar label="Carbs" value={Math.round(totals.carbs * 10) / 10} max={DEFAULT_GOALS.carbs} unit="g" color={colors.amber} />
        <MacroBar label="Fat" value={Math.round(totals.fat * 10) / 10} max={DEFAULT_GOALS.fat} unit="g" color={colors.red} />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>THIS WEEK</Text>
        <View style={styles.chart}>
          {last7Days.map((day, i) => (
            <View key={i} style={styles.barCol}>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      height: `${(day.calories / maxWeekly) * 100}%`,
                      backgroundColor: day.calories >= DEFAULT_GOALS.calories ? colors.amber : colors.primary,
                    },
                  ]}
                />
              </View>
              <Text style={styles.barLabel}>{day.label}</Text>
              <Text style={styles.barValue}>{day.calories}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>TODAY'S MEALS</Text>
        {todayMeals.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🥗</Text>
            <Text style={styles.emptyText}>No meals logged today</Text>
          </View>
        ) : (
          todayMeals.map(meal => (
            <View key={meal.id} style={styles.mealRow}>
              <View>
                <Text style={styles.mealType}>
                  {meal.meal_type} · {meal.foods.length} item{meal.foods.length !== 1 ? 's' : ''}
                </Text>
                <Text style={styles.mealTime}>
                  {new Date(meal.created_at).toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
              <View style={styles.mealCal}>
                <Text style={styles.mealCalValue}>{Math.round(meal.total_calories)}</Text>
                <Text style={styles.mealCalUnit}>kcal</Text>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 32, gap: 12 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  title: { fontSize: 24, fontWeight: '700', color: colors.text },
  date: { fontSize: 14, color: colors.textMuted, marginTop: 2 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  ringRow: { flexDirection: 'row', alignItems: 'center', gap: 24 },
  ringOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.border,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  ringFill: { backgroundColor: colors.primary, width: '100%' },
  ringInner: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  ringValue: { fontSize: 22, fontWeight: '700', color: colors.text },
  ringUnit: { fontSize: 11, color: colors.textMuted },
  stats: { flex: 1, gap: 12 },
  statLabel: { fontSize: 11, color: colors.textMuted },
  statValue: { fontSize: 18, fontWeight: '700', color: colors.text },
  remaining: { color: colors.primary },
  statGoal: { fontSize: 14, fontWeight: '500', color: colors.textMuted },
  chart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 120 },
  barCol: { flex: 1, alignItems: 'center', gap: 4 },
  barTrack: {
    width: 24,
    height: 80,
    backgroundColor: colors.border,
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: { width: '100%', borderRadius: 6 },
  barLabel: { fontSize: 10, color: colors.textMuted },
  barValue: { fontSize: 9, color: colors.textMuted },
  empty: { alignItems: 'center', paddingVertical: 24, gap: 8 },
  emptyIcon: { fontSize: 32 },
  emptyText: { fontSize: 14, color: colors.textMuted },
  mealRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  mealType: { fontSize: 14, fontWeight: '500', color: colors.text, textTransform: 'capitalize' },
  mealTime: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  mealCal: { alignItems: 'flex-end' },
  mealCalValue: { fontSize: 14, fontWeight: '700', color: colors.text },
  mealCalUnit: { fontSize: 10, color: colors.textMuted },
})
