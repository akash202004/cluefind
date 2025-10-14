# DevSync Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        DevSync Platform                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────┐ │
│  │   Frontend      │    │   Backend       │    │  External   │ │
│  │   (Next.js 15)  │    │   (API Routes)  │    │  Services   │ │
│  └─────────────────┘    └─────────────────┘    └─────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Frontend Architecture (Next.js 15 App Router)

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend Layer                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Pages         │  │   Components    │  │   Contexts      │ │
│  │                 │  │                 │  │                 │ │
│  │ • /             │  │ • UI Components │  │ • AuthContext   │ │
│  │ • /get-started  │  │ • Forms         │  │                 │ │
│  │ • /onboarding   │  │ • Portfolio     │  │                 │ │
│  │ • /dashboard    │  │ • AI            │  │                 │ │
│  │ • /[username]   │  │                 │  │                 │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Hooks         │  │   Services      │  │   Utils         │ │
│  │                 │  │                 │  │                 │ │
│  │ • useAuth       │  │ • User Service  │  │ • API Response  │ │
│  │ • useOnboarding │  │ • Profile Svc   │  │ • Request Help  │ │
│  │                 │  │ • Image Service │  │ • Validations   │ │
│  │                 │  │ • GitHub Svc    │  │                 │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Backend Architecture (API Routes)

```
┌─────────────────────────────────────────────────────────────────┐
│                        Backend Layer                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Auth APIs     │  │   User APIs     │  │   Profile APIs  │ │
│  │                 │  │                 │  │                 │ │
│  │ • /auth/me      │  │ • /users/[id]   │  │ • /profiles/[id]│ │
│  │ • /auth/signout │  │ • /users/check  │  │ • /profiles/    │ │
│  │ • /auth/callback│  │   -onboarding   │  │   skills        │ │
│  │                 │  │                 │  │ • /profiles/    │ │
│  │                 │  │                 │  │   projects     │ │
│  │                 │  │                 │  │ • /profiles/    │ │
│  │                 │  │                 │  │   social-links  │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Upload APIs   │  │   Onboarding    │  │   Repo APIs     │ │
│  │                 │  │   APIs          │  │                 │ │
│  │ • /upload/      │  │ • /onboarding/  │  │ • /repos/[id]   │ │
│  │   profile-image │  │   complete      │  │ • /repos/       │ │
│  │                 │  │ • /onboarding/  │  │                 │ │
│  │                 │  │   check-username│  │                 │ │
│  │                 │  │ • /onboarding/  │  │                 │ │
│  │                 │  │   github-data   │  │                 │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Data Layer (Prisma + PostgreSQL)

```
┌─────────────────────────────────────────────────────────────────┐
│                        Data Layer                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   User Model    │  │   Profile Model │  │   Repo Model    │ │
│  │                 │  │                 │  │                 │ │
│  │ • id            │  │ • userId        │  │ • id            │ │
│  │ • email         │  │ • skills[]      │  │ • name          │ │
│  │ • name          │  │ • resumeContent │  │ • description   │ │
│  │ • username      │  │ • githubId      │  │ • language      │ │
│  │ • image         │  │ • projects(JSON)│  │ • stars         │ │
│  │ • bio           │  │ • socialLinks   │  │ • forks         │ │
│  │ • googleId      │  │   (JSON)        │  │ • profileId     │ │
│  │ • onboarding    │  │                 │  │                 │ │
│  │   Complete      │  │                 │  │                 │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                 │
│  ┌─────────────────┐                                           │
│  │   Vouch Model   │                                           │
│  │                 │                                           │
│  │ • id            │                                           │
│  │ • skill         │                                           │
│  │ • message       │                                           │
│  │ • profileId     │                                           │
│  │ • userId        │                                           │
│  │                 │                                           │
│  └─────────────────┘                                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## External Services Integration

```
┌─────────────────────────────────────────────────────────────────┐
│                    External Services                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Cloudinary    │  │   GitHub API    │  │   OpenAI API    │ │
│  │                 │  │                 │  │   (Optional)    │ │
│  │ • Image Upload  │  │ • User Repos    │  │ • Portfolio     │ │
│  │ • CDN Delivery  │  │ • Languages     │  │   Review        │ │
│  │ • Transformations│  │ • Stars/Forks  │  │ • Resume        │ │
│  │                 │  │                 │  │   Enhancement   │ │
│  │                 │  │                 │  │ • Skill Gap     │ │
│  │                 │  │                 │  │   Analysis      │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Authentication Flow                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. User clicks "Get Started"                                   │
│     ↓                                                           │
│  2. Redirect to Google OAuth                                    │
│     ↓                                                           │
│  3. Google callback → /api/auth/callback                        │
│     ↓                                                           │
│  4. Create/Update user in DB                                    │
│     ↓                                                           │
│  5. Set session cookie                                          │
│     ↓                                                           │
│  6. Check onboarding status                                     │
│     ↓                                                           │
│  7. Redirect to /onboarding or /dashboard                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Onboarding Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      Onboarding Flow                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Step 1: Profile Image                                          │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ • Upload to Cloudinary                                      │ │
│  │ • Save secure_url to User.image                            │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  Step 2: Username                                               │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ • Check availability via /api/onboarding/check-username    │ │
│  │ • Save to User.username                                     │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  Step 3: Bio                                                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ • Save to User.bio                                          │ │
│  │ • Create Profile record                                     │ │
│  │ • Mark onboarding complete                                  │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Dashboard Navigation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Dashboard Navigation                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Hash-based Navigation:                                         │
│                                                                 │
│  /dashboard#overview      → Overview Panel                      │
│  /dashboard#view-profile  → View Profile Panel                  │
│  /dashboard#edit-profile  → Edit Profile Panel                  │
│  /dashboard#resume        → Resume Content Panel                │
│  /dashboard#github        → GitHub Connection Panel             │
│  /dashboard#skills        → Skills Management Panel             │
│  /dashboard#projects      → Projects Management Panel           │
│  /dashboard#social        → Social Links Panel                  │
│  /dashboard#ai            → AI Review Panel                     │
│                                                                 │
│  Each panel:                                                   │
│  • Pre-loads existing data from API                            │
│  • Has individual save functionality                           │
│  • Shows toast notifications                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Public Profile Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Public Profile Flow                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Route: /[username]                                             │
│                                                                 │
│  1. Server-side fetch:                                          │
│     ┌─────────────────────────────────────────────────────────┐ │
│     │ db.user.findUnique({                                    │ │
│     │   where: { username },                                  │ │
│     │   select: {                                             │ │
│     │     name, bio, image,                                   │ │
│     │     profile: { skills, socialLinks }                    │ │
│     │   }                                                     │ │
│     │ })                                                      │ │
│     └─────────────────────────────────────────────────────────┘ │
│                                                                 │
│  2. Render components:                                          │
│     • Profile image (from Cloudinary)                          │
│     • Name and bio                                             │
│     • Skills as pills                                          │
│     • Social links (GitHub + others)                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Key Design Patterns

### 1. Service Layer Pattern
- Business logic separated into service classes
- Database operations abstracted from API routes
- Reusable across different endpoints

### 2. Context Pattern (React)
- AuthContext manages global authentication state
- Provides user data and auth methods to components
- Handles session management and profile checks

### 3. Hash-based Navigation
- Single-page dashboard with hash routing
- Smooth transitions between panels
- No page reloads for better UX

### 4. Toast Notification System
- Global toast provider for user feedback
- Consistent success/error messaging
- Replaces browser alerts

### 5. Validation Layer
- Zod schemas for type-safe validation
- Server-side validation for all API inputs
- Client-side validation for better UX

## Technology Stack Summary

```
Frontend:
├── Next.js 15 (App Router)
├── React 18 + TypeScript
├── TailwindCSS + RadixUI
├── react-hot-toast
└── lucide-react icons

Backend:
├── Next.js API Routes
├── Prisma ORM
├── PostgreSQL (Neon)
└── Custom session management

External Services:
├── Cloudinary (Image uploads)
├── GitHub API (Repository data)
└── OpenAI API (AI features - optional)

Development:
├── TypeScript strict mode
├── ESLint + Prettier
├── Git workflow
└── Vercel deployment
```

## Security Considerations

- Server-side validation for all inputs
- Session-based authentication (no JWT)
- Environment variables for secrets
- CORS configuration
- Input sanitization
- Rate limiting (recommended for AI features)

## Scalability Notes

- Database connection pooling via Prisma
- CDN delivery for images via Cloudinary
- Stateless API design
- Horizontal scaling ready
- Caching strategies for GitHub API calls
- Optional Redis for session storage

