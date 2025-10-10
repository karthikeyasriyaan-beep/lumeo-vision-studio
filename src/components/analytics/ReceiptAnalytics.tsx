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
    <Card className="glass">
      <CardHeader>
        <CardTitle>Receipt Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Receipts</p>
            <p className="text-2xl font-bold">{totalReceipts}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="text-2xl font-bold">{formatAmount(totalAmount)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Average</p>
            <p className="text-2xl font-bold">{formatAmount(avgAmount)}</p>
          </div>
        </div>
        <div className="space-y-2">
          {Object.entries(categoryBreakdown).map(([category, data]: [string, any]) => (
            <div key={category} className="flex justify-between items-center p-2 rounded-lg bg-secondary/50">
              <span className="text-sm font-medium">{category}</span>
              <div className="text-right">
                <p className="text-sm font-semibold">{formatAmount(data.total)}</p>
                <p className="text-xs text-muted-foreground">{data.count} receipts</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
