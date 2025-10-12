import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface AddReceiptDialogProps {
  onSuccess: () => void;
}

export function AddReceiptDialog({ onSuccess }: AddReceiptDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Image state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Other file state
  const [otherFile, setOtherFile] = useState<File | null>(null);
  const [otherFileUrl, setOtherFileUrl] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Image Selection or Camera Capture
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Handle other file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setOtherFile(e.target.files[0]);
  };

  // Drag-and-drop handlers
  const handleDragOver = (e: React.DragEvent, type: 'image' | 'file') => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, type: 'image' | 'file') => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (type === 'image' && file.type.startsWith('image/')) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else if (type === 'file') {
      setOtherFile(file);
    }
  };

  // Upload to Supabase
  const handleUpload = async (file: File, folder: string) => {
    if (!user) return null;
    const fileName = `${user.id}/${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage.from(folder).upload(fileName, file);
    if (error) throw error;
    const { publicUrl, error: urlError } = supabase.storage.from(folder).getPublicUrl(data.path);
    if (urlError) throw urlError;
    return publicUrl;
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || (!imageFile && !otherFile)) return;

    setLoading(true);
    try {
      let uploadedImageUrl = imageUrl;
      let uploadedOtherUrl = otherFileUrl;

      if (imageFile && !imageUrl) {
        uploadedImageUrl = await handleUpload(imageFile, 'receipts');
        setImageUrl(uploadedImageUrl);
      }

      if (otherFile && !otherFileUrl) {
        uploadedOtherUrl = await handleUpload(otherFile, 'receipts');
        setOtherFileUrl(uploadedOtherUrl);
      }

      const { error } = await supabase.from('receipts').insert({
        user_id: user.id,
        image_url: uploadedImageUrl,
        file_url: uploadedOtherUrl,
        created_at: new Date().toISOString(),
      });

      if (error) throw error;

      toast({
        title: 'Receipt saved',
        description: 'Your receipt has been added successfully.',
      });

      // Reset
      setImageFile(null);
      setImagePreview(null);
      setImageUrl(null);
      setOtherFile(null);
      setOtherFileUrl(null);
      setOpen(false);
      onSuccess();
    } catch (err) {
      console.error(err);
      toast({
        title: 'Error',
        description: 'Failed to save receipt. Try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Receipt
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Upload Receipt</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Image Upload Card */}
            <div
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-gray-400 transition cursor-pointer"
              onDragOver={(e) => handleDragOver(e, 'image')}
              onDrop={(e) => handleDrop(e, 'image')}
              onClick={() => imageInputRef.current?.click()}
            >
              <label className="font-medium mb-2">Image Upload (Camera)</label>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                ref={imageInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-contain mt-2 border rounded"
                />
              ) : (
                <p className="text-gray-400">Drag & drop or click to capture</p>
              )}
            </div>

            {/* Other File Upload Card */}
            <div
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-gray-400 transition cursor-pointer"
              onDragOver={(e) => handleDragOver(e, 'file')}
              onDrop={(e) => handleDrop(e, 'file')}
              onClick={() => fileInputRef.current?.click()}
            >
              <label className="font-medium mb-2">Other File Upload</label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              {otherFile ? (
                <p className="text-sm mt-2">{otherFile.name}</p>
              ) : (
                <p className="text-gray-400">Drag & drop or click to upload</p>
              )}
            </div>

          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || (!imageFile && !otherFile)}>
              {loading ? 'Saving...' : 'Save Receipt'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
