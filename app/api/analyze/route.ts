import { NextRequest, NextResponse } from 'next/server'
import { analyzeFood } from '@/lib/gemini'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const image = formData.get('image') as File | null
    const description = formData.get('description') as string | null

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const mimeType = image.type || 'image/jpeg'

    const nutrition = await analyzeFood(base64, mimeType, description || undefined)

    return NextResponse.json(nutrition)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Analyze error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
