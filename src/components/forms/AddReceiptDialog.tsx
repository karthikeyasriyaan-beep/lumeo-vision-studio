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

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [otherFile, setOtherFile] = useState<File | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setOtherFile(e.target.files[0]);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
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

  const handleUpload = async (file: File, folder: string) => {
    if (!user) return null;
    const fileName = `${user.id}/${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage.from(folder).upload(fileName, file);
    if (error) throw error;
    const { publicUrl } = supabase.storage.from(folder).getPublicUrl(data.path);
    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || (!imageFile && !otherFile)) return;

    setLoading(true);
    try {
      const uploadedImage = imageFile ? await handleUpload(imageFile, 'receipts') : null;
      const uploadedFile = otherFile ? await handleUpload(otherFile, 'receipts') : null;

      const { error } = await supabase.from('receipts').insert({
        user_id: user.id,
        image_url: uploadedImage,
        file_url: uploadedFile,
        created_at: new Date().toISOString(),
      });

      if (error) throw error;

      toast({
        title: 'Receipt saved',
        description: 'Your receipt has been added successfully.',
      });

      setImageFile(null);
      setImagePreview(null);
      setOtherFile(null);
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

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Receipt</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Image Upload Card */}
            <div
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'image')}
              onClick={() => imageInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-500 transition cursor-pointer bg-gray-50"
            >
              <input
                type="file"
                accept="image/*"
                capture="environment"
                ref={imageInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-48 object-contain rounded-lg shadow-sm" />
              ) : (
                <p className="text-gray-500 text-center">📷 Drag, drop, or tap to take a photo</p>
              )}
            </div>

            {/* Other File Upload Card */}
            <div
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'file')}
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-500 transition cursor-pointer bg-gray-50"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              {otherFile ? (
                <p className="text-gray-700 text-center">{otherFile.name}</p>
              ) : (
                <p className="text-gray-500 text-center">📁 Drag & drop or click to upload a file</p>
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
