import { Dialog, DialogContent } from '@/components/ui/dialog';

export default function EditLoanDialog({ loan, open, onOpenChange, onSuccess }: any) {
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent>Edit Loan (Coming Soon)</DialogContent></Dialog>;
}
