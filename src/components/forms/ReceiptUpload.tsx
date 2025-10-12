import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ReceiptUploadProps {
  onUploadSuccess: (imageUrl: string) => void;
  currentImage?: string;
}

const ReceiptUpload = ({ onUploadSuccess, currentImage }: ReceiptUploadProps) => {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    try {
      setUploading(true);
      
      // Create a unique file name with timestamp
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${timestamp}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload with upsert to avoid conflicts
      const { error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(uploadError.message);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('receipts')
        .getPublicUrl(filePath);

      setPreview(publicUrl);
      onUploadSuccess(publicUrl);
      toast.success("Receipt uploaded successfully!");
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error?.message || "Failed to upload receipt. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Allow images and PDF files
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'application/pdf'];
    if (!allowedTypes.some(type => file.type.includes(type.split('/')[1]))) {
      toast.error("Please upload an image or PDF file");
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    await uploadFile(file);
  };

  const removeImage = () => {
    setPreview(null);
    onUploadSuccess("");
  };

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative">
          <img src={preview} alt="Receipt preview" className="w-full h-48 object-cover rounded-lg border" />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={removeImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*,application/pdf"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />

          <Button
            type="button"
            variant="outline"
            className="h-32 flex flex-col gap-2"
            onClick={() => cameraInputRef.current?.click()}
            disabled={uploading}
          >
            <Camera className="h-8 w-8" />
            <span>Take Photo</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            className="h-32 flex flex-col gap-2"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Upload className="h-8 w-8" />
            <span>Upload File</span>
          </Button>
        </div>
      )}

      {uploading && (
        <div className="text-center text-sm text-muted-foreground">
          Uploading receipt...
        </div>
      )}
    </div>
  );
};

export default ReceiptUpload;
