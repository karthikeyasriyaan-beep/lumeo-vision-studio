import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AddExpenseDialogProps {
  onSuccess?: () => void;
}

// Common selectable titles
const expenseTitles = [
  "Groceries",
  "Rent",
  "Utilities",
  "Fuel",
  "Subscription",
  "Dining Out",
  "Shopping",
  "Medical",
  "Education",
  "Travel",
  "Other",
];

export function AddExpenseDialog({ onSuccess }: AddExpenseDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customTitle, setCustomTitle] = useState("");
  const [useCustomTitle, setUseCustomTitle] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    notes: "",
    date: new Date().toISOString().split("T")[0],
  });

  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const titleToUse = useCustomTitle ? customTitle : formData.name;

      const { error } = await supabase.from("expenses").insert({
        user_id: user.id,
        name: titleToUse,
        category: titleToUse,
        amount: parseFloat(formData.amount),
        notes: formData.notes,
        date: formData.date,
      });

      if (error) throw error;

      toast({
        title: "Expense added successfully",
        description: `${titleToUse} has been added to your expense records.`,
      });

      setFormData({
        name: "",
        amount: "",
        notes: "",
        date: new Date().toISOString().split("T")[0],
      });
      setCustomTitle("");
      setUseCustomTitle(false);
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error adding expense:", error);
      toast({
        title: "Error adding expense",
        description:
          "There was an error adding your expense. Please try again.",
        variant: "destructive",
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
          Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title Field */}
          <div className="space-y-2">
            <Label>Title</Label>
            {!useCustomTitle ? (
              <Select
                onValueChange={(value) => {
                  if (value === "custom") {
                    setUseCustomTitle(true);
                    setFormData({ ...formData, name: "" });
                  } else {
                    setFormData({ ...formData, name: value });
                  }
                }}
                value={formData.name || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a title" />
                </SelectTrigger>
                <SelectContent>
                  {expenseTitles.map((title) => (
                    <SelectItem key={title} value={title}>
                      {title}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">+ Custom Title</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter custom title"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setUseCustomTitle(false);
                    setCustomTitle("");
                  }}
                >
                  Back
                </Button>
              </div>
            )}
          </div>

          {/* Amount & Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes..."
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Expense"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
