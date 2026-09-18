# AgriSense AI — Competition Frontend

A polished responsive React + Vite + Tailwind CSS frontend for an AI-powered precision agriculture platform.

## Stack
- React 18
- Vite
- Tailwind CSS
- JavaScript ES6+
- React Router DOM
- Lucide React

## Included
- Home / About / Our Solution / Contact flow
- Login, Register and Forgot Password UI
- Continue with Google as the second authentication option
- Dashboard with N, P, K, soil pH, water pH, humidity, temperature and rainfall
- Farm registration with browser GPS capture
- Soil Diagnosis including **Water pH**
- Crop Recommendation using **Soil pH, N, P, K, Humidity and Temperature only**
- No Soil Moisture field is used in the frontend
- AI Advisor demo chat
- Weather dashboard
- Notifications
- Profile picture upload with 5 MB validation
- Settings with working **System / Light / Dark** theme persistence
- Global **English ↔ Kiswahili** language switching with persistence
- Responsive mobile / tablet / laptop / desktop navigation

## Run
```bash
npm install
npm run dev
```

## Important production integration
This is a frontend-ready architecture. Connect real authentication, AI/ML APIs, weather APIs, database services and multi-sensor IoT through your backend before production.

Do not use demo AI/fertilizer values as real agronomic prescriptions. Production fertilizer/application rates should come from a validated agronomic model/ruleset and the required crop, soil, product and concentration context.
