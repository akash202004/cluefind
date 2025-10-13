import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);
    return NextResponse.json(session);

  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
  }
}
