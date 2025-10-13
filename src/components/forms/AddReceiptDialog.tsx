import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

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

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [merchant, setMerchant] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setOtherFile(e.target.files[0]);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = (e: React.DragEvent, type: "image" | "file") => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (type === "image" && file.type.startsWith("image/")) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setOtherFile(file);
    }
  };

  const handleUpload = async (file: File) => {
    if (!user) return null;
    const filePath = `${user.id}/${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage.from("receipts").upload(filePath, file);
    if (error) throw error;
    const { data: urlData } = supabase.storage.from("receipts").getPublicUrl(filePath);
    return urlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Not signed in", description: "Please log in first.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const imageUrl = imageFile ? await handleUpload(imageFile) : null;
      const fileUrl = otherFile ? await handleUpload(otherFile) : null;

      const { error } = await supabase.from("receipts").insert({
        user_id: user.id,
        name: name || "Untitled Receipt",
        amount: amount ? Number(amount) : 0,
        merchant: merchant || "Unknown",
        category: category || "General",
        date: date || new Date().toISOString().split("T")[0],
        image_url: imageUrl || fileUrl || null,
      });

      if (error) throw error;

      toast({ title: "Receipt Added", description: "Your receipt has been saved." });
      setOpen(false);
      onSuccess();
      setImageFile(null);
      setOtherFile(null);
      setImagePreview(null);
      setName("");
      setAmount("");
      setMerchant("");
      setCategory("");
      setDate("");
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to add receipt.", variant: "destructive" });
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
          {/* Text Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded-lg p-2"
            />
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border rounded-lg p-2"
            />
            <input
              placeholder="Merchant"
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              className="border rounded-lg p-2"
            />
            <input
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border rounded-lg p-2"
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border rounded-lg p-2"
            />
          </div>

          {/* File Uploads */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, "image")}
              onClick={() => imageInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-500 cursor-pointer bg-gray-50"
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
                <img src={imagePreview} alt="Preview" className="w-full h-48 object-contain rounded-lg" />
              ) : (
                <p className="text-gray-500 text-center">📷 Drag, drop, or tap to take a photo</p>
              )}
            </div>

            <div
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, "file")}
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-500 cursor-pointer bg-gray-50"
            >
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
              {otherFile ? (
                <p className="text-gray-700 text-center">{otherFile.name}</p>
              ) : (
                <p className="text-gray-500 text-center">📁 Drag & drop or click to upload a file</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Receipt"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
