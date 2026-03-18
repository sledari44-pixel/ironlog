# IronLog — Weightlifting Tracker

A PWA (Progressive Web App) that runs in Chrome on Android and syncs every set to Supabase.

---

## Setup in 5 steps

### Step 1 — Install Node.js
Download from https://nodejs.org (LTS version). Verify: `node -v`

### Step 2 — Create your Supabase database

1. Go to https://supabase.com and create a free account
2. Click **New project** — give it a name (e.g. "ironlog"), pick a region close to you
3. Once created, go to **SQL Editor → New query**
4. Paste the entire contents of `supabase_schema.sql` and click **Run**
5. Go to **Settings → API** and copy:
   - **Project URL** (looks like `https://abcxyz.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

### Step 3 — Configure the app

In the project folder, create a file called `.env.local` (copy from `.env.example`):

```
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Step 4 — Run locally

```bash
npm install
npm run dev
```

The app opens at http://localhost:5173

**To test on your phone** (same WiFi):
- The terminal shows a Network URL like `http://192.168.x.x:5173`
- Open that URL in Chrome on your Android phone

### Step 5 — Deploy to Vercel (free)

1. Push this folder to a GitHub repo
2. Go to https://vercel.com → **Add New Project** → import your repo
3. In **Environment Variables**, add:
   - `VITE_SUPABASE_URL` → your project URL
   - `VITE_SUPABASE_ANON_KEY` → your anon key
4. Click **Deploy** — done! You get a live HTTPS URL

### Install on Android

1. Open your Vercel URL in Chrome on your phone
2. Tap the **⋮** menu → **Add to Home screen**
3. IronLog appears as an app icon — works offline too!

---

## Project structure

```
ironlog/
├── src/
│   ├── components/
│   │   ├── EntryScreen.jsx   ← main log form
│   │   ├── RestTimer.jsx     ← 90-second rest countdown
│   │   └── HistoryScreen.jsx ← past sets from Supabase
│   ├── lib/
│   │   └── supabase.js       ← DB client + exercise lists
│   ├── App.jsx               ← screen routing + nav
│   ├── main.jsx              ← React entry point
│   └── index.css             ← all styles
├── supabase_schema.sql       ← run this in Supabase SQL editor
├── vite.config.js            ← Vite + PWA config
├── .env.example              ← copy to .env.local
└── vercel.json               ← deployment config
```

## Reporting in Supabase

After logging workouts, use **Supabase Table Editor** or the built-in views:

- `daily_volume` — sets, reps, and total volume per day
- `personal_records` — max weight per lift
- `weekly_summary` — workout frequency and volume by week

You can also connect Supabase to tools like **Metabase**, **Grafana**, or **Google Sheets** for richer dashboards.

---

## Adding more exercises

Edit `src/lib/supabase.js` — find the `LIFTS` object and add to any category array.
