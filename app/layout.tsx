import type { Metadata } from 'next'
import './globals.css'
import BottomNav from '@/components/BottomNav'
import TopNav from '@/components/TopNav'

export const metadata: Metadata = {
  title: 'NutriSnap — AI Food Analyzer',
  description: 'Snap a photo of your meal and get instant nutritional breakdown powered by Gemini AI',
  manifest: '/manifest.json',
  themeColor: '#16a34a',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <TopNav />
        <main className="max-w-2xl mx-auto px-4 pt-16 pb-24">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  )
}
