# Auth Flow Fix - Documentation

## Issues Fixed

### Problem
After Google OAuth login, users were being redirected to login page again, and couldn't upload profile images due to authentication errors.

### Root Causes
1. **Auth callback not handling OAuth code exchange** - The callback wasn't properly exchanging the OAuth code for a session
2. **Database mismatch** - Callback was checking Supabase database instead of Prisma/Neon database
3. **Broken redirects** - Links pointing to deleted `/auth/signin` page
4. **Missing API endpoint** - No endpoint to check user onboarding status in Neon database

## Fixed Files

### 1. `/src/app/auth/callback/page.tsx`
**Changes:**
- Added proper OAuth code exchange using `supabase.auth.exchangeCodeForSession(code)`
- Changed from Supabase database query to Prisma/Neon API call
- Fixed redirect from `/auth/signin` to `/get-started`
- Added `/api/users/check-onboarding` endpoint call to verify user status

### 2. `/src/app/api/users/check-onboarding/route.ts` (NEW)
**Purpose:**
- Checks if user exists in Neon/Prisma database by Google ID
- Returns onboarding completion status
- Used by auth callback to determine where to redirect user

### 3. `/src/lib/supabase-middleware.ts`
**Changes:**
- Updated to allow public routes (homepage, get-started, auth)
- Only protects `/dashboard` and `/onboarding` routes
- Prevents unnecessary redirects for public pages

## Current Auth Flow

1. **User clicks "Get Started"** → `/get-started`
2. **Clicks "Continue with Google"** → Supabase OAuth
3. **Google authentication** → Returns to `/auth/callback?code=...`
4. **Callback page:**
   - Exchanges OAuth code for session
   - Calls `/api/users/check-onboarding` with Google ID
   - If user exists & onboarding complete → `/dashboard`
   - If user new or incomplete → `/onboarding`
5. **Onboarding page:**
   - Checks session
   - If no session → Redirect to `/get-started`
   - If session exists → Show onboarding steps
6. **After completing onboarding:**
   - Creates user in Neon database
   - Creates profile with all fields
   - Redirects to `/dashboard`

## Session Management

- **Supabase handles authentication** (OAuth, sessions, tokens)
- **Prisma/Neon stores user data** (profiles, projects, etc.)
- **Middleware protects routes** (dashboard, onboarding require auth)
- **Public routes** (/, /get-started, /auth/*) don't require auth

## Testing Checklist

- [ ] Click "Get Started" → Should show Google OAuth button
- [ ] Sign in with Google → Should redirect to callback
- [ ] Callback → Should redirect to onboarding (new user) or dashboard (existing)
- [ ] Onboarding → Should maintain session, allow image upload
- [ ] Complete onboarding → Should save to database and redirect to dashboard
- [ ] Refresh during onboarding → Should maintain session, not redirect to login

## Environment Variables Required

```env
# .env.local
DATABASE_URL="your-neon-postgres-url"
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

## Notes

- Supabase only used for authentication (OAuth, sessions)
- All user data stored in Neon/Prisma database
- Session cookies automatically managed by Supabase client
- Middleware refreshes session on each request




