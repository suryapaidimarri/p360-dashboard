# P360 Dashboard — Deployment Guide

## Stack 
- Next.js 14 (App Router)
- Supabase (Auth + Database)
- Tailwind CSS
- Recharts
- Vercel (hosting)

---

## Step 1 — Push to GitHub

1. Go to **github.com** → click **New repository**
2. Name it `p360-dashboard` → click **Create repository**
3. Upload all these files (drag & drop the folder) or use GitHub Desktop

---

## Step 2 — Set up Supabase

1. Go to your Supabase project → click **SQL Editor**
2. Paste the entire contents of `supabase-schema.sql`
3. Click **Run** — this creates all your tables
4. Go to **Authentication → Settings** → enable Email auth
5. Go to **Project Settings → API** → copy:
   - Project URL
   - anon/public key
   - service_role key (keep secret!)

---

## Step 3 — Deploy to Vercel

1. Go to **vercel.com** → click **Add New Project**
2. Click **Import** next to your `p360-dashboard` GitHub repo
3. Framework: **Next.js** (auto-detected)
4. Click **Environment Variables** and add:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
RESEND_API_KEY=re_your_resend_key (get free at resend.com)
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

5. Click **Deploy** — done! Your app is live in ~2 minutes.

---

## Step 4 — Create your first admin user

1. In Supabase → **Authentication → Users** → click **Add User**
2. Enter your email and password
3. In **SQL Editor** run:
```sql
update public.profiles set role = 'admin' where email = 'your@email.com';
```

---

## Step 5 — Add client users

For each client who needs login access:
1. In Supabase → **Authentication → Users** → **Add User**
2. In SQL Editor run:
```sql
update public.profiles 
set role = 'client', client_id = 'CLIENT_UUID_HERE'
where email = 'client@company.com';
```

---

## Folder Structure

```
p360/
├── app/
│   ├── (auth)/login/        # Login page
│   ├── (dashboard)/
│   │   ├── layout.tsx       # Sidebar layout
│   │   ├── clients/         # Client grid
│   │   ├── clients/[id]/    # Client workspace
│   │   ├── datasources/     # Data sources
│   │   ├── reports/         # Reports
│   │   └── rollup/          # Roll-up dashboard
│   ├── globals.css
│   └── layout.tsx
├── components/
│   └── dashboard/
│       ├── ClientCard.tsx
│       └── AddClientModal.tsx
├── lib/supabase/
│   ├── client.ts
│   └── server.ts
├── types/index.ts
├── supabase-schema.sql      # Run this in Supabase
└── .env.local.example       # Copy to .env.local
```
