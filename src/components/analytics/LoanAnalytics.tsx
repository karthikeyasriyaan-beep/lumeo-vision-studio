import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface LoanAnalyticsProps {
  loans: any[];
  formatAmount: (amount: number) => string;
}

export function LoanAnalytics({ loans, formatAmount }: LoanAnalyticsProps) {
  const activeLoans = loans.filter(loan => loan.status === 'active');
  const totalDebt = activeLoans.reduce((sum, loan) => sum + Number(loan.current_balance), 0);
  const totalInitial = activeLoans.reduce((sum, loan) => sum + Number(loan.initial_amount), 0);
  const totalPaid = totalInitial - totalDebt;
  const progressPercent = totalInitial > 0 ? (totalPaid / totalInitial) * 100 : 0;

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle>Loan Analytics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Total Debt Remaining</p>
          <p className="text-2xl font-bold">{formatAmount(totalDebt)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-2">Overall Progress</p>
          <Progress value={progressPercent} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">{progressPercent.toFixed(1)}% paid</p>
        </div>
        <div className="space-y-2">
          {activeLoans.map(loan => {
            const progress = ((Number(loan.initial_amount) - Number(loan.current_balance)) / Number(loan.initial_amount)) * 100;
            return (
              <div key={loan.id} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{loan.name}</span>
                  <span className="text-muted-foreground">{formatAmount(Number(loan.current_balance))}</span>
                </div>
                <Progress value={progress} className="h-1" />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
