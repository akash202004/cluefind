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

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [CI/CD Pipeline](#cicd-pipeline)
- [Docker Deployment](#docker-deployment)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Routes](#api-routes)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## 🎯 Overview

**ClueFind** is a modern developer portfolio platform that helps developers showcase their skills, projects, and achievements in a professional, no-nonsense way. Built with Next.js 15, TypeScript, and PostgreSQL, it provides a complete solution for developers to build their online presence and connect with recruiters.

### What Makes ClueFind Different?

- **Profile Builder**: Create professional profiles with resume and GitHub data
- **Skill Endorsements**: Get verified endorsements from colleagues who've worked with you
- **GitHub Integration**: Automatically syncs repositories and activity
- **Portfolio Showcase**: Display your projects and achievements
- **Leaderboard System**: Compete with other developers and showcase your achievements
- **Recruiter Mode**: Special features for recruiters to find top talent

---

## ✨ Key Features

### For Developers

1. **Portfolio Builder**

   - Drag-and-drop project showcases
   - Customizable profile pages
   - Professional bio and social links
   - Image upload with Cloudinary integration

2. **GitHub Integration**

   - Automatic repository syncing
   - Language statistics
   - Contribution graphs
   - Project showcase

3. **Skill Management**

   - Add and manage technical skills
   - Skill endorsements from peers
   - Skill-based search

4. **Social Features**
   - Public profile pages (`/username`)
   - Leaderboard rankings
   - Vouch system for skill verification
   - Social link integration

### For Recruiters

1. **Search & Filter**

   - Advanced search by skills
   - Filter by experience level
   - Location-based search
   - Portfolio quality metrics

2. **Candidate Profiles**
   - Complete developer profiles
   - GitHub activity tracking
   - Project showcases
   - Skill endorsements

---

## 🛠 Tech Stack

### Frontend

- **Framework**: Next.js 15.0.3 (App Router)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 3.3
- **UI Components**: Radix UI
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

### Backend

- **Runtime**: Node.js 18
- **Framework**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma 5.7
- **Authentication**: Google OAuth 2.0
- **File Upload**: Multer + Cloudinary

### External Services

- **Image Storage**: Cloudinary
- **GitHub API**: GitHub REST API v3

### DevOps

- **Containerization**: Docker
- **CI/CD**: GitHub Actions
- **Container Registry**: Docker Hub
- **Hosting**: AWS EC2
- **Reverse Proxy**: Nginx (optional)

---

## 🏗 Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Browser)                      │
└────────────────────┬────────────────────────────────────────┘
                     │
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

### Request Flow

1. **User Request** → Next.js Server
2. **Authentication** → Google OAuth (if protected route)
3. **API Route** → Business Logic
4. **Database** → Prisma ORM → PostgreSQL
5. **External APIs** → GitHub, Cloudinary (as needed)
6. **Response** → JSON or Rendered Page

### CI/CD Pipeline

![Image](./flow.webp)

```

┌─────────────────────────────────────────────────────────────┐
│                    GitHub Repository                         │
│                    (Push to main)                            │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  GitHub Actions Workflow                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  1. Checkout Code                                     │  │
│  │  2. Login to Docker Hub                               │  │
│  │  3. Build Docker Image                                │  │
│  │  4. Push to Docker Hub                                │  │
│  │  5. SSH to EC2                                        │  │
│  │  6. Pull Latest Image                                 │  │
│  │  7. Stop Old Container                                │  │
│  │  8. Run New Container                                 │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    AWS EC2 Instance                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Docker Container (Port 3000)                         │  │
│  │  - Next.js Application                                │  │
│  │  - Environment Variables                              │  │
│  │  - Auto-restart on failure                            │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
full-stack-assignment/
├── .github/
│   └── workflows/
│       └── deploy.yml              # CI/CD Pipeline
├── prisma/
│   └── schema.prisma               # Database Schema
├── public/
│   ├── uploads/                    # User uploaded files
│   └── *.svg                       # Static assets
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── (dashboard)/            # Dashboard routes (protected)
│   │   │   ├── dashboard/          # Main dashboard
│   │   │   ├── profile/edit/       # Edit profile
│   │   │
│   │   ├── (onboarding)/           # Onboarding routes
│   │   │   └── onboarding/         # User onboarding
│   │   ├── [username]/             # Public profile pages
│   │   ├── api/                    # API Routes
│   │   │   ├── auth/               # Authentication
│   │   │   ├── onboarding/         # Onboarding APIs
│   │   │   ├── profiles/           # Profile management
│   │   │   ├── users/              # User management
│   │   │   └── upload/             # File upload
│   │   ├── auth/                   # Auth pages
│   │   ├── leaderboard/            # Leaderboard page
│   │   ├── how-it-works/           # How it works page
│   │   ├── get-started/            # Landing page
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Home page
│   │   └── globals.css             # Global styles
│   ├── components/                 # React Components
│   │   ├── auth/                   # Auth components
│   │   ├── forms/                  # Form components
│   │   ├── portfolio/              # Portfolio components
│   │   ├── recruiter/              # Recruiter components
│   │   └── ui/                     # UI components
│   ├── contexts/                   # React Contexts
│   │   └── AuthContext.tsx         # Authentication context
│   ├── hooks/                      # Custom React Hooks
│   │   └── useOnboarding.tsx       # Onboarding hook
│   ├── lib/                        # Utility Libraries
│   │   ├── services/               # Business logic services
│   │   │   ├── cloudinary.service.ts
│   │   │   ├── github.service.ts
│   │   │   ├── profile.service.ts
│   │   │   ├── repo.service.ts
│   │   │   ├── star.service.ts
│   │   │   ├── user.service.ts
│   │   │   └── vouch.service.ts
│   │   ├── utils/                  # Utility functions
│   │   ├── validations/            # Zod schemas
│   │   ├── db.ts                   # Prisma client
│   │   ├── google-auth.ts          # Google OAuth
│   │   └── multer-config.ts        # File upload config
│   └── types/                      # TypeScript types
│       └── index.ts
├── .env.example                    # Environment variables template
├── Dockerfile                      # Docker configuration
├── docker-compose.yml              # Docker Compose (optional)
├── next.config.ts                  # Next.js config
├── package.json                    # Dependencies
├── tailwind.config.ts              # Tailwind config
└── tsconfig.json                   # TypeScript config
```

---

## 🗄 Database Schema

### Models Overview

```prisma
┌─────────────────────────────────────────────────────────────┐
│                         User Model                          │
├─────────────────────────────────────────────────────────────┤
│ • id (String, Primary Key)                                  │
│ • email (String, Unique)                                    │
│ • username (String, Unique)                                 │
│ • name, bio, image                                          │
│ • role (STUDENT | RECRUITER)                                │
│ • googleId (String, Unique)                                 │
│ • onboardingComplete (Boolean)                              │
│ • createdAt, updatedAt                                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ 1:1
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                        Profile Model                        │
├─────────────────────────────────────────────────────────────┤
│ • id (String, Primary Key)                                  │
│ • userId (String, Foreign Key → User)                       │
│ • skills (String[])                                         │
│ • resumeContent (Text)                                      │
│ • githubId (String)                                         │
│ • projects (JSON)                                           │
│ • socialLinks (JSON)                                        │
│ • lastSyncedAt (DateTime)                                   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ 1:N
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                         Repo Model                          │
├─────────────────────────────────────────────────────────────┤
│ • id (String, Primary Key)                                  │
│ • profileId (String, Foreign Key → Profile)                 │
│ • name, description, url                                    │
│ • languages (String[])                                      │
│ • fork (Boolean)                                            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                         Vouch Model                         │
├─────────────────────────────────────────────────────────────┤
│ • id (String, Primary Key)                                  │
│ • profileId (String, Foreign Key → Profile)                 │
│ • voucherId (String, Foreign Key → User)                    │
│ • skill (String)                                            │
│ • message (Text)                                            │
│ • verified (Boolean)                                        │
│ • Unique(profileId, voucherId)                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      VouchAction Model                      │
├─────────────────────────────────────────────────────────────┤
│ • id (String, Primary Key)                                  │
│ • voucherId (String, Foreign Key → User)                    │
│ • dayKey (String) - Format: YYYY-MM-DD                      │
│ • count (Int) - Number of vouches given today               │
│ • Unique(voucherId, dayKey)                                 │
└─────────────────────────────────────────────────────────────┘
```

### Key Relationships

- **User ↔ Profile**: One-to-One (User can have one profile)
- **Profile ↔ Repo**: One-to-Many (Profile can have multiple repos)
- **Profile ↔ Vouch**: One-to-Many (Profile can receive multiple vouches)
- **User ↔ Vouch**: One-to-Many (User can give multiple vouches)

---

## 🚀 CI/CD Pipeline

### GitHub Actions Workflow

The CI/CD pipeline is defined in `.github/workflows/deploy.yml`:

#### Workflow Steps

1. **Trigger**: Push to `main` branch
2. **Checkout Code**: Clone repository
3. **Docker Login**: Authenticate with Docker Hub using secrets
4. **Build Image**: Build Docker image with tag `latest`
5. **Push to Docker Hub**: Upload image to registry
6. **SSH to EC2**: Connect to EC2 instance
7. **Pull Latest Image**: Download latest image from Docker Hub
8. **Stop Old Container**: Gracefully stop running container
9. **Remove Old Container**: Clean up old container
10. **Run New Container**: Start new container with latest image

#### Required GitHub Secrets

```bash
DOCKER_USERNAME=your-dockerhub-username
DOCKER_PASSWORD=your-dockerhub-password
EC2_HOST=your-ec2-public-ip-or-domain
EC2_SSH_KEY=your-ssh-private-key
```

#### Workflow File

```yaml
name: CI/CD to EC2

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Login to DockerHub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build Docker image
        run: docker build --no-cache -t ${{ secrets.DOCKER_USERNAME }}/full-stack-assignment:latest .

      - name: Push to DockerHub
        run: docker push ${{ secrets.DOCKER_USERNAME }}/full-stack-assignment:latest

      - name: SSH to EC2 and update container
        uses: appleboy/ssh-action@v1.1.0
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ubuntu
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            docker pull ${{ secrets.DOCKER_USERNAME }}/full-stack-assignment:latest
            docker stop full-stack-assignment || true
            docker rm full-stack-assignment || true
            docker run -d -p 3000:3000 \
              --name full-stack-assignment \
              --env-file /home/ubuntu/full-stack-assignment/.env \
              --restart unless-stopped \
              ${{ secrets.DOCKER_USERNAME }}/full-stack-assignment:latest
```

---

## 🐳 Docker Deployment

### Dockerfile Structure

The application uses a **multi-stage build** for optimization:

#### Stage 1: Builder

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install --no-audit --no-fund

# Generate Prisma client
RUN npx prisma generate

# Copy source code and build
COPY . .
RUN npm run build
```

#### Stage 2: Production

```dockerfile
FROM node:18-alpine
WORKDIR /app

# Copy necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/public ./public

# Clean up
RUN rm -rf /app/.next/cache /root/.npm /usr/share/man /tmp/* /var/tmp/*

# Create non-root user
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port and start
EXPOSE 3000
ENV NODE_ENV=production
CMD ["npm", "start"]
```

### Docker Commands

#### Build Image

```bash
docker build -t cluefind:latest .
```

#### Run Container

```bash
docker run -d \
  -p 3000:3000 \
  --name cluefind \
  --env-file .env \
  --restart unless-stopped \
  cluefind:latest
```

#### Docker Compose (Optional)

```yaml
version: "3.8"

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env
    restart: unless-stopped
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Docker (optional)
- Git

### Local Development Setup

#### 1. Clone Repository

```bash
git clone https://github.com/yourusername/cluefind.git
cd cluefind
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/cluefind"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# GitHub (optional)
GITHUB_TOKEN="your-github-token"
```

#### 4. Setup Database

```bash
# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# (Optional) Seed database
npm run db:seed
```

#### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 🔧 Environment Variables

### Required Variables

| Variable               | Description                   | Example                                    |
| ---------------------- | ----------------------------- | ------------------------------------------ |
| `DATABASE_URL`         | PostgreSQL connection string  | `postgresql://user:pass@localhost:5432/db` |
| `NEXTAUTH_URL`         | Application URL               | `http://localhost:3000`                    |
| `NEXTAUTH_SECRET`      | Secret for session encryption | `random-secret-key`                        |
| `GOOGLE_CLIENT_ID`     | Google OAuth Client ID        | `xxx.apps.googleusercontent.com`           |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret    | `GOCSPX-xxx`                               |

### Optional Variables

| Variable                | Description                  | Example      |
| ----------------------- | ---------------------------- | ------------ |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name        | `your-cloud` |
| `CLOUDINARY_API_KEY`    | Cloudinary API key           | `123456789`  |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret        | `secret`     |
| `GITHUB_TOKEN`          | GitHub personal access token | `ghp_xxx`    |

---

## 📡 API Routes

### Authentication

- `POST /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/callback` - OAuth callback
- `GET /api/auth/me` - Get current user
- `POST /api/auth/signout` - Sign out

### Users

- `GET /api/users` - Get all users
- `GET /api/users/[googleId]` - Get user by Google ID
- `PUT /api/users/[googleId]` - Update user
- `GET /api/users/check-onboarding` - Check onboarding status

### Profiles

- `GET /api/profiles` - Get all profiles
- `GET /api/profiles/[id]` - Get profile by ID
- `PUT /api/profiles/[id]` - Update profile
- `PUT /api/profiles/[id]/skills` - Update skills
- `PUT /api/profiles/[id]/projects` - Update projects
- `PUT /api/profiles/[id]/social-links` - Update social links
- `GET /api/profiles/[id]/repos` - Get GitHub repos
- `GET /api/profiles/[id]/github-activity` - Get GitHub activity
- `POST /api/profiles/[id]/vouches` - Create vouch
- `GET /api/profiles/[id]/vouches` - Get vouches
- `DELETE /api/profiles/[id]/stars/[starId]` - Remove star

### Onboarding

- `POST /api/onboarding/check-username` - Check username availability
- `POST /api/onboarding/complete` - Complete onboarding
- `POST /api/onboarding/generate-profile` - Generate profile from resume
- `POST /api/onboarding/github-data` - Fetch GitHub data
- `POST /api/onboarding/upload-resume` - Upload resume

### Upload

- `POST /api/upload/image` - Upload image
- `POST /api/upload/profile-image` - Upload profile image

### Leaderboard

- `GET /api/leaderboard` - Get leaderboard data

---

## 🚢 Deployment

### EC2 Deployment

#### 1. Setup EC2 Instance

```bash
# Connect to EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Docker
sudo apt update
sudo apt install docker.io -y
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group
sudo usermod -aG docker ubuntu
```

#### 2. Create .env File on EC2

```bash
# Create directory
mkdir -p /home/ubuntu/full-stack-assignment
cd /home/ubuntu/full-stack-assignment

# Create .env file
nano .env
# Paste your environment variables
```

#### 3. Run Container

```bash
docker run -d \
  -p 3000:3000 \
  --name full-stack-assignment \
  --env-file /home/ubuntu/full-stack-assignment/.env \
  --restart unless-stopped \
  your-dockerhub-username/full-stack-assignment:latest
```

#### 4. Setup Nginx (Optional)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use ESLint and Prettier
- Write meaningful commit messages
- Add tests for new features
- Update documentation

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Your Name** - [GitHub](https://github.com/yourusername) - [LinkedIn](https://linkedin.com/in/yourprofile)

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Prisma for the excellent ORM
- All contributors and users

---

## 📞 Support

- **Email**: support@cluefind.com
- **Discord**: [Join our Discord](https://discord.gg/cluefind)
- **Twitter**: [@cluefind](https://twitter.com/cluefind)

---

<div align="center">

**Made with ❤️ by the ClueFind Team**

⭐ Star us on GitHub if you find this project helpful!

</div>
