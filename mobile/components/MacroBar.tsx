import { View, Text, StyleSheet } from 'react-native'
import { colors } from '../lib/theme'

interface Props {
  label: string
  value: number
  max: number
  unit: string
  color: string
}

export default function MacroBar({ label, value, max, unit, color }: Props) {
  const pct = Math.min(100, (value / max) * 100)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>
          {value}
          {unit} / {max}
          {unit}
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { marginBottom: 4 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  label: { fontSize: 13, fontWeight: '500', color: colors.text },
  value: { fontSize: 12, color: colors.textMuted },
  track: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 4 },
})
