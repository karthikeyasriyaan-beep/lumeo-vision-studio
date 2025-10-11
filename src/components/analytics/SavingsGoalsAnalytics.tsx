import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface SavingsGoalsAnalyticsProps {
  savings: any[];
  goals: any[];
  formatAmount: (amount: number) => string;
}

export function SavingsGoalsAnalytics({ savings, goals, formatAmount }: SavingsGoalsAnalyticsProps) {
  const allGoals = [...savings, ...goals];
  const totalTarget = allGoals.reduce((sum, goal) => sum + Number(goal.target_amount || 0), 0);
  const totalSaved = allGoals.reduce((sum, goal) => sum + Number(goal.current_amount || 0), 0);
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  return (
    <Card className="glass-strong hover-lift border-border/50">
      <CardHeader>
        <CardTitle className="font-display text-xl">Savings & Goals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 rounded-lg bg-background/40 backdrop-blur space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Target</span>
            <span className="font-bold text-lg">{formatAmount(totalTarget)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Saved</span>
            <span className="font-bold text-lg text-chart-2">{formatAmount(totalSaved)}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Overall Progress</span>
            <span className="font-bold">{overallProgress.toFixed(1)}%</span>
          </div>
          <Progress value={overallProgress} className="h-3" />
        </div>

        <div className="space-y-4 mt-6">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Individual Goals</h4>
          {allGoals.map((goal) => {
            const progress = ((Number(goal.current_amount) || 0) / (Number(goal.target_amount) || 1)) * 100;
            return (
              <div key={goal.id} className="space-y-2 p-3 rounded-lg bg-background/20">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{goal.name}</span>
                  <span className="text-xs text-muted-foreground">{formatAmount(Number(goal.current_amount || 0))} / {formatAmount(Number(goal.target_amount))}</span>
                </div>
                <Progress value={Math.min(progress, 100)} className="h-2" />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
