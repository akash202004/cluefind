# ClueFind - Developer Portfolio Platform

<div align="center">

![ClueFind](https://img.shields.io/badge/ClueFind-Developer%20Portfolio-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.7-2D3748)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791)

**Build Your Developer Portfolio. No Nonsense. Pure Impact.**

[Live Demo](#) • [Documentation](#) • [Report Bug](#)

</div>

---

## 🎯 Overview

**ClueFind** is a modern developer portfolio platform that helps developers showcase their skills, projects, and achievements. Built with Next.js 15, TypeScript, and PostgreSQL, it provides a complete solution for developers to build their online presence and connect with recruiters.

### Key Differentiators

- **AI-Powered Profile Builder** - Generate professional summaries and project descriptions
- **Skill Endorsement Network** - Get verified vouches from colleagues
- **GitHub Integration** - Automatic repository syncing and activity tracking
- **Brutalist Design** - Clean, professional, no-nonsense UI
- **Recruiter Dashboard** - Special features for talent discovery

---

## ✨ Features

### For Developers

- **Portfolio Builder** - Drag-and-drop project showcases with AI-generated descriptions
- **GitHub Integration** - Auto-sync profile data and activity tracking
- **Skill Management** - Add skills and receive peer endorsements
- **Resume AI Review** - Get brutally honest feedback from AI-powered senior engineers
- **Public Profiles** - Custom `username.cluefind.com` URLs
- **Leaderboard** - Compete and showcase achievements
- **Social Links** - Connect GitHub, LinkedIn, and other platforms

### For Recruiters

- **Advanced Search** - Filter by skills, experience, location
- **Candidate Profiles** - Complete developer portfolios with verified skills
- **GitHub Analytics** - Profile quality and activity metrics
- **Skill Verification** - Peer-endorsed technical skills
- **Contact Integration** - Direct communication channels

---

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15.0.3 (App Router)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 3.3 + Custom Brutalist Design System
- **UI Components**: Radix UI + Custom Components
- **Forms**: React Hook Form + Zod Validation
- **Icons**: Lucide React
- **Animations**: React PowerGlitch + Custom CSS
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js 18
- **Framework**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma 5.7
- **Authentication**: Google OAuth 2.0
- **File Upload**: Multer + Cloudinary
- **AI Integration**: OpenAI GPT-4

### External Services
- **Image Storage**: Cloudinary CDN
- **GitHub API**: GitHub REST API v3
- **AI Services**: OpenAI API
- **Authentication**: Google OAuth

### DevOps & Deployment
- **Containerization**: Docker + Multi-stage builds
- **CI/CD**: GitHub Actions
- **Container Registry**: Docker Hub
- **Hosting**: AWS EC2
- **Reverse Proxy**: Nginx (optional)

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Browser)                      │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTPS
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Application                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Frontend   │  │   API Routes │  │  Middleware  │      │
│  │   (React)    │  │   (Server)   │  │   (Auth)     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────┬────────────────────────────────────────┘
                     │
         ┌───────────┼───────────┐
         │           │           │
         ▼           ▼           ▼
┌─────────────┐ ┌──────────┐ ┌──────────┐
│ PostgreSQL  │ │ GitHub   │ │Cloudinary│
│  Database   │ │   API    │ │   CDN    │
└─────────────┘ └──────────┘ └──────────┘
```

---

## 📁 Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── (dashboard)/            # Protected dashboard routes
│   ├── (onboarding)/           # User onboarding flow
│   ├── [username]/             # Public profile pages
│   ├── api/                    # API Routes
│   │   ├── auth/               # Authentication endpoints
│   │   ├── ai/                 # AI-powered features
│   │   ├── profiles/           # Profile management
│   │   ├── onboarding/         # Onboarding APIs
│   │   └── upload/             # File upload handling
│   ├── leaderboard/            # Leaderboard page
│   └── globals.css             # Global styles + Brutalist design
├── components/                 # React Components
│   ├── auth/                   # Authentication components
│   ├── forms/                  # Form components
│   ├── portfolio/              # Portfolio-specific components
│   └── ui/                     # Reusable UI components
├── lib/                        # Utility Libraries
│   ├── services/               # Business logic services
│   ├── validations/            # Zod schemas
│   └── ai.ts                   # AI integration
└── types/                      # TypeScript definitions
```

---

## 🗄 Database Schema

### Core Models

- **User** - Authentication, profile info, role (DEVELOPER/RECRUITER UI-facing; stored as STUDENT/RECRUITER)
- **Profile** - Skills, projects, GitHub data, social links
- **Vouch** - Skill endorsements with verification
- **VouchAction** - Daily vouch limits and tracking

### Key Relationships

- User ↔ Profile (1:1)
- Profile ↔ Vouch (1:N)
- User ↔ Vouch (1:N)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Docker (optional)

### Quick Start

```bash
# Clone repository
git clone https://github.com/yourusername/cluefind.git
cd cluefind

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Setup database
npm run db:generate
npm run db:migrate

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/cluefind"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# External Services
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
OPENAI_API_KEY="your-openai-key"
GITHUB_TOKEN="your-github-token"
```

---

## 🐳 Docker Deployment

### Build & Run

```bash
# Build image
docker build -t cluefind:latest .

# Run container
docker run -d \
  -p 3000:3000 \
  --name cluefind \
  --env-file .env \
  --restart unless-stopped \
  cluefind:latest
```

### CI/CD Pipeline

Automated deployment via GitHub Actions:
1. Push to `main` branch
2. Build Docker image
3. Push to Docker Hub
4. Deploy to AWS EC2
5. Update running container

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/google` - Google OAuth
- `GET /api/auth/me` - Current user
- `POST /api/auth/signout` - Sign out

### Profiles
- `GET /api/profiles` - List profiles (with search)
- `GET /api/profiles/[id]` - Get profile
- `PUT /api/profiles/[id]/skills` - Update skills
- `POST /api/profiles/[id]/vouches` - Create vouch

### AI Features
- `POST /api/ai/review` - AI resume review
- `POST /api/ai/review-resume` - Resume analysis

### Onboarding
- `POST /api/onboarding/check-username` - Username availability
- `POST /api/onboarding/generate-profile` - AI profile generation
- `POST /api/onboarding/github-data` - GitHub integration

---

## 🎨 Design System

### Brutalist UI Components

- **Buttons**: Primary, Secondary, Outline variants with hover effects
- **Cards**: Brutalist cards with shadows and borders
- **Forms**: Input fields with brutalist styling
- **Typography**: Monospace fonts with uppercase styling
- **Colors**: High contrast palette with accent colors
- **Animations**: Glitch effects and smooth transitions

### Key Design Principles

- **High Contrast** - Black borders, bright accents
- **Monospace Typography** - Technical, developer-focused
- **Brutalist Shadows** - 3D effect with offset shadows
- **Minimal Color Palette** - Primary, accent, and muted tones
- **Responsive Design** - Mobile-first approach

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use ESLint and Prettier
- Write meaningful commit messages
- Update documentation for new features

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ by the ClueFind Team**

⭐ Star us on GitHub if you find this project helpful!

</div>