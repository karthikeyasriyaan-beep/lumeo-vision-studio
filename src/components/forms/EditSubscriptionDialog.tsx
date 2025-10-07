import { Dialog, DialogContent } from '@/components/ui/dialog';

export default function EditSubscriptionDialog({ subscription, open, onOpenChange, onSuccess }: any) {
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent>Edit Subscription (Coming Soon)</DialogContent></Dialog>;
}
