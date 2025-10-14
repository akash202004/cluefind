import { v2 as cloudinary } from "cloudinary";
import { db } from "@/lib/db";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export class CloudinaryService {
  /**
   * Upload user profile image to Cloudinary
   * @param userId - User ID for database update
   * @param file - Image file to upload
   * @param folder - Cloudinary folder (default: 'cluefind/profile')
   * @returns Promise with image URL and updated user
   */
  async uploadUserImage(
    userId: string, 
    file: File, 
    folder: string = "cluefind/profile"
  ) {
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

      // Upload to Cloudinary
      const secureUrl: string = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder,
            overwrite: true,
            unique_filename: true,
            resource_type: "image",
            transformation: [
              { 
                width: 512, 
                height: 512, 
                crop: "fill", 
                gravity: "face" 
              }
            ],
          },
          (err, res) => (err ? reject(err) : resolve(res!.secure_url))
        );
        stream.end(buffer);
      });

      // Update user image in database
      const updatedUser = await db.user.update({
        where: { id: userId },
        data: { image: secureUrl }
      });

      return {
        imageUrl: secureUrl,
        user: updatedUser
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Upload image without database update (for temporary storage)
   * @param file - Image file to upload
   * @param folder - Cloudinary folder (default: 'cluefind/temp')
   * @returns Promise with image URL
   */
  async uploadImage(
    file: File, 
    folder: string = "cluefind/temp"
  ) {
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

      // Upload to Cloudinary
      const secureUrl: string = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder,
            overwrite: true,
            unique_filename: true,
            resource_type: "image",
            transformation: [
              { 
                width: 512, 
                height: 512, 
                crop: "fill", 
                gravity: "face" 
              }
            ],
          },
          (err, res) => (err ? reject(err) : resolve(res!.secure_url))
        );
        stream.end(buffer);
      });

      return {
        imageUrl: secureUrl
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete image from Cloudinary
   * @param imageUrl - Full Cloudinary URL
   * @returns Promise with deletion result
   */
  async deleteImage(imageUrl: string) {
    try {
      // Extract public_id from Cloudinary URL
      const publicId = this.extractPublicId(imageUrl);
      
      if (!publicId) {
        throw new Error('Invalid Cloudinary URL');
      }

      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Extract public_id from Cloudinary URL
   * @param url - Cloudinary URL
   * @returns public_id or null
   */
  private extractPublicId(url: string): string | null {
    try {
      const urlParts = url.split('/');
      const filename = urlParts[urlParts.length - 1];
      return filename.split('.')[0];
    } catch {
      return null;
    }
  }
}
