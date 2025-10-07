import { ReactNode, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export default function AddSavingsDialog({ children, onSuccess }: { children: ReactNode; onSuccess: () => void }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    const formData = new FormData(e.currentTarget);

    const { error } = await supabase.from('savings').insert({
      user_id: user.id,
      name: formData.get('name') as string,
      target_amount: parseFloat(formData.get('target_amount') as string),
      current_amount: parseFloat(formData.get('current_amount') as string) || 0,
      deadline: formData.get('deadline') as string || null,
      category: formData.get('category') as string,
      notes: formData.get('notes') as string,
    });

    setLoading(false);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Savings goal added successfully' });
      setOpen(false);
      onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Savings Goal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Goal Name</Label>
            <Input id="name" name="name" required />
          </div>
          <div>
            <Label htmlFor="target_amount">Target Amount</Label>
            <Input id="target_amount" name="target_amount" type="number" step="0.01" required />
          </div>
          <div>
            <Label htmlFor="current_amount">Current Amount</Label>
            <Input id="current_amount" name="current_amount" type="number" step="0.01" defaultValue="0" />
          </div>
          <div>
            <Label htmlFor="deadline">Deadline</Label>
            <Input id="deadline" name="deadline" type="date" />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Input id="category" name="category" />
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Input id="notes" name="notes" />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Goal'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
