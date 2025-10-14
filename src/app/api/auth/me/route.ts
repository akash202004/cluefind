import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);
    
    // Fetch full user data from database
    if (session.googleId) {
      const user = await db.user.findUnique({
        where: { googleId: session.googleId },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          googleId: true,
          username: true,
          role: true,
        }
      });
      
      if (user) {
        return NextResponse.json(user);
      }
    }

    return NextResponse.json(session);

  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
  }
}
