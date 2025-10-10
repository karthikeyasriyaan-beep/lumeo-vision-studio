import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Trash2, Plus } from 'lucide-react';

export default function EditLoanDialog({ loan, open, onOpenChange, onSuccess }: any) {
  const [loading, setLoading] = useState(false);
  const [showProgressUpdate, setShowProgressUpdate] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [formData, setFormData] = useState({
    name: loan?.name || '',
    initial_amount: loan?.initial_amount || '',
    current_balance: loan?.current_balance || '',
    interest_rate: loan?.interest_rate || '',
    monthly_payment: loan?.monthly_payment || '',
    start_date: loan?.start_date || new Date().toISOString().split('T')[0],
    end_date: loan?.end_date || '',
    notes: loan?.notes || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('loans')
        .update({
          name: formData.name,
          initial_amount: parseFloat(formData.initial_amount),
          current_balance: parseFloat(formData.current_balance),
          interest_rate: formData.interest_rate ? parseFloat(formData.interest_rate) : null,
          monthly_payment: formData.monthly_payment ? parseFloat(formData.monthly_payment) : null,
          start_date: formData.start_date,
          end_date: formData.end_date || null,
          notes: formData.notes
        })
        .eq('id', loan.id);

      if (error) throw error;

      toast.success('Loan updated successfully');
      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update loan');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPayment = async () => {
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      toast.error('Please enter a valid payment amount');
      return;
    }

    setLoading(true);
    try {
      const newBalance = Math.max(0, parseFloat(formData.current_balance) - parseFloat(paymentAmount));
      
      const { error } = await supabase
        .from('loans')
        .update({ current_balance: newBalance })
        .eq('id', loan.id);

      if (error) throw error;

      toast.success('Payment added successfully');
      setFormData({ ...formData, current_balance: newBalance.toString() });
      setPaymentAmount('');
      setShowProgressUpdate(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add payment');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this loan?')) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('loans')
        .delete()
        .eq('id', loan.id);

      if (error) throw error;

      toast.success('Loan deleted successfully');
      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete loan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Loan</DialogTitle>
        </DialogHeader>
        
        {!showProgressUpdate ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Loan Name</Label>
              <Input
                id="name"
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
                  value={formData.current_balance}
                  onChange={(e) => setFormData({ ...formData, current_balance: e.target.value })}
                  required
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
                  value={formData.interest_rate}
                  onChange={(e) => setFormData({ ...formData, interest_rate: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="monthly_payment">Monthly Payment</Label>
                <Input
                  id="monthly_payment"
                  type="number"
                  step="0.01"
                  value={formData.monthly_payment}
                  onChange={(e) => setFormData({ ...formData, monthly_payment: e.target.value })}
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
                <Label htmlFor="end_date">End Date (Optional)</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>
            
            <div className="flex gap-2">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowProgressUpdate(true)} disabled={loading}>
                <Plus className="h-4 w-4 mr-1" />
                Add Payment
              </Button>
              <Button type="button" variant="destructive" onClick={handleDelete} disabled={loading}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="payment">Payment Amount</Label>
              <Input
                id="payment"
                type="number"
                step="0.01"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="Enter payment amount"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Current balance: {formData.current_balance}
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddPayment} disabled={loading} className="flex-1">
                {loading ? 'Adding...' : 'Add Payment'}
              </Button>
              <Button variant="outline" onClick={() => setShowProgressUpdate(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
