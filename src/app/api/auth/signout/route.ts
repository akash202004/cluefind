import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('session');

    return NextResponse.json({ message: 'Signed out successfully' });

  } catch (error) {
    console.error('Sign out error:', error);
    return NextResponse.json({ error: 'Sign out failed' }, { status: 500 });
  }
}
