import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { uploadSingle } from '@/lib/multer-config';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = cookies();
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

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
    }

    // Convert File to Buffer for multer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const filename = `${timestamp}-${Math.random().toString(36).substring(7)}.${extension}`;

    // Save file to public/uploads directory
    const uploadPath = `public/uploads/${filename}`;
    await Bun.write(uploadPath, buffer);

    // Update user image in database
    const updatedUser = await db.user.update({
      where: { id: session.userId },
      data: { image: `/uploads/${filename}` }
    });

    return NextResponse.json({
      message: 'Image uploaded successfully',
      imageUrl: `/uploads/${filename}`,
      user: updatedUser
    });

  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json({ error: 'Image upload failed' }, { status: 500 });
  }
}
