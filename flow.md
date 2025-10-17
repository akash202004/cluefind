┌─────────────────────────────────────────────────────────────────────────────────┐
│                           USER LANDS ON PAGE (/)                                │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           1. ROOT LAYOUT LOADS                                  │
│                         src/app/layout.tsx                                      │
│                                                                                 │
│  <html>                                                                         │
│    <body>                                                                       │
│      <Providers>  ← Wraps entire app                                           │
│        {children} ← This becomes page.tsx                                      │
│      </Providers>                                                               │
│    </body>                                                                      │
│  </html>                                                                        │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        2. PROVIDERS INITIALIZE                                  │
│                        src/app/providers.tsx                                    │
│                                                                                 │
│  <AuthProvider>  ← Authentication context                                      │
│    {children}                                                                   │
│    <Toaster />   ← Toast notifications                                         │
│  </AuthProvider>                                                               │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                     3. AUTH CONTEXT INITIALIZES                                 │
│                    src/contexts/AuthContext.tsx                                 │
│                                                                                 │
│  State:                                                                         │
│  - user: null                                                                   │
│  - loading: true  ← Starts as true                                             │
│  - hasProfile: null                                                            │
│                                                                                 │
│  useEffect(() => {                                                              │
│    checkAuthStatus();  ← Immediately calls                                     │
│  }, []);                                                                        │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                       4. AUTH CHECK BEGINS                                      │
│                    checkAuthStatus() function                                   │
│                                                                                 │
│  fetch("/api/auth/me", {                                                        │
│    method: "GET",                                                               │
│    credentials: "include"  ← Sends session cookie                              │
│  })                                                                             │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                     5. API ENDPOINT PROCESSES                                   │
│                   src/app/api/auth/me/route.ts                                  │
│                                                                                 │
│  const sessionCookie = cookieStore.get('session');                             │
│                                                                                 │
│  IF sessionCookie exists:                                                       │
│    - Parse session data                                                         │
│    - Query database for full user data                                         │
│    - Return user object                                                        │
│                                                                                 │
│  IF no sessionCookie:                                                           │
│    - Return 401 error                                                           │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                       6. RESPONSE HANDLING                                      │
│                    AuthContext processes response                               │
│                                                                                 │
│  IF response.ok:                                                                │
│    setUser(userData)                                                           │
│    IF userData.googleId exists:                                                │
│      checkProfile(userData.googleId)  ← Check if user has profile              │
│    ELSE:                                                                        │
│      setHasProfile(false)                                                       │
│                                                                                 │
│  IF response not ok:                                                            │
│    setUser(null)                                                               │
│    setHasProfile(false)                                                        │
│                                                                                 │
│  FINALLY:                                                                       │
│    setLoading(false)  ← Auth check complete                                    │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                     7. PROFILE CHECK (if user exists)                           │
│                 src/app/api/users/check-onboarding/route.ts                     │
│                                                                                 │
│  POST /api/users/check-onboarding                                               │
│  Body: { googleId }                                                            │
│                                                                                 │
│  Query database:                                                                │
│  - Check if user has completed onboarding                                      │
│  - Check if user has a profile                                                 │
│  - Return { onboardingComplete: true/false }                                   │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        8. HOMEPAGE RENDERS                                      │
│                       src/app/page.tsx                                          │
│                                                                                 │
│  const { user, loading: authLoading, hasProfile } = useAuth();                 │
│                                                                                 │
│  IF authLoading === true:                                                       │
│    return <LoadingSpinner />;  ← Show loading                                  │
│                                                                                 │
│  useEffect(() => {  ← Redirect logic                                           │
│    IF user && user.role === 'RECRUITER':                                       │
│      router.push("/leaderboard");                                              │
│    ELSE IF user && hasProfile === true:                                        │
│      router.push("/dashboard");                                                │
│  }, [user, hasProfile, authLoading, router]);                                  │
│                                                                                 │
│  IF user should be redirected:                                                  │
│    return null;  ← Don't render landing page                                   │
│                                                                                 │
│  ELSE:                                                                          │
│    return <LandingPageContent />;  ← Show landing page                         │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          9. FINAL DESTINATION                                   │
│                                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                │
│  │   NEW USER      │  │   RECRUITER     │  │   DEVELOPER     │                │
│  │                 │  │                 │  │                 │                │
│  │ Shows Landing   │  │ Redirects to    │  │ IF hasProfile:  │                │
│  │ Page with       │  │ /leaderboard    │  │   → /dashboard  │                │
│  │ "Get Started"   │  │                 │  │ ELSE:           │                │
│  │ button          │  │                 │  │   → Landing     │                │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                │
└─────────────────────────────────────────────────────────────────────────────────┘