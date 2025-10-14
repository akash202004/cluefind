import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { CloudinaryService } from '@/lib/services/cloudinary.service';

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

    // Upload image using Cloudinary service (temporary storage for onboarding)
    const cloudinaryService = new CloudinaryService();
    const result = await cloudinaryService.uploadImage(file, 'devsync/onboarding');

    console.log("Image uploaded to Cloudinary:", {
      imageUrl: result.imageUrl,
      folder: 'devsync/onboarding'
    });

    return NextResponse.json({
      message: 'Image uploaded successfully',
      imageUrl: result.imageUrl
    });

  } catch (error: any) {
    console.error('Image upload error:', error);
    return NextResponse.json({ 
      error: error.message || 'Image upload failed' 
    }, { status: 500 });
  }
}
