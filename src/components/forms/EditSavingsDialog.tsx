import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Trash2, Plus } from 'lucide-react';

export default function EditSavingsDialog({ saving, open, onOpenChange, onSuccess }: any) {
  const [loading, setLoading] = useState(false);
  const [showProgressUpdate, setShowProgressUpdate] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [formData, setFormData] = useState({
    name: saving?.name || '',
    target_amount: saving?.target_amount || '',
    current_amount: saving?.current_amount || '',
    deadline: saving?.deadline || '',
    category: saving?.category || '',
    notes: saving?.notes || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('savings')
        .update({
          name: formData.name,
          target_amount: parseFloat(formData.target_amount),
          current_amount: parseFloat(formData.current_amount),
          deadline: formData.deadline || null,
          category: formData.category,
          notes: formData.notes
        })
        .eq('id', saving.id);

      if (error) throw error;

      toast.success('Savings goal updated successfully');
      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update savings goal');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProgress = async () => {
    if (!addAmount || parseFloat(addAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const newAmount = parseFloat(formData.current_amount) + parseFloat(addAmount);
      
      const { error } = await supabase
        .from('savings')
        .update({ current_amount: newAmount })
        .eq('id', saving.id);

      if (error) throw error;

      toast.success('Progress added successfully');
      setFormData({ ...formData, current_amount: newAmount.toString() });
      setAddAmount('');
      setShowProgressUpdate(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add progress');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this savings goal?')) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('savings')
        .delete()
        .eq('id', saving.id);

      if (error) throw error;

      toast.success('Savings goal deleted successfully');
      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete savings goal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Savings Goal</DialogTitle>
        </DialogHeader>
        
        {!showProgressUpdate ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Goal Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="target_amount">Target Amount</Label>
                <Input
                  id="target_amount"
                  type="number"
                  step="0.01"
                  value={formData.target_amount}
                  onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="current_amount">Current Amount</Label>
                <Input
                  id="current_amount"
                  type="number"
                  step="0.01"
                  value={formData.current_amount}
                  onChange={(e) => setFormData({ ...formData, current_amount: e.target.value })}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deadline">Target Date (Optional)</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category (Optional)</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
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
                Add Progress
              </Button>
              <Button type="button" variant="destructive" onClick={handleDelete} disabled={loading}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="add">Amount to Add</Label>
              <Input
                id="add"
                type="number"
                step="0.01"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                placeholder="Enter amount to add"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Current: {formData.current_amount} / Target: {formData.target_amount}
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddProgress} disabled={loading} className="flex-1">
                {loading ? 'Adding...' : 'Add Progress'}
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
