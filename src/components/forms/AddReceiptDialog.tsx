import { useState } from 'react';
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

  // Image upload
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Other file upload
  const [otherFile, setOtherFile] = useState<File | null>(null);
  const [otherFileUrl, setOtherFileUrl] = useState<string | null>(null);

  // Handle image selection & preview
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

  // Upload to Supabase storage
  const handleUpload = async (file: File, folder: string) => {
    if (!user) return null;
    const fileName = `${user.id}/${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage.from(folder).upload(fileName, file);
    if (error) throw error;
    const { publicUrl, error: urlError } = supabase.storage.from(folder).getPublicUrl(data.path);
    if (urlError) throw urlError;
    return publicUrl;
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || (!imageFile && !otherFile)) return;

    setLoading(true);
    try {
      // Upload files if not already uploaded
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

      // Save to Supabase DB
      const { error } = await supabase.from('receipts').insert({
        user_id: user.id,
        image_url: uploadedImageUrl,
        file_url: uploadedOtherUrl,
        created_at: new Date().toISOString(),
      });

      if (error) throw error;

      toast({
        title: 'Receipt saved',
        description: 'Your receipt and file have been added successfully.',
      });

      // Reset all
      setImageFile(null);
      setImagePreview(null);
      setImageUrl(null);
      setOtherFile(null);
      setOtherFileUrl(null);
      setOpen(false);
      onSuccess();
    } catch (err) {
      console.error('Save error:', err);
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

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Receipt</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">Image Upload (Preview)</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full max-h-64 object-contain border rounded"
              />
            )}
          </div>

          {/* Other File Upload */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">Other File Upload</label>
            <input type="file" onChange={handleFileChange} />
            {otherFile && <p className="text-sm">{otherFile.name}</p>}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || (!imageFile && !otherFile)}
            >
              {loading ? 'Saving...' : 'Save Receipt'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
