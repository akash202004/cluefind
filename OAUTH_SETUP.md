# OAuth Setup Instructions

## GitHub OAuth Setup

1. **Go to GitHub Settings**
   - Navigate to https://github.com/settings/developers
   - Click "OAuth Apps" → "New OAuth App"

2. **Fill in the details:**
   - **Application name**: DevSync
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`

3. **Get Credentials:**
   - Copy the **Client ID**
   - Generate and copy the **Client Secret**

4. **Add to `.env.local`:**
   ```env
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   ```

## Google OAuth Setup

1. **Go to Google Cloud Console**
   - Navigate to https://console.cloud.google.com
   - Create a new project or select existing one
   - Go to "APIs & Services" → "Credentials"

2. **Configure OAuth Consent Screen:**
   - Click "OAuth consent screen"
   - Select "External" user type
   - Fill in required fields:
     - App name: DevSync
     - User support email: your email
     - Developer contact: your email
   - Add scopes: `email`, `profile`
   - Save

3. **Create OAuth Client ID:**
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Name: DevSync
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
   - Click "Create"

4. **Get Credentials:**
   - Copy the **Client ID**
   - Copy the **Client Secret**

5. **Add to `.env.local`:**
   ```env
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

## Complete `.env.local` File

```env
# BetterAuth Configuration
BETTER_AUTH_SECRET=b672ec2786231a8c521702f7a6812f3ffead2225afcb72e715f6b2282d65d5e5
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
DATABASE_URL="postgresql://neondb_owner:npg_Q9c7gAbPtNOn@ep-solitary-sea-a1q4i1jz-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## User Flow

1. User clicks "Get Started" anywhere on the site
2. Redirected to `/get-started` with OAuth buttons
3. User clicks "Continue with GitHub" or "Continue with Google"
4. OAuth provider authenticates
5. User redirected back to app
6. **Auto-detection logic:**
   - If `onboardingComplete` is `true` → Dashboard
   - If user has a `profile` → Dashboard
   - Otherwise → Onboarding

## Testing

1. Restart the dev server after adding credentials
2. Navigate to `http://localhost:3000`
3. Click "Get Started"
4. Try GitHub or Google OAuth
5. Should redirect to onboarding (first time) or dashboard (returning user)

