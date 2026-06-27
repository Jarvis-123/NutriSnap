import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { Meal } from '../lib/types'
import { colors } from '../lib/theme'

interface Props {
  meal: Meal
  onDelete: (id: string) => void
}

const MEAL_ICONS: Record<string, string> = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snack: '🍎',
}

export default function MealCard({ meal, onDelete }: Props) {
  const time = new Date(meal.created_at).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  })
  const foodNames = meal.foods
    .slice(0, 2)
    .map(f => f.name)
    .join(', ')
  const extra = meal.foods.length > 2 ? ` +${meal.foods.length - 2} more` : ''

  function handleDelete() {
    Alert.alert('Delete meal', 'Remove this meal from history?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete(meal.id) },
    ])
  }

  return (
    <View style={styles.card}>
      <Text style={styles.icon}>{MEAL_ICONS[meal.meal_type] || '🍽️'}</Text>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.mealType}>{meal.meal_type}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
        <Text style={styles.foods} numberOfLines={1}>
          {foodNames}
          {extra}
        </Text>
        <View style={styles.macros}>
          <Text style={styles.macroPill}>P {Math.round(meal.total_protein)}g</Text>
          <Text style={[styles.macroPill, styles.carbPill]}>C {Math.round(meal.total_carbs)}g</Text>
          <Text style={[styles.macroPill, styles.fatPill]}>F {Math.round(meal.total_fat)}g</Text>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={styles.calories}>{Math.round(meal.total_calories)}</Text>
        <Text style={styles.kcal}>kcal</Text>
        <TouchableOpacity onPress={handleDelete} hitSlop={8}>
          <Text style={styles.delete}>🗑</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  icon: {
    fontSize: 28,
    width: 48,
    height: 48,
    textAlign: 'center',
    lineHeight: 48,
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    overflow: 'hidden',
  },
  content: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  mealType: { fontSize: 14, fontWeight: '600', color: colors.text, textTransform: 'capitalize' },
  time: { fontSize: 11, color: colors.textMuted },
  foods: { fontSize: 12, color: colors.textMuted, marginTop: 2, textTransform: 'capitalize' },
  macros: { flexDirection: 'row', gap: 6, marginTop: 6 },
  macroPill: {
    fontSize: 10,
    backgroundColor: '#eff6ff',
    color: '#2563eb',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    fontWeight: '500',
  },
  carbPill: { backgroundColor: '#fffbeb', color: '#d97706' },
  fatPill: { backgroundColor: '#fef2f2', color: '#ef4444' },
  right: { alignItems: 'flex-end', gap: 4 },
  calories: { fontSize: 16, fontWeight: '700', color: colors.text },
  kcal: { fontSize: 10, color: colors.textMuted },
  delete: { fontSize: 16, marginTop: 4 },
})
