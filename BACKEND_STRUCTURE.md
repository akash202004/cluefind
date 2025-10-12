# DevSync Backend Structure

This document outlines the complete backend structure for the DevSync developer portfolio platform, built with Next.js 15, Prisma, and Zod.

## 📁 Project Structure

```
src/
├── lib/
│   ├── errors/                    # Error handling utilities
│   │   ├── api-error.ts          # Custom error classes
│   │   └── index.ts              # Error handling functions
│   ├── services/                 # Business logic layer
│   │   ├── user.service.ts       # User operations
│   │   ├── profile.service.ts    # Profile operations
│   │   ├── repo.service.ts       # Repository operations
│   │   ├── star.service.ts       # Star operations
│   │   └── github.service.ts     # GitHub integration
│   ├── utils/                    # Utility functions
│   │   ├── api-response.ts       # API response helpers
│   │   └── request-helpers.ts    # Request validation helpers
│   ├── validations/              # Zod schemas
│   │   ├── user.ts              # User validation schemas
│   │   ├── profile.ts           # Profile validation schemas
│   │   ├── repo.ts              # Repository validation schemas
│   │   └── star.ts              # Star validation schemas
│   ├── db.ts                    # Prisma client
│   ├── auth.ts                  # Authentication config
│   ├── ai.ts                    # AI service functions
│   └── utils.ts                 # General utilities
└── app/
    └── api/                     # API routes (Next.js 15 App Router)
        ├── users/               # User endpoints
        │   ├── route.ts         # GET /api/users, POST /api/users
        │   └── [githubLogin]/   # User-specific operations
        │       ├── route.ts     # GET/PUT/DELETE /api/users/[githubLogin]
        │       └── profile/
        │           └── route.ts # GET/PUT /api/users/[githubLogin]/profile
        ├── profiles/            # Profile endpoints
        │   ├── route.ts         # GET /api/profiles, POST /api/profiles
        │   └── [id]/           # Profile-specific operations
        │       ├── route.ts     # GET/PUT/DELETE /api/profiles/[id]
        │       ├── repos/
        │       │   └── route.ts # GET/POST /api/profiles/[id]/repos
        │       └── stars/
        │           ├── route.ts # GET/POST /api/profiles/[id]/stars
        │           └── [starId]/
        │               └── route.ts # DELETE /api/profiles/[id]/stars/[starId]
        ├── repos/               # Repository endpoints
        │   ├── route.ts         # GET /api/repos
        │   └── [id]/
        │       └── route.ts     # GET/PUT/DELETE /api/repos/[id]
        ├── stars/               # Star endpoints
        │   ├── route.ts         # GET /api/stars
        │   └── [id]/
        │       └── route.ts     # GET/DELETE /api/stars/[id]
        └── github/              # GitHub integration
            ├── sync/
            │   └── route.ts     # POST /api/github/sync
            └── webhook/
                └── route.ts     # POST /api/github/webhook
```

## 🔧 Core Components

### 1. **Validation Layer** (`src/lib/validations/`)

Zod schemas for request validation:

- **User Schemas**: Create, update, and query user data
- **Profile Schemas**: Profile management with skills and bio
- **Repository Schemas**: GitHub repository operations
- **Star Schemas**: Profile starring system

### 2. **Service Layer** (`src/lib/services/`)

Business logic classes:

- **UserService**: User CRUD operations, GitHub sync
- **ProfileService**: Profile management, star counting
- **RepoService**: Repository operations, language tracking
- **StarService**: Star management with IP tracking
- **GitHubService**: GitHub API integration

### 3. **Error Handling** (`src/lib/errors/`)

- **ApiError**: Custom error class with status codes
- **handleApiError**: Centralized error processing
- **ERROR_MESSAGES**: Common error constants

### 4. **Utilities** (`src/lib/utils/`)

- **api-response.ts**: Standardized API response format
- **request-helpers.ts**: Request parsing and validation

### 5. **API Routes** (`src/app/api/`)

RESTful endpoints following Next.js 15 App Router conventions:

#### User Endpoints

- `GET /api/users` - List all users with pagination
- `POST /api/users` - Create new user
- `GET /api/users/[githubLogin]` - Get user by GitHub login
- `PUT /api/users/[githubLogin]` - Update user
- `DELETE /api/users/[githubLogin]` - Delete user

#### Profile Endpoints

- `GET /api/profiles` - List profiles with filtering
- `POST /api/profiles` - Create profile
- `GET /api/profiles/[id]` - Get profile by ID
- `PUT /api/profiles/[id]` - Update profile
- `DELETE /api/profiles/[id]` - Delete profile

#### Repository Endpoints

- `GET /api/repos` - List all repositories
- `GET /api/repos/[id]` - Get repository by ID
- `PUT /api/repos/[id]` - Update repository
- `DELETE /api/repos/[id]` - Delete repository
- `GET /api/profiles/[id]/repos` - Get profile repositories
- `POST /api/profiles/[id]/repos` - Add repository to profile

#### Star Endpoints

- `GET /api/stars` - List all stars
- `GET /api/stars/[id]` - Get star by ID
- `DELETE /api/stars/[id]` - Remove star
- `GET /api/profiles/[id]/stars` - Get profile stars
- `POST /api/profiles/[id]/stars` - Star a profile

#### GitHub Integration

- `POST /api/github/sync` - Sync user data from GitHub
- `POST /api/github/webhook` - Handle GitHub webhooks

## 🚀 Key Features

### 1. **Production-Grade Error Handling**

- Custom error classes with proper HTTP status codes
- Centralized error processing
- Detailed error messages for debugging

### 2. **Request Validation**

- Zod schemas for all API endpoints
- Type-safe request/response handling
- Automatic validation error responses

### 3. **Database Operations**

- Prisma ORM with PostgreSQL
- Optimized queries with proper relations
- Transaction support for complex operations

### 4. **GitHub Integration**

- User data synchronization
- Repository fetching with language detection
- Webhook support for real-time updates

### 5. **Star System**

- IP-based star tracking
- Duplicate prevention
- Profile star counting

### 6. **Pagination & Filtering**

- Consistent pagination across all endpoints
- Search functionality
- Advanced filtering options

## 📋 API Response Format

All API responses follow a consistent format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

## 🔒 Security Features

1. **Input Validation**: All inputs validated with Zod schemas
2. **Error Sanitization**: Sensitive information filtered from errors
3. **Rate Limiting**: Ready for rate limiting implementation
4. **IP Tracking**: Star system uses IP hashing for duplicate prevention

## 🛠 Setup Instructions

1. **Install Dependencies**:

   ```bash
   npm install @octokit/rest
   ```

2. **Environment Variables**:

   ```env
   DATABASE_URL="postgresql://..."
   GITHUB_TOKEN="your_github_token"
   NEXTAUTH_SECRET="your_secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

3. **Database Setup**:

   ```bash
   npm run db:generate
   npm run db:push
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

## 📊 Database Schema

The backend supports the following Prisma models:

- **User**: GitHub user data
- **Profile**: Developer profile with skills and bio
- **Repo**: GitHub repositories with metadata
- **Star**: Profile starring with IP tracking

## 🔄 GitHub Integration

The GitHub service provides:

- User data fetching
- Repository synchronization
- Language detection
- Webhook handling
- Rate limit management

## 🎯 Production Considerations

1. **Caching**: Implement Redis for frequently accessed data
2. **Rate Limiting**: Add rate limiting middleware
3. **Monitoring**: Integrate error tracking (Sentry)
4. **Logging**: Structured logging for debugging
5. **Security**: Add CORS, CSRF protection
6. **Performance**: Database indexing and query optimization

This backend structure provides a solid foundation for a production-grade developer portfolio platform with comprehensive API coverage, proper error handling, and GitHub integration.
