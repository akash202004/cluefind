import { db } from "@/lib/db";
import { writeFile } from "fs/promises";
import { join } from "path";

export class ImageService {
  async uploadUserImage(userId: string, file: File) {
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Only image files are allowed');
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }

      // Convert File to Buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename
      const timestamp = Date.now();
      const extension = file.name.split('.').pop();
      const filename = `${timestamp}-${Math.random().toString(36).substring(7)}.${extension}`;

      // Save file to public/uploads directory
      const uploadPath = join(process.cwd(), 'public', 'uploads', filename);
      await writeFile(uploadPath, buffer);

      // Update user image in database
      const updatedUser = await db.user.update({
        where: { id: userId },
        data: { image: `/uploads/${filename}` }
      });

      return {
        imageUrl: `/uploads/${filename}`,
        user: updatedUser
      };
    } catch (error) {
      throw error;
    }
  }
}
