import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ReceiptAnalyticsProps {
  receipts: any[];
  formatAmount: (amount: number) => string;
}

export function ReceiptAnalytics({ receipts, formatAmount }: ReceiptAnalyticsProps) {
  const totalReceipts = receipts.length;
  const totalAmount = receipts.reduce((sum, receipt) => sum + Number(receipt.amount), 0);
  const avgAmount = totalReceipts > 0 ? totalAmount / totalReceipts : 0;

  const categoryBreakdown = receipts.reduce((acc: any, receipt) => {
    const category = receipt.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = { count: 0, total: 0 };
    }
    acc[category].count += 1;
    acc[category].total += Number(receipt.amount);
    return acc;
  }, {});

  return (
    <Card className="glass-strong hover-lift border-border/50">
      <CardHeader>
        <CardTitle className="font-display text-xl">Receipts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 rounded-lg bg-background/40 backdrop-blur space-y-1">
            <p className="text-xs text-muted-foreground uppercase">Total</p>
            <p className="text-2xl font-bold font-display">{totalReceipts}</p>
          </div>
          <div className="p-3 rounded-lg bg-background/40 backdrop-blur space-y-1">
            <p className="text-xs text-muted-foreground uppercase">Amount</p>
            <p className="text-2xl font-bold font-display">{formatAmount(totalAmount)}</p>
          </div>
          <div className="p-3 rounded-lg bg-background/40 backdrop-blur space-y-1">
            <p className="text-xs text-muted-foreground uppercase">Average</p>
            <p className="text-2xl font-bold font-display">{formatAmount(avgAmount)}</p>
          </div>
        </div>

        <div className="space-y-3 mt-6">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">By Category</h4>
          {Object.entries(categoryBreakdown).map(([category, data]: [string, any]) => (
            <div key={category} className="flex justify-between items-center p-3 rounded-lg bg-background/20 hover-lift">
              <span className="text-sm font-medium">{category}</span>
              <div className="text-right">
                <p className="text-sm font-bold">{formatAmount(data.total)}</p>
                <p className="text-xs text-muted-foreground">{data.count} receipts</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
