# DevSync Backend Tasks

## ✅ What's Done

### Authentication & Image Upload
- **Supabase Google OAuth** - Users can sign in with Google
- **Profile Image Upload** - Images stored in Supabase Storage bucket
- **Session Management** - AuthContext handles user sessions
- **Route Protection** - ProtectedRoute component for auth-required pages

### Database Setup
- **Neon Database** - PostgreSQL database hosted on Neon
- **Prisma ORM** - Type-safe database operations
- **User & Profile Models** - Basic user data and profile information

## 🔄 Current Flow

1. **User signs in** → Supabase Google OAuth
2. **Uploads profile image** → Supabase Storage
3. **Enters username, bio, resume, GitHub ID** → Prisma database
4. **AI generates profile page** → Based on user data

## 🎯 Next Steps

### 1. Complete Onboarding Form
- [ ] Username input with validation
- [ ] Bio textarea (160 chars max)
- [ ] Resume text paste area
- [ ] GitHub ID input with validation
- [ ] Form submission to Prisma

### 2. AI Profile Generation
- [ ] OpenAI API integration
- [ ] Profile summary generation from resume
- [ ] Skills extraction from resume text
- [ ] Professional bio generation
- [ ] Portfolio page layout generation

### 3. Profile Display Page
- [ ] Dynamic `[username]` route
- [ ] Profile page layout
- [ ] Skills showcase
- [ ] Resume content display
- [ ] GitHub integration display

### 4. Dashboard Features
- [ ] Profile editing
- [ ] Analytics tracking
- [ ] Settings page
- [ ] Profile preview

## 🛠️ Environment Setup

### Required Files
- `.env.local` - Environment variables (copy from `env.txt`)
- `prisma/schema.prisma` - Database schema
- `src/lib/db.ts` - Prisma client

### Required Environment Variables
```env
# Supabase (Auth + Storage)
NEXT_PUBLIC_SUPABASE_URL=https://okxwbzhbokdwmkqbbjps.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here

# Neon Database (Prisma)
DATABASE_URL="postgresql://neondb_owner:npg_Q9c7gAbPtNOn@ep-solitary-sea-a1q4i1jz-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# OpenAI (AI Features)
OPENAI_API_KEY=your-openai-api-key-here
```

## 📋 Quick Setup

1. **Copy environment variables**
   ```bash
   cp env.txt .env.local
   # Edit .env.local with your actual keys
   ```

2. **Setup database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Start development**
   ```bash
   npm run dev
   ```

## 🎨 Current Architecture

```
Frontend (Next.js 15)
├── Authentication (Supabase)
├── Image Upload (Supabase Storage)
├── User Data (Prisma + Neon)
└── AI Features (OpenAI)
```

## 🚀 Immediate Next Task

**Complete the onboarding form submission:**
- Username validation
- Bio textarea
- Resume text paste
- GitHub ID input
- Submit to `/api/onboarding/complete`
- Redirect to dashboard

That's it! Keep it simple and focused on the core functionality.



