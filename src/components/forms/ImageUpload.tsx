"use client";

import { useState, useRef } from "react";
import { Upload, X, Camera } from "lucide-react";

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (url: string) => void;
  className?: string;
}

export default function ImageUpload({
  currentImage,
  onImageChange,
  className = "",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      alert("Please select a valid image file (JPEG, PNG, WebP, or GIF)");
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert("File size must be less than 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setPreview(data.imageUrl);
      onImageChange(data.imageUrl);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image. Please try again.");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setPreview(null);
    onImageChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      <div className="flex flex-col items-center gap-4">
        {/* Image Preview */}
        {preview && (
          <div className="relative group">
            <img
              src={preview}
              alt="Profile preview"
              className="w-32 h-32 rounded-full object-cover border-4 border-primary shadow-brutalist-lg"
            />
            {!uploading && (
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 w-8 h-8 bg-feature-red text-primary-foreground rounded-full border-2 border-primary flex items-center justify-center hover:bg-feature-red/90 transition-colors shadow-brutalist-sm"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={triggerFileInput}
          disabled={uploading}
          className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
              <span>Uploading...</span>
            </>
          ) : preview ? (
            <>
              <Camera className="w-4 h-4" />
              <span>Change Photo</span>
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              <span>Upload Photo</span>
            </>
          )}
        </button>

        {/* Upload Info */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {uploading
              ? "Uploading your image..."
              : "Upload a profile picture (max 5MB)"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Supports: JPEG, PNG, WebP, GIF
          </p>
        </div>
      </div>
    </div>
  );
}
