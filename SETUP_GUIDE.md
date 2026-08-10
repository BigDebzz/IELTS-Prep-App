# IELTS Prep System — Setup Guide (No Terminal Needed)

This follows the same pattern as PMBuddy: files go into a GitHub repo, Vercel deploys it automatically, you get a live link.

## What you need before starting
- A GitHub account (you have this)
- A Vercel account connected to GitHub (you have this)
- A Gemini API key (you have this — from Google AI Studio)
- A free Supabase account (new — takes 3 minutes) — this stores your progress/scores so they follow you across devices

---

## Step 1 — Create the Supabase project (your database)
1. Go to supabase.com → sign in → "New project"
2. Name it anything (e.g. "ielts-app") → pick a password → create
3. Wait ~2 min for it to spin up
4. Click the **SQL Editor** tab (left sidebar) → **New query**
5. Open the file `supabase_schema.sql` from this package, copy ALL of it, paste into the SQL editor, click **Run**
6. Go to **Project Settings** (gear icon) → **API**
7. Copy two values, you'll need them in Step 3:
   - **Project URL**
   - **anon public** key

## Step 2 — Create the new GitHub repo
1. GitHub.com → New repository → name it (e.g. `ielts-prep-app`) → keep it Public or Private, your choice → Create repository
2. On the empty repo page, click **"uploading an existing file"**
3. From this package, drag in ALL files and folders keeping the exact same structure:
   - `package.json`, `.gitignore`, `supabase_schema.sql` (repo root)
   - the whole `public` folder
   - the whole `src` folder
   - the whole `api` folder
4. Commit the upload (bottom of page → "Commit changes")

> GitHub's drag-and-drop upload preserves folder structure as long as you drag the folders themselves, not just files out of them.

## Step 3 — Connect to Vercel
1. Vercel.com → your dashboard → **Add New → Project**
2. Import the repo you just created
3. Vercel should auto-detect it as **Create React App** — leave build settings as default
4. Before clicking Deploy, open **Environment Variables** and add these four:

| Name | Value |
|---|---|
| `REACT_APP_SUPABASE_URL` | (your Supabase Project URL from Step 1) |
| `REACT_APP_SUPABASE_ANON_KEY` | (your Supabase anon public key from Step 1) |
| `GEMINI_API_KEY` | (your Gemini API key) |

Note: `GEMINI_API_KEY` has no `REACT_APP_` prefix on purpose — that keeps it server-side only, in the `/api/gemini.js` function, never visible in the browser. The other two are safe to expose (Supabase's anon key is designed to be public; your data is protected separately by the Row Level Security rules in the SQL you ran).

5. Click **Deploy**
6. Wait ~1-2 minutes, you'll get a live link like `ielts-prep-app.vercel.app`

## Step 4 — Use it
- Open the link on your PC or your phone — same link works everywhere
- Sign up with any email/password (this becomes your account)
- If Supabase asks you to confirm your email and that's annoying for solo use: Supabase dashboard → Authentication → Providers → Email → turn off "Confirm email" (you can turn it back on later if you add other users)

## Making changes later
Same as PMBuddy: describe what you want changed here in chat, get the updated file(s), go to the file on GitHub, click the pencil (edit) icon, paste the new content, commit. Vercel redeploys automatically within about a minute.

## What's real vs AI-generated (so you always know)
- **Vocabulary tab**: 100% real dictionary/thesaurus data (dictionaryapi.dev + Datamuse APIs) — zero AI generation. AI only checks the sentence YOU write.
- **Writing & Speaking tabs**: You write/speak. AI scores against the real official IELTS band descriptors baked into `src/data/ieltsContent.js` — it's told exactly which criteria to use, not free to invent its own.
- **Reading & Listening tabs**: AI generates fresh practice passages/scripts each time, following the real question-type rules baked into the same file — this is technique practice, not authentic copyrighted Cambridge material (which can't legally be reproduced).
- **Listening audio**: your browser's built-in text-to-speech reading the AI script — free, but a robotic voice, not a real exam recording. Flagged in-app so it's never presented as more than it is.
