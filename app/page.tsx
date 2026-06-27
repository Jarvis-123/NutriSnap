'use client'

import { useState } from 'react'
import UploadZone from '@/components/UploadZone'
import NutritionResult from '@/components/NutritionResult'
import AnalyzeSkeleton from '@/components/AnalyzeSkeleton'
import { NutritionData } from '@/lib/types'
import { saveMeal } from '@/lib/supabase'

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null)
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<NutritionData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [mealType, setMealType] = useState('other')

  async function handleAnalyze() {
    if (!file) return
    setLoading(true)
    setError(null)
    setResult(null)
    setSaved(false)

    try {
      const formData = new FormData()
      formData.append('image', file)
      if (description) formData.append('description', description)

      const res = await fetch('/api/analyze', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Analysis failed')
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
    if (meal) setSaved(true)
  }

  function handleReset() {
    setFile(null)
    setDescription('')
    setResult(null)
    setError(null)
    setSaved(false)
  }

  return (
    <div className="py-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">NutriSnap</h1>
        <p className="text-gray-500 text-sm mt-1">Snap your meal — get instant nutrition breakdown</p>
      </div>

      {!result && (
        <>
          <UploadZone file={file} onFileSelect={setFile} />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Describe your meal <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g. grilled chicken with steamed rice and salad"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Meal type</label>
            <div className="grid grid-cols-4 gap-2">
              {['breakfast', 'lunch', 'dinner', 'snack'].map(type => (
                <button
                  key={type}
                  onClick={() => setMealType(type)}
                  className={`py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                    mealType === type
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={!file || loading}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base"
          >
            {loading ? (
              <>
                <span className="animate-spin">⏳</span> Analyzing your meal...
              </>
            ) : (
              <>✨ Analyze Nutrition</>
            )}
          </button>
        </>
      )}

      {loading && <AnalyzeSkeleton />}

      {result && !loading && (
        <div className="space-y-4 animate-slide-up">
          <NutritionResult data={result} />

          {!saved ? (
            <div className="card p-4 space-y-3">
              <p className="text-sm font-medium text-gray-700">Save this meal to your history?</p>
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {saving ? 'Saving...' : '💾 Save Meal'}
                </button>
                <button onClick={handleReset} className="btn-secondary flex-1">
                  🔄 New Scan
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 flex items-center justify-between">
              <span className="text-primary-700 font-medium text-sm">✅ Meal saved to history!</span>
              <button onClick={handleReset} className="text-primary-600 text-sm underline">
                New scan
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
