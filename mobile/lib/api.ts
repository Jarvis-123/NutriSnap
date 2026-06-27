import { NutritionData } from './types'
import { config } from './config'

export async function analyzeMeal(
  imageUri: string,
  mimeType: string,
  description?: string
): Promise<NutritionData> {
  const formData = new FormData()

  formData.append('image', {
    uri: imageUri,
    name: 'meal.jpg',
    type: mimeType,
  } as unknown as Blob)

  if (description) {
    formData.append('description', description)
  }

  const res = await fetch(`${config.apiUrl}/api/analyze`, {
    method: 'POST',
    body: formData,
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Analysis failed')
  }

  return data as NutritionData
}
