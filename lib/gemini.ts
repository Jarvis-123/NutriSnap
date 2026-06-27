import { GoogleGenerativeAI } from '@google/generative-ai'
import { NutritionData } from './types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

const NUTRITION_PROMPT = `You are a professional nutritionist and food recognition AI. Analyze the food in this image and return ONLY a valid JSON object with NO markdown, no backticks, no explanation. Use this exact structure:
{
  "foods": [
    {
      "name": "food name",
      "portion": "estimated portion e.g. 1 cup, 200g",
      "calories": 320,
      "protein": 12.5,
      "carbs": 45.0,
      "fat": 8.0,
      "fiber": 3.2,
      "sugar": 5.0,
      "sodium": 420,
      "calcium": 80,
      "iron": 2.1,
      "vitamin_c": 15,
      "vitamin_a": 120,
      "potassium": 380
    }
  ],
  "total_calories": 320,
  "total_protein": 12.5,
  "total_carbs": 45.0,
  "total_fat": 8.0,
  "meal_assessment": "Brief 1-2 sentence health assessment of this meal",
  "suggestions": ["suggestion 1", "suggestion 2"]
}

Be accurate with portion estimation based on visual cues. If multiple food items are visible, list each separately. All numeric values must be numbers, not strings.`

export async function analyzeFood(
  imageBase64: string,
  mimeType: string,
  description?: string
): Promise<NutritionData> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  const prompt = description
    ? `${NUTRITION_PROMPT}\n\nAdditional context from user: ${description}`
    : NUTRITION_PROMPT

  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        mimeType: mimeType as 'image/jpeg' | 'image/png' | 'image/webp' | 'image/heic',
        data: imageBase64,
      },
    },
  ])

  const text = result.response.text()

  // Strip any accidental markdown code fences
  const cleaned = text
    .replace(/```json\n?/gi, '')
    .replace(/```\n?/gi, '')
    .trim()

  try {
    const parsed = JSON.parse(cleaned) as NutritionData
    return parsed
  } catch {
    throw new Error(`Failed to parse Gemini response as JSON: ${text.slice(0, 200)}`)
  }
}
