# Frontend — AgriSense AI (React + Vite)

## Endesha kwenye kompyuta yako

```bash
npm install
cp .env.example .env      # kama .env haipo
# Weka VITE_API_URL kwenye .env, kisha:
npm run dev
```

`.env` ya hapa inasomwa na Vite. Kwa production, `VITE_API_URL` inawekwa kwenye
**Vercel → Settings → Environment Variables**; thamani yake ni URL ya backend
(mfano `https://agri-sense-ai-32tp.onrender.com`).

## Muhimu kwa Vercel

Kwa sababu frontend sasa iko kwenye folder hii, **Vercel Root Directory lazima iwe
`frontend/`** (Project Settings → Build and Deploy → Root Directory). Kisha redeploy.
Bila hiyo, Vercel itajaribu kujenga kutoka mizizi ya repo na itashindwa.

**Usibadilishe** CORS ya backend (`Access-Control-Allow-Origin: *`) — inahitajika
kwa Vercel preview URLs.
