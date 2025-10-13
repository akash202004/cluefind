import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ImageService } from '@/lib/services/image.service';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);

    // Create form data from request
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    // Upload image using service
    const imageService = new ImageService();
    const result = await imageService.uploadUserImage(session.userId, file);

    return NextResponse.json({
      message: 'Image uploaded successfully',
      imageUrl: result.imageUrl,
      user: result.user
    });

  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json({ error: 'Image upload failed' }, { status: 500 });
  }
}
