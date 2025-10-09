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
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('receipts')
        .getPublicUrl(filePath);

      setPreview(publicUrl);
      onUploadSuccess(publicUrl);
      toast.success("Receipt uploaded successfully!");
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Failed to upload receipt");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
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
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
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
