import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AddSubscriptionDialogProps {
  onSuccess?: () => void;
}

const subscriptionCategories = [
  "Entertainment",
  "Music",
  "Software",
  "Shopping",
  "Development",
  "Health",
  "Education",
  "Business",
  "Gaming",
  "Other"
];

const billingCycles = [
  "Monthly",
  "Yearly",
  "Weekly",
  "Quarterly"
];

export function AddSubscriptionDialog({ onSuccess }: AddSubscriptionDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    category: "",
    description: "",
    billing_cycle: "",
    next_billing_date: ""
  });
  
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          name: formData.name,
          amount: parseFloat(formData.amount),
          category: formData.category,
          description: formData.description,
          billing_cycle: formData.billing_cycle,
          next_billing_date: formData.next_billing_date,
          status: 'active'
        });

      if (error) throw error;

      toast({
        title: "Subscription added successfully",
        description: `${formData.name} has been added to your subscriptions.`,
      });

      setFormData({
        name: "",
        amount: "",
        category: "",
        description: "",
        billing_cycle: "",
        next_billing_date: ""
      });
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error adding subscription:', error);
      toast({
        title: "Error adding subscription",
        description: "There was an error adding your subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90 gap-2">
          <Plus className="h-4 w-4" />
          Add Subscription
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Subscription</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Service Name</Label>
            <Select value={formData.name} onValueChange={(value) => setFormData({ ...formData, name: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Netflix">Netflix</SelectItem>
                <SelectItem value="Spotify">Spotify</SelectItem>
                <SelectItem value="Amazon Prime">Amazon Prime</SelectItem>
                <SelectItem value="Disney+">Disney+</SelectItem>
                <SelectItem value="Apple Music">Apple Music</SelectItem>
                <SelectItem value="YouTube Premium">YouTube Premium</SelectItem>
                <SelectItem value="Adobe Creative Cloud">Adobe Creative Cloud</SelectItem>
                <SelectItem value="Microsoft 365">Microsoft 365</SelectItem>
                <SelectItem value="Dropbox">Dropbox</SelectItem>
                <SelectItem value="Gym Membership">Gym Membership</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="billing_cycle">Billing Cycle</Label>
              <Select value={formData.billing_cycle} onValueChange={(value) => setFormData({ ...formData, billing_cycle: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select cycle" />
                </SelectTrigger>
                <SelectContent>
                  {billingCycles.map((cycle) => (
                    <SelectItem key={cycle} value={cycle}>
                      {cycle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="next_billing_date">Next Billing Date</Label>
            <Input
              id="next_billing_date"
              type="date"
              value={formData.next_billing_date}
              onChange={(e) => setFormData({ ...formData, next_billing_date: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add any additional notes..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Subscription"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}