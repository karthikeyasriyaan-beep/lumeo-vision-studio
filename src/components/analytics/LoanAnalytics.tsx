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
    <Card className="glass-strong hover-lift border-border/50">
      <CardHeader>
        <CardTitle className="font-display text-xl">Loans & Debts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 rounded-lg bg-background/40 backdrop-blur space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Debt</span>
            <span className="font-bold text-lg">{formatAmount(totalDebt)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Paid</span>
            <span className="font-bold text-lg text-chart-2">{formatAmount(totalPaid)}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Overall Progress</span>
            <span className="font-bold">{progressPercent.toFixed(1)}%</span>
          </div>
          <Progress value={progressPercent} className="h-3" />
        </div>

        <div className="space-y-4 mt-6">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Individual Loans</h4>
          {activeLoans.map((loan) => {
            const loanProgress = ((Number(loan.initial_amount) - Number(loan.current_balance)) / Number(loan.initial_amount)) * 100;
            return (
              <div key={loan.id} className="space-y-2 p-3 rounded-lg bg-background/20">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{loan.name}</span>
                  <span className="font-bold">{loanProgress.toFixed(1)}%</span>
                </div>
                <Progress value={loanProgress} className="h-2" />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
