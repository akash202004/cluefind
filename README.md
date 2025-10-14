# DevSync - Developer Portfolio & Endorsements Platform

A modern, full-stack developer portfolio platform with AI-powered features and skill endorsements.

## 🚀 Features

- **Portfolio Builder**: Create stunning portfolio pages with drag-and-drop project showcases
- **Skill Endorsements**: Get verified endorsements from colleagues who've worked with you
- **AI-Powered Reviews**: Brutally honest but constructive feedback on your portfolio
- **Analytics Dashboard**: Track profile performance and engagement metrics
- **Custom Domains**: Use your own domain for a professional presence
- **Developer Community**: Connect with other developers and build your network

## 🛠 Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS + RadixUI components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with GitHub OAuth
- **AI Integration**: OpenAI GPT-4
- **File Upload**: Cloudinary
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL database
- GitHub OAuth app
- OpenAI API key
- Cloudinary account

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd devsync
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp env.example .env.local
   ```

   Fill in your environment variables in `.env.local`

4. **Set up the database**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## � Docker Deployment

### Method 1: Docker Compose (Recommended)

1. **Create environment file**

   ```bash
   cp env.txt .env
   ```

2. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

### Method 2: Docker Build with Build Args

1. **Build the Docker image**

   ```bash
   docker build \
     --build-arg OPENAI_API_KEY="your-openai-key" \
     --build-arg DATABASE_URL="your-db-url" \
     --build-arg GOOGLE_CLIENT_ID="your-google-client-id" \
     --build-arg GOOGLE_CLIENT_SECRET="your-google-client-secret" \
     --build-arg GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/callback" \
     --build-arg NEXT_PUBLIC_APP_URL="http://localhost:3000" \
     --build-arg CLOUDINARY_CLOUD_NAME="your-cloudinary-name" \
     --build-arg CLOUDINARY_API_KEY="your-cloudinary-key" \
     --build-arg CLOUDINARY_API_SECRET="your-cloudinary-secret" \
     --build-arg CLOUDINARY_UPLOAD_PRESET="your-upload-preset" \
     -t devsync .
   ```

2. **Run the container**
   ```bash
   docker run -p 3000:3000 \
     -e OPENAI_API_KEY="your-openai-key" \
     -e DATABASE_URL="your-db-url" \
     -e GOOGLE_CLIENT_ID="your-google-client-id" \
     -e GOOGLE_CLIENT_SECRET="your-google-client-secret" \
     -e GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/callback" \
     -e NEXT_PUBLIC_APP_URL="http://localhost:3000" \
     -e CLOUDINARY_CLOUD_NAME="your-cloudinary-name" \
     -e CLOUDINARY_API_KEY="your-cloudinary-key" \
     -e CLOUDINARY_API_SECRET="your-cloudinary-secret" \
     -e CLOUDINARY_UPLOAD_PRESET="your-upload-preset" \
     devsync
   ```

**Note**: The application includes fallback behavior for missing OpenAI API keys during build time, so the build will not fail if the key is not provided.

## �🔧 Environment Variables

| Variable                | Description                    |
| ----------------------- | ------------------------------ |
| `DATABASE_URL`          | PostgreSQL connection string   |
| `NEXTAUTH_URL`          | Your app's URL                 |
| `NEXTAUTH_SECRET`       | Secret for NextAuth.js         |
| `GITHUB_CLIENT_ID`      | GitHub OAuth client ID         |
| `GITHUB_CLIENT_SECRET`  | GitHub OAuth client secret     |
| `OPENAI_API_KEY`        | OpenAI API key for AI features |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name          |
| `CLOUDINARY_API_KEY`    | Cloudinary API key             |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret          |

## 📁 Project Structure

```
src/
├── app/                    # Next.js 15 App Router
│   ├── (auth)/            # Auth-related pages
│   ├── (dashboard)/       # Protected dashboard pages
│   ├── api/               # API routes
│   ├── [username]/        # Dynamic portfolio routes
│   └── globals.css
├── components/            # Reusable components
│   ├── ui/               # RadixUI components
│   ├── forms/            # Form components
│   ├── portfolio/        # Portfolio-specific components
│   └── ai/               # AI-related components
├── lib/                  # Utility functions
│   ├── auth.ts          # NextAuth configuration
│   ├── db.ts            # Prisma client
│   ├── ai.ts            # AI service functions
│   └── utils.ts         # General utilities
├── types/               # TypeScript type definitions
└── hooks/               # Custom React hooks
```

## 🗄 Database Schema

The application uses PostgreSQL with Prisma ORM. Key models include:

- **User**: User profiles and authentication
- **Skill**: User skills with categories and levels
- **Project**: Portfolio projects with metadata
- **Endorsement**: Skill and project endorsements
- **ProfileView**: Analytics and tracking
- **AIReview**: AI-generated portfolio reviews

## 🤖 AI Features

- **Profile Summary Generator**: AI creates professional bios
- **Project Description Helper**: Auto-generate compelling descriptions
- **Skill Recommendations**: AI suggests next skills to learn
- **Portfolio Review**: Brutally honest feedback system
- **Content Optimization**: SEO and readability improvements

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Manual Deployment

1. Build the application

   ```bash
   npm run build
   ```

2. Start the production server
   ```bash
   npm start
   ```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📝 API Documentation

The API follows RESTful conventions:

- `GET /api/users` - Get users
- `POST /api/users` - Create user
- `GET /api/users/[id]` - Get user by ID
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **Your Name** - [GitHub](https://github.com/yourusername) - [LinkedIn](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- RadixUI for accessible components
- OpenAI for AI capabilities
- Vercel for deployment platform
