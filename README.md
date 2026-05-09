# Fake Job Offer Detector (JobGuard AI)

A full-stack web application designed to detect scam job offers using OpenAI for text analysis and VirusTotal for malicious link checking.

## Tech Stack
- **Frontend:** React (Vite), Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express, Multer, pdf-parse
- **Database:** Supabase (PostgreSQL & Auth)
- **AI/APIs:** OpenAI API, VirusTotal API

## Features
- **Job Text Scanner:** Paste job descriptions for AI analysis (Score, Verdict, Reasons).
- **PDF Upload:** Upload job offer PDFs to automatically extract and analyze text.
- **Link Checker:** Automatically extracts URLs from the text and checks them against the VirusTotal database.
- **Secure Authentication:** User accounts managed via Supabase Auth.
- **Scan History:** (Backend ready) Scans are tied to users in PostgreSQL.

---

## Local Setup Instructions

### 1. Database Setup (Supabase)
1. Create a new project on [Supabase](https://supabase.com).
2. Go to the **SQL Editor** and run the contents of `supabase_schema.sql` to create the `scans` table and security policies.
3. Obtain your **Project URL** and **anon key** from Project Settings > API.

### 2. Backend Setup
1. Navigate to the backend folder: `cd backend`
2. Install dependencies: `npm install`
3. Rename `.env.example` to `.env` and fill in your keys:
   - `OPENAI_API_KEY`: Your OpenAI API Key
   - `VIRUSTOTAL_API_KEY`: Your VirusTotal API Key
   - `SUPABASE_URL`: Your Supabase Project URL
   - `SUPABASE_ANON_KEY`: Your Supabase Anon Key
4. Start the server: `npm run dev` (Runs on `http://localhost:5000`)

### 3. Frontend Setup
1. Navigate to the frontend folder: `cd frontend`
2. Install dependencies: `npm install`
3. Rename `.env.example` to `.env` and fill in your keys:
   - `VITE_SUPABASE_URL`: Your Supabase Project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key
   - `VITE_API_BASE_URL`: `http://localhost:5000/api`
4. Start the dev server: `npm run dev`

---

## Deployment Steps

### Backend (Render)
1. Push your code to GitHub.
2. Go to [Render](https://render.com) and create a new **Web Service**.
3. Connect your repository and select the `backend` folder as the Root Directory.
4. Set the Build Command to `npm install` and the Start Command to `npm start`.
5. Add your Environment Variables (`OPENAI_API_KEY`, etc.).
6. Deploy! Copy the Render URL.

### Frontend (Vercel)
1. Go to [Vercel](https://vercel.com) and create a new Project.
2. Import your repository.
3. Set the Framework Preset to **Vite**.
4. Set the Root Directory to `frontend`.
5. Add Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_BASE_URL`: Set this to your newly deployed Render Backend URL (e.g., `https://your-backend.onrender.com/api`).
6. Deploy!
