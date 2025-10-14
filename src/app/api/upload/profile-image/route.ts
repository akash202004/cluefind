import { NextRequest, NextResponse } from "next/server";
import { CloudinaryService } from "@/lib/services/cloudinary.service";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("image") as File | null;
    let userId = (form.get("userId") as string | null) || null;

    if (!file) {
      return NextResponse.json({ error: "Missing image" }, { status: 400 });
    }

    // Fallback to session if userId not provided
    if (!userId) {
      const cookieStore = await cookies();
      const sessionCookie = cookieStore.get("session");
      if (sessionCookie?.value) {
        try {
          const session = JSON.parse(sessionCookie.value);
          if (session?.id) {
            userId = session.id as string;
          } else if (session?.googleId) {
            const user = await db.user.findUnique({ where: { googleId: session.googleId } });
            if (user) userId = user.id;
          }
        } catch {}
      }
    }

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Use unified Cloudinary service
    const cloudinaryService = new CloudinaryService();
    const result = await cloudinaryService.uploadUserImage(userId, file, "devsync/profile");

    return NextResponse.json({ 
      imageUrl: result.imageUrl,
      user: result.user 
    }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Upload failed" }, { status: 500 });
  }
}


