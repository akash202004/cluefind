# DevSync - Architectural Workflow Diagram

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              DevSync Platform Architecture                      │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND LAYER                                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │   Next.js   │  │   React     │  │  Tailwind   │  │   RadixUI   │           │
│  │   App Router│  │ Components  │  │    CSS      │  │ Components  │           │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘           │
│                                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │   Auth     │  │  Dashboard  │  │  Portfolio  │  │   AI        │           │
│  │   Pages    │  │   Pages     │  │   Pages     │  │  Features   │           │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘           │
└─────────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              AUTHENTICATION LAYER                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │ NextAuth.js │  │   GitHub    │  │   Session   │  │    JWT      │           │
│  │             │  │    OAuth    │  │ Management  │  │   Tokens    │           │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘           │
└─────────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              API LAYER                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │   User      │  │   Project   │  │ Endorsement  │  │     AI      │           │
│  │    API      │  │    API      │  │     API      │  │    API      │           │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘           │
│                                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │ Analytics   │  │   Server    │  │ Middleware  │  │ Validation  │           │
│  │    API      │  │  Actions    │  │             │  │   (Zod)    │           │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘           │
└─────────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              BUSINESS LOGIC LAYER                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │    User     │  │   Project   │  │ Endorsement  │  │     AI      │           │
│  │  Service    │  │  Service    │  │   Service    │  │  Service    │           │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘           │
│                                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │ Analytics   │  │   File       │  │   Email      │  │   Cache     │           │
│  │  Service    │  │  Service    │  │  Service    │  │  Service    │           │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘           │
└─────────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              AI INTEGRATION LAYER                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │   OpenAI    │  │   Profile    │  │   Project    │  │   Review     │           │
│  │   GPT-4     │  │ Generator    │  │ Generator    │  │ Generator    │           │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘           │
│                                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │    Skill    │  │   Content    │  │   SEO        │  │   Prompt     │           │
│  │Recommendation│  │Optimization  │  │Optimization  │  │Engineering   │           │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘           │
└─────────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              DATABASE LAYER                                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │    User     │  │   Project    │  │    Skill    │  │ Endorsement │           │
│  │   Table     │  │   Table      │  │   Table     │  │   Table     │           │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘           │
│                                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │ Profile     │  │   AI         │  │   Account   │  │   Session   │           │
│  │ View Table  │  │ Review Table │  │   Table     │  │   Table     │           │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘           │
│                                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │ PostgreSQL  │  │   Prisma    │  │   Indexes   │  │ Migrations  │           │
│  │ Database    │  │    ORM      │  │             │  │             │           │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘           │
└─────────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              EXTERNAL SERVICES                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │   GitHub    │  │ Cloudinary   │  │   Vercel    │  │   Edge      │           │
│  │    API      │  │     CDN      │  │ Deployment  │  │ Functions   │           │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘           │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## User Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              USER JOURNEY FLOW                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Home      │    │   Sign In   │    │   Sign Up  │    │ Onboarding  │
│   Page      │───▶│   Page      │───▶│   Page     │───▶│   Flow      │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                                              │
                                                              ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Dashboard  │    │   AI        │    │   Profile   │    │ Leaderboard │
│   Page      │◀───│  Review     │◀───│    Edit     │◀───│   Page      │
└─────────────┘    │   Page      │    │   Page      │    └─────────────┘
                  └─────────────┘    └─────────────┘           │
                                                              ▼
                                                   ┌─────────────┐
                                                   │   Public    │
                                                   │  Portfolio  │
                                                   │   Page      │
                                                   └─────────────┘

Onboarding Flow (New User Setup):
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Step 1    │    │   Step 2    │    │   Step 3    │    │   Step 4    │
│ Upload      │───▶│ Set         │───▶│ Add Resume  │───▶│ GitHub      │
│ Profile     │    │ Username    │    │ Content     │    │ Integration │
│ Image       │    │             │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                                              │
                                                              ▼
                                                   ┌─────────────┐
                                                   │   AI       │
                                                   │ Processing │
                                                   │ & Profile  │
                                                   │ Generation │
                                                   └─────────────┘

Available Pages:
├── / (Home Page)
├── /signin (Sign In Page)
├── /signup (Sign Up Page)
├── /onboarding (Onboarding Flow - NEW)
├── /dashboard (Dashboard Page)
├── /dashboard/ai-review (AI Review Page)
├── /dashboard/profile/edit (Profile Edit Page)
├── /leaderboard (Leaderboard Page)
└── /[username] (Public Portfolio Page)

Onboarding Steps:
├── Step 1: Upload Profile Image
├── Step 2: Set Username
├── Step 3: Add Resume Content
├── Step 4: GitHub Integration
└── AI Processing & Profile Generation

## Detailed Onboarding Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              ONBOARDING PROCESS                                │
└─────────────────────────────────────────────────────────────────────────────────┘

Step 1: Profile Image Upload
├── User uploads profile picture
├── Image validation (size, format)
├── Cloudinary upload
├── Generate avatar fallback
└── Store image URL in database

Step 2: Username Setup
├── User enters desired username
├── Username availability check
├── Username validation (format, length)
├── Generate unique username if taken
└── Store username in database

Step 3: Resume Content
├── User uploads resume PDF
├── PDF text extraction
├── Parse resume data (skills, experience, projects)
├── Extract key information
└── Store resume data in database

Step 4: GitHub Integration
├── User enters GitHub username
├── GitHub API data fetch
├── Extract repositories, languages, commits
├── Analyze GitHub activity
└── Store GitHub data in database

AI Processing & Profile Generation
├── Combine resume + GitHub data
├── Send to OpenAI GPT-4
├── Generate professional bio
├── Extract and categorize skills
├── Generate project descriptions
├── Create skill recommendations
└── Store AI-generated content

Final Steps
├── Create public portfolio page
├── Generate initial AI review
├── Set up analytics tracking
├── Send welcome email
└── Redirect to dashboard
```

## Onboarding Data Flow

```
User Input ──▶ Validation ──▶ Storage ──▶ AI Processing ──▶ Profile Generation
     │              │             │            │                │
     │              │             │            │                │
     ▼              ▼             ▼            ▼                ▼
Profile Image   Username      Database     OpenAI GPT-4    Public Portfolio
Resume PDF     Check         PostgreSQL   AI Analysis     AI-Generated Content
GitHub ID      Validation    Prisma ORM   Content Gen     Analytics Setup
```

## Required API Endpoints for Onboarding

```
POST /api/onboarding/upload-image
├── Validate image file
├── Upload to Cloudinary
└── Return image URL

POST /api/onboarding/check-username
├── Check username availability
├── Validate username format
└── Return availability status

POST /api/onboarding/upload-resume
├── Validate PDF file
├── Extract text content
├── Parse resume data
└── Return parsed data

POST /api/onboarding/github-data
├── Fetch GitHub profile
├── Get repositories
├── Analyze activity
└── Return GitHub data

POST /api/onboarding/generate-profile
├── Combine all data
├── Send to AI service
├── Generate content
└── Save to database

POST /api/onboarding/complete
├── Mark onboarding complete
├── Create public portfolio
├── Generate initial AI review
└── Redirect to dashboard
```

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              DATA FLOW SEQUENCE                                │
└─────────────────────────────────────────────────────────────────────────────────┘

User Request ──▶ Frontend ──▶ API Routes ──▶ Services ──▶ Database
     │              │             │            │            │
     │              │             │            │            │
     ▼              ▼             ▼            ▼            ▼
   Browser      Next.js App    REST APIs    Business     PostgreSQL
                Router         Server       Logic        + Prisma
                Components     Actions                   ORM

External Services Integration:
     │              │             │            │            │
     ▼              ▼             ▼            ▼            ▼
   GitHub API   Cloudinary     OpenAI      Analytics    Monitoring
   OAuth        CDN           GPT-4       Tracking      Services
```

## Technology Stack

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              TECHNOLOGY STACK                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

Frontend:
├── Next.js 15 (App Router)
├── TypeScript
├── Tailwind CSS
├── RadixUI Components
└── Framer Motion

Backend:
├── Next.js API Routes
├── Server Actions
├── Middleware
└── Zod Validation

Database:
├── PostgreSQL
├── Prisma ORM
├── Database Migrations
└── Connection Pooling

Authentication:
├── NextAuth.js
├── GitHub OAuth
├── JWT Tokens
└── Session Management

AI Integration:
├── OpenAI GPT-4
├── AI SDK
├── Prompt Engineering
└── Response Caching

External Services:
├── GitHub API
├── Cloudinary CDN
├── Vercel Deployment
└── Edge Functions

Development Tools:
├── ESLint
├── Prettier
├── TypeScript Compiler
└── Hot Reload
```

## Key Features & Workflows

### 1. User Registration & Onboarding
- GitHub OAuth authentication
- Profile setup with resume upload
- AI-powered profile generation
- Skill extraction and categorization

### 2. Portfolio Management
- Project upload with image handling
- AI-generated project descriptions
- Skill endorsements system
- Portfolio customization

### 3. AI-Powered Features
- Brutal portfolio reviews
- Skill recommendations
- Content optimization
- Automated bio generation

### 4. Analytics & Insights
- Profile view tracking
- Performance metrics
- Engagement analytics
- Growth recommendations

### 5. Community Features
- Endorsement system
- Leaderboard rankings
- Developer networking
- Skill verification

## Security & Performance

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              SECURITY LAYER                                    │
├── Input Validation (Zod)
├── Authentication (NextAuth.js)
├── Authorization (Role-based)
├── CSRF Protection
├── XSS Prevention
└── SQL Injection Prevention

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              PERFORMANCE LAYER                                 │
├── Code Splitting
├── Image Optimization
├── Caching Strategy
├── ISR (Incremental Static Regeneration)
├── Edge Functions
└── CDN Distribution

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              MONITORING LAYER                                  │
├── Error Tracking
├── Performance Monitoring
├── Analytics
├── Logging
├── Health Checks
└── Alerting
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              DEPLOYMENT FLOW                                   │
└─────────────────────────────────────────────────────────────────────────────────┘

Development ──▶ Git Repository ──▶ CI/CD Pipeline ──▶ Production
     │               │                    │                │
     │               │                    │                │
     ▼               ▼                    ▼                ▼
  Local Dev      GitHub Repo        GitHub Actions      Vercel Hosting
  Environment    Feature Branches   Automated Tests    PostgreSQL DB
                 Pull Requests      Build Process      Cloudinary CDN
                                   Deployment         Edge Functions

Monitoring:
     │               │                    │                │
     ▼               ▼                    ▼                ▼
  Vercel Analytics  Error Tracking   Performance      Uptime Monitoring
                    Logging         Monitoring       Health Checks
```

This architectural diagram shows the complete workflow of the DevSync platform using simple ASCII-style diagrams that are easy to read and understand. The system is designed to be scalable, secure, and performant while providing AI-powered features for developer portfolio optimization.
