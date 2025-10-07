import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export function AddLoanDialog({ onSuccess }: { onSuccess: () => void }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const initialAmount = parseFloat(formData.get('initial_amount') as string);

    const { error } = await supabase.from('loans').insert({
      user_id: user.id,
      name: formData.get('name') as string,
      initial_amount: initialAmount,
      current_balance: initialAmount,
      interest_rate: parseFloat(formData.get('interest_rate') as string) || null,
      monthly_payment: parseFloat(formData.get('monthly_payment') as string) || null,
      start_date: formData.get('start_date') as string,
      end_date: formData.get('end_date') as string || null,
      notes: formData.get('notes') as string,
    });

    setLoading(false);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Loan added successfully' });
      setOpen(false);
      onSuccess();
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Loan/Debt</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required />
          </div>
          <div>
            <Label htmlFor="initial_amount">Initial Amount</Label>
            <Input id="initial_amount" name="initial_amount" type="number" step="0.01" required />
          </div>
          <div>
            <Label htmlFor="interest_rate">Interest Rate (%)</Label>
            <Input id="interest_rate" name="interest_rate" type="number" step="0.01" />
          </div>
          <div>
            <Label htmlFor="monthly_payment">Monthly Payment</Label>
            <Input id="monthly_payment" name="monthly_payment" type="number" step="0.01" />
          </div>
          <div>
            <Label htmlFor="start_date">Start Date</Label>
            <Input id="start_date" name="start_date" type="date" required />
          </div>
          <div>
            <Label htmlFor="end_date">End Date</Label>
            <Input id="end_date" name="end_date" type="date" />
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Input id="notes" name="notes" />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Loan'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
