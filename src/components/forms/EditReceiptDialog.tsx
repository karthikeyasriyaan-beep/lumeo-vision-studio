import { Dialog, DialogContent } from '@/components/ui/dialog';

export default function EditReceiptDialog({ receipt, open, onOpenChange, onSuccess }: any) {
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent>Edit Receipt (Coming Soon)</DialogContent></Dialog>;
}
