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

interface AddLoanDialogProps {
  onSuccess?: () => void;
}

const loanStatuses = ["active", "paid_off", "defaulted"];

export function AddLoanDialog({ onSuccess }: AddLoanDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    initial_amount: "",
    current_balance: "",
    interest_rate: "",
    monthly_payment: "",
    start_date: new Date().toISOString().split('T')[0],
    end_date: "",
    status: "active",
    notes: ""
  });
  
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('loans')
        .insert({
          user_id: user.id,
          name: formData.name,
          initial_amount: parseFloat(formData.initial_amount),
          current_balance: parseFloat(formData.current_balance || formData.initial_amount),
          interest_rate: parseFloat(formData.interest_rate),
          monthly_payment: parseFloat(formData.monthly_payment),
          start_date: formData.start_date,
          end_date: formData.end_date,
          status: formData.status,
          notes: formData.notes
        });

      if (error) throw error;

      toast({
        title: "Loan added successfully",
        description: `${formData.name} has been added to your loans.`,
      });

      setFormData({
        name: "",
        initial_amount: "",
        current_balance: "",
        interest_rate: "",
        monthly_payment: "",
        start_date: new Date().toISOString().split('T')[0],
        end_date: "",
        status: "active",
        notes: ""
      });
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error adding loan:', error);
      toast({
        title: "Error adding loan",
        description: "There was an error adding your loan. Please try again.",
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
          Add Loan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Loan</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Loan Name</Label>
            <Input
              id="name"
              placeholder="e.g., Car Loan, Student Loan"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="initial_amount">Initial Amount</Label>
              <Input
                id="initial_amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.initial_amount}
                onChange={(e) => setFormData({ ...formData, initial_amount: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="current_balance">Current Balance</Label>
              <Input
                id="current_balance"
                type="number"
                step="0.01"
                placeholder="Same as initial"
                value={formData.current_balance}
                onChange={(e) => setFormData({ ...formData, current_balance: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="interest_rate">Interest Rate (%)</Label>
              <Input
                id="interest_rate"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.interest_rate}
                onChange={(e) => setFormData({ ...formData, interest_rate: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthly_payment">Monthly Payment</Label>
              <Input
                id="monthly_payment"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.monthly_payment}
                onChange={(e) => setFormData({ ...formData, monthly_payment: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {loanStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Loan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
