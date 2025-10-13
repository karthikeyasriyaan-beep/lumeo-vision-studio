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

  /** Image Input Handler */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  /** File Input Handler */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setOtherFile(e.target.files[0]);
  };

  /** Drag & Drop Support */
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

  /** ✅ Corrected Upload Function */
  const handleUpload = async (file: File, folder: string) => {
    if (!user) throw new Error('User not logged in');
    const path = `${user.id}/${Date.now()}_${file.name}`;

    const { data, error } = await supabase.storage.from(folder).upload(path, file, {
      upsert: false,
      contentType: file.type,
    });

    if (error) throw error;

    // ✅ Fix: getPublicUrl returns { data: { publicUrl: string } }
    const { data: publicUrlData } = supabase.storage.from(folder).getPublicUrl(path);
    return publicUrlData.publicUrl;
  };

  /** ✅ Fixed Submit Logic */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: 'Login required',
        description: 'Please sign in to add a receipt.',
        variant: 'destructive',
      });
      return;
    }
    if (!imageFile && !otherFile) {
      toast({
        title: 'No file selected',
        description: 'Please upload an image or file.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const uploadedImage = imageFile ? await handleUpload(imageFile, 'receipts') : null;
      const uploadedFile = otherFile ? await handleUpload(otherFile, 'receipts') : null;

      const { error: insertError } = await supabase.from('receipts').insert([
        {
          user_id: user.id,
          name: 'Receipt',
          amount: 0,
          date: new Date().toISOString().split('T')[0],
          image_url: uploadedImage || uploadedFile,
          category: 'Other',
        },
      ]);

      if (insertError) throw insertError;

      toast({
        title: 'Receipt saved',
        description: 'Your receipt has been added successfully.',
      });

      // Reset State
      setImageFile(null);
      setImagePreview(null);
      setOtherFile(null);
      setOpen(false);
      onSuccess();
    } catch (err: any) {
      console.error('Upload/Insert error:', err.message);
      toast({
        title: 'Error',
        description: 'Failed to save receipt. Please try again.',
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
            {/* 📷 Image Upload */}
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
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-contain rounded-lg shadow-sm"
                />
              ) : (
                <p className="text-gray-500 text-center">
                  📷 Drag, drop, or tap to take a photo
                </p>
              )}
            </div>

            {/* 📁 File Upload */}
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
                <p className="text-gray-500 text-center">
                  📁 Drag & drop or click to upload a file
                </p>
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
