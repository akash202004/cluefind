import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

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

    const ab = await file.arrayBuffer();
    const buffer = Buffer.from(ab);

    const secureUrl: string = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "devsync/profile",
          overwrite: true,
          unique_filename: true,
          resource_type: "image",
          transformation: [{ width: 512, height: 512, crop: "fill", gravity: "face" }],
        },
        (err, res) => (err ? reject(err) : resolve(res!.secure_url))
      );
      stream.end(buffer);
    });

    await db.user.update({ where: { id: userId }, data: { image: secureUrl } });

    return NextResponse.json({ imageUrl: secureUrl }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Upload failed" }, { status: 500 });
  }
}


