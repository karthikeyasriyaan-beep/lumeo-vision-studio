import { Dialog, DialogContent } from '@/components/ui/dialog';

export default function EditIncomeDialog({ income, open, onOpenChange, onSuccess }: any) {
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent>Edit Income (Coming Soon)</DialogContent></Dialog>;
}
