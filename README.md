# NutriSnap 🥗

AI-powered food nutrition analyzer. Snap a photo of your meal and get instant calorie, macro, and micronutrient breakdown — powered by Google Gemini Vision API, completely free.

## Features

- 📸 Photo upload + drag & drop
- 🤖 Gemini Vision AI identifies foods and estimates nutrition
- 🔢 Full breakdown: calories, protein, carbs, fat, fiber, sugar, sodium, vitamins, minerals
- 💾 Meal history saved to Supabase
- 📊 Daily dashboard with calorie ring and macro progress bars
- 📅 Weekly calorie chart
- 📱 Mobile-first, responsive design

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| AI Vision | Google Gemini 2.5 Flash (free tier) |
| Database | Supabase (free tier) |
| Hosting | Vercel (free tier) |

## Setup

### 1. Clone and install

```bash
git clone <your-repo>
cd nutrisnap
npm install
```

### 2. Get your Gemini API key (free)

1. Go to https://aistudio.google.com
2. Click "Get API Key"
3. Create a new project → copy the key
4. No credit card required

### 3. Get Supabase credentials (free)

1. Go to https://supabase.com and create a free project
2. Go to Settings → API
3. Copy your Project URL and anon/public key

### 4. Create Supabase table

Run this SQL in your Supabase SQL Editor (Database → SQL Editor → New query):

```sql
create table meals (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  image_url text,
  foods jsonb,
  total_calories integer,
  total_protein float,
  total_carbs float,
  total_fat float,
  meal_type text default 'other',
  meal_assessment text,
  suggestions jsonb
);

-- Enable Row Level Security (optional but recommended)
alter table meals enable row level security;

-- Allow all operations for now (update for auth later)
create policy "Allow all" on meals for all using (true);
```

### 5. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 6. Run locally

```bash
npm run dev
```

Open http://localhost:3000

## Folder Structure

```
nutrisnap/
├── app/
│   ├── page.tsx              # Home — upload + analyze
│   ├── history/page.tsx      # Meal history
│   ├── dashboard/page.tsx    # Daily + weekly stats
│   ├── api/analyze/route.ts  # Gemini API endpoint
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── UploadZone.tsx        # Drag & drop photo upload
│   ├── NutritionResult.tsx   # Full nutrition breakdown display
│   ├── MacroBar.tsx          # Reusable progress bar
│   ├── DailyRing.tsx         # SVG circular calorie ring
│   ├── WeeklyChart.tsx       # SVG weekly bar chart
│   ├── MealCard.tsx          # History meal card
│   ├── AnalyzeSkeleton.tsx   # Loading skeleton
│   ├── TopNav.tsx
│   └── BottomNav.tsx
├── lib/
│   ├── gemini.ts             # Gemini Vision API helper
│   ├── supabase.ts           # Supabase client + queries
│   └── types.ts              # TypeScript interfaces
├── .env.local.example
└── README.md
```

## Deploy to Vercel (free)

```bash
npm install -g vercel
vercel
```

Add your environment variables in Vercel dashboard → Settings → Environment Variables.

## Free Tier Limits

| Service | Free Limit |
|---|---|
| Gemini 2.5 Flash | 1,500 requests/day, 10 RPM |
| Supabase | 500MB storage, 50,000 rows |
| Vercel | 100GB bandwidth/month |

More than enough for personal or small team use.
