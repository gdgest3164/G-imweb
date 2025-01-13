"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { AlertModal } from "@/app/components/ui/AlertModal";

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
}

export function ImageUpload({ onUploadComplete }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setError(null);

      const file = e.target.files?.[0];
      if (!file) return;

      if (file.size > 50 * 1024 * 1024) {
        throw new Error("파일 크기는 50MB 이하여야 합니다.");
      }

      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
      const filePath = `public/${fileName}`;

      const { error: uploadError } = await supabase.storage.from("landing-images").upload(filePath, file, {
        contentType: file.type,
        cacheControl: "3600",
      });

      if (uploadError) {
        console.error("Upload error details:", uploadError);
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("landing-images").getPublicUrl(filePath);

      onUploadComplete(publicUrl);
    } catch (error) {
      console.error("Upload error:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("이미지 업로드에 실패했습니다.");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <AlertModal isOpen={error !== null} onClose={() => setError(null)} type="error" message={error || ""} />
      <input type="file" accept="image/*" onChange={uploadImage} disabled={uploading} className="file-input w-full" />
      {uploading && <p className="text-sm text-gray-500">업로드 중...</p>}
    </div>
  );
}
