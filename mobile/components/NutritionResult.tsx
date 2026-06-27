import { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { NutritionData, FoodItem } from '../lib/types'
import { colors } from '../lib/theme'

interface Props {
  data: NutritionData
}

function FoodCard({ food }: { food: FoodItem }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <View style={styles.foodCard}>
      <View style={styles.foodHeader}>
        <View style={styles.foodInfo}>
          <Text style={styles.foodName}>{food.name}</Text>
          <Text style={styles.foodPortion}>{food.portion}</Text>
        </View>
        <View style={styles.foodCalories}>
          <Text style={styles.calorieValue}>{Math.round(food.calories)}</Text>
          <Text style={styles.calorieUnit}>kcal</Text>
        </View>
      </View>
      <View style={styles.macroRow}>
        <Text style={styles.macroPill}>P: {Math.round(food.protein * 10) / 10}g</Text>
        <Text style={[styles.macroPill, styles.carbPill]}>C: {Math.round(food.carbs * 10) / 10}g</Text>
        <Text style={[styles.macroPill, styles.fatPill]}>F: {Math.round(food.fat * 10) / 10}g</Text>
        <TouchableOpacity onPress={() => setExpanded(!expanded)}>
          <Text style={styles.expandBtn}>{expanded ? '▲ Less' : '▼ Micros'}</Text>
        </TouchableOpacity>
      </View>
      {expanded && (
        <View style={styles.micros}>
          <MicroRow label="Fiber" value={food.fiber} unit="g" />
          <MicroRow label="Sugar" value={food.sugar} unit="g" />
          <MicroRow label="Sodium" value={food.sodium} unit="mg" />
          <MicroRow label="Calcium" value={food.calcium} unit="mg" />
          <MicroRow label="Iron" value={food.iron} unit="mg" />
          <MicroRow label="Vitamin C" value={food.vitamin_c} unit="mg" />
          <MicroRow label="Vitamin A" value={food.vitamin_a} unit="mcg" />
          <MicroRow label="Potassium" value={food.potassium} unit="mg" />
        </View>
      )}
    </View>
  )
}

function MicroRow({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <View style={styles.microRow}>
      <Text style={styles.microLabel}>{label}</Text>
      <Text style={styles.microValue}>
        {Math.round(value * 10) / 10} {unit}
      </Text>
    </View>
  )
}

export default function NutritionResult({ data }: Props) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>MEAL TOTAL</Text>
        <View style={styles.totalsRow}>
          <View style={[styles.totalPill, styles.caloriePill]}>
            <Text style={styles.totalValue}>{Math.round(data.total_calories)}</Text>
            <Text style={styles.totalLabel}>kcal</Text>
          </View>
          <View style={[styles.totalPill, styles.proteinPill]}>
            <Text style={styles.totalValue}>{Math.round(data.total_protein * 10) / 10}g</Text>
            <Text style={styles.totalLabel}>Protein</Text>
          </View>
          <View style={[styles.totalPill, styles.carbTotalPill]}>
            <Text style={styles.totalValue}>{Math.round(data.total_carbs * 10) / 10}g</Text>
            <Text style={styles.totalLabel}>Carbs</Text>
          </View>
          <View style={[styles.totalPill, styles.fatTotalPill]}>
            <Text style={styles.totalValue}>{Math.round(data.total_fat * 10) / 10}g</Text>
            <Text style={styles.totalLabel}>Fat</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>ITEMS DETECTED ({data.foods.length})</Text>
        {data.foods.map((food, i) => (
          <FoodCard key={i} food={food} />
        ))}
      </View>

      {data.meal_assessment ? (
        <View style={styles.assessment}>
          <Text style={styles.assessmentTitle}>AI ASSESSMENT</Text>
          <Text style={styles.assessmentText}>{data.meal_assessment}</Text>
        </View>
      ) : null}

      {data.suggestions?.length > 0 ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>SUGGESTIONS</Text>
          {data.suggestions.map((s, i) => (
            <Text key={i} style={styles.suggestion}>
              💡 {s}
            </Text>
          ))}
        </View>
      ) : null}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  totalsRow: { flexDirection: 'row', gap: 8, justifyContent: 'space-between' },
  totalPill: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
  },
  caloriePill: { backgroundColor: colors.primaryLight },
  proteinPill: { backgroundColor: '#eff6ff' },
  carbTotalPill: { backgroundColor: '#fffbeb' },
  fatTotalPill: { backgroundColor: '#fef2f2' },
  totalValue: { fontSize: 16, fontWeight: '700', color: colors.text },
  totalLabel: { fontSize: 10, color: colors.textMuted, marginTop: 2 },
  foodCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
  },
  foodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: colors.background,
  },
  foodInfo: { flex: 1 },
  foodName: { fontSize: 14, fontWeight: '600', color: colors.text, textTransform: 'capitalize' },
  foodPortion: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  foodCalories: { alignItems: 'flex-end' },
  calorieValue: { fontSize: 16, fontWeight: '700', color: colors.primary },
  calorieUnit: { fontSize: 10, color: colors.textMuted },
  macroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  macroPill: {
    fontSize: 11,
    backgroundColor: '#eff6ff',
    color: '#1d4ed8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontWeight: '500',
  },
  carbPill: { backgroundColor: '#fffbeb', color: '#b45309' },
  fatPill: { backgroundColor: '#fef2f2', color: '#dc2626' },
  expandBtn: { fontSize: 11, color: colors.textMuted, marginLeft: 'auto' },
  micros: { paddingHorizontal: 12, paddingBottom: 12, borderTopWidth: 1, borderTopColor: colors.border },
  microRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  microLabel: { fontSize: 13, color: colors.textMuted },
  microValue: { fontSize: 13, fontWeight: '500', color: colors.text },
  assessment: {
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  assessmentTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  assessmentText: { fontSize: 14, color: '#166534', lineHeight: 20 },
  suggestion: { fontSize: 14, color: colors.text, marginBottom: 8, lineHeight: 20 },
})
