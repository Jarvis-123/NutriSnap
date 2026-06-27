import { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import NutritionResult from '../components/NutritionResult'
import { NutritionData } from '../lib/types'
import { analyzeMeal } from '../lib/api'
import { saveMeal } from '../lib/supabase'
import { colors } from '../lib/theme'

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'] as const

export default function ScanScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null)
  const [mimeType, setMimeType] = useState('image/jpeg')
  const [description, setDescription] = useState('')
  const [mealType, setMealType] = useState<string>('lunch')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<NutritionData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function pickImage(useCamera: boolean) {
    const permission = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow camera/photo access to analyze meals.')
      return
    }

    const pickerResult = useCamera
      ? await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          quality: 0.8,
          allowsEditing: true,
          aspect: [4, 3],
        })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          quality: 0.8,
          allowsEditing: true,
          aspect: [4, 3],
        })

    if (!pickerResult.canceled && pickerResult.assets[0]) {
      const asset = pickerResult.assets[0]
      setImageUri(asset.uri)
      setMimeType(asset.mimeType || 'image/jpeg')
      setResult(null)
      setError(null)
      setSaved(false)
    }
  }

  async function handleAnalyze() {
    if (!imageUri) return
    setLoading(true)
    setError(null)
    setResult(null)
    setSaved(false)

    try {
      const data = await analyzeMeal(imageUri, mimeType, description || undefined)
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!result) return
    setSaving(true)
    const meal = await saveMeal(result, null, mealType)
    setSaving(false)
    if (meal) {
      setSaved(true)
    } else {
      Alert.alert('Save failed', 'Could not save meal. Check your Supabase connection.')
    }
  }

  function handleReset() {
    setImageUri(null)
    setDescription('')
    setResult(null)
    setError(null)
    setSaved(false)
  }

  if (result && !loading) {
    return (
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <NutritionResult data={result} />
        {!saved ? (
          <View style={styles.saveCard}>
            <Text style={styles.savePrompt}>Save this meal to your history?</Text>
            <View style={styles.saveActions}>
              <TouchableOpacity
                style={[styles.btn, styles.btnPrimary, styles.flex1]}
                onPress={handleSave}
                disabled={saving}
              >
                <Text style={styles.btnPrimaryText}>{saving ? 'Saving...' : '💾 Save Meal'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.btnSecondary, styles.flex1]} onPress={handleReset}>
                <Text style={styles.btnSecondaryText}>🔄 New Scan</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.savedBanner}>
            <Text style={styles.savedText}>✅ Meal saved to history!</Text>
            <TouchableOpacity onPress={handleReset}>
              <Text style={styles.newScanLink}>New scan</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    )
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View>
        <Text style={styles.title}>NutriSnap</Text>
        <Text style={styles.subtitle}>Snap your meal — get instant nutrition breakdown</Text>
      </View>

      {imageUri ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="cover" />
          <TouchableOpacity style={styles.removeBtn} onPress={() => setImageUri(null)}>
            <Text style={styles.removeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.uploadZone}>
          <Text style={styles.uploadIcon}>📸</Text>
          <Text style={styles.uploadTitle}>Take or choose a food photo</Text>
          <View style={styles.uploadActions}>
            <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={() => pickImage(true)}>
              <Text style={styles.btnPrimaryText}>📷 Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={() => pickImage(false)}>
              <Text style={styles.btnSecondaryText}>🖼 Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View>
        <Text style={styles.label}>
          Describe your meal <Text style={styles.optional}>(optional)</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="e.g. grilled chicken with steamed rice"
          placeholderTextColor={colors.textMuted}
        />
      </View>

      <View>
        <Text style={styles.label}>Meal type</Text>
        <View style={styles.mealTypeGrid}>
          {MEAL_TYPES.map(type => (
            <TouchableOpacity
              key={type}
              style={[styles.mealTypeBtn, mealType === type && styles.mealTypeBtnActive]}
              onPress={() => setMealType(type)}
            >
              <Text style={[styles.mealTypeText, mealType === type && styles.mealTypeTextActive]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      ) : null}

      <TouchableOpacity
        style={[styles.btn, styles.btnPrimary, styles.analyzeBtn, (!imageUri || loading) && styles.btnDisabled]}
        onPress={handleAnalyze}
        disabled={!imageUri || loading}
      >
        {loading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color="#fff" />
            <Text style={styles.btnPrimaryText}>Analyzing your meal...</Text>
          </View>
        ) : (
          <Text style={styles.btnPrimaryText}>✨ Analyze Nutrition</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 32, gap: 16 },
  title: { fontSize: 24, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 14, color: colors.textMuted, marginTop: 4 },
  uploadZone: {
    backgroundColor: colors.card,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.border,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
  },
  uploadIcon: { fontSize: 48, marginBottom: 12 },
  uploadTitle: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 16 },
  uploadActions: { flexDirection: 'row', gap: 12 },
  previewContainer: { borderRadius: 16, overflow: 'hidden', position: 'relative' },
  preview: { width: '100%', height: 240, backgroundColor: colors.border },
  removeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtnText: { color: '#fff', fontSize: 14 },
  label: { fontSize: 14, fontWeight: '500', color: colors.text, marginBottom: 8 },
  optional: { fontWeight: '400', color: colors.textMuted },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text,
  },
  mealTypeGrid: { flexDirection: 'row', gap: 8 },
  mealTypeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
  },
  mealTypeBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  mealTypeText: { fontSize: 12, fontWeight: '500', color: colors.textMuted, textTransform: 'capitalize' },
  mealTypeTextActive: { color: '#fff' },
  errorBox: {
    backgroundColor: colors.errorBg,
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 12,
    padding: 12,
  },
  errorText: { color: colors.error, fontSize: 14 },
  btn: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnPrimary: { backgroundColor: colors.primary },
  btnPrimaryText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  btnSecondary: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnSecondaryText: { color: colors.text, fontSize: 14, fontWeight: '500' },
  btnDisabled: { opacity: 0.5 },
  analyzeBtn: { marginTop: 4 },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  flex1: { flex: 1 },
  saveCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  savePrompt: { fontSize: 14, fontWeight: '500', color: colors.text },
  saveActions: { flexDirection: 'row', gap: 12 },
  savedBanner: {
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  savedText: { color: colors.primaryDark, fontWeight: '500', fontSize: 14 },
  newScanLink: { color: colors.primary, fontSize: 14, textDecorationLine: 'underline' },
})
