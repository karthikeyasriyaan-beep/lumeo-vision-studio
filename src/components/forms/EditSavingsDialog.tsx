import { Dialog, DialogContent } from '@/components/ui/dialog';

export default function EditSavingsDialog({ saving, open, onOpenChange, onSuccess }: any) {
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent>Edit Savings Goal (Coming Soon)</DialogContent></Dialog>;
}
