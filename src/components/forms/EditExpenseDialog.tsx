import { Dialog, DialogContent } from '@/components/ui/dialog';

export default function EditExpenseDialog({ expense, open, onOpenChange, onSuccess }: any) {
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent>Edit Expense (Coming Soon)</DialogContent></Dialog>;
}
