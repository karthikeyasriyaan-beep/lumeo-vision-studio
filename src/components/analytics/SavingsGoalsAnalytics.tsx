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
    <Card className="glass">
      <CardHeader>
        <CardTitle>Savings & Goals Analytics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Total Saved</p>
          <p className="text-2xl font-bold">{formatAmount(totalSaved)}</p>
          <p className="text-xs text-muted-foreground">of {formatAmount(totalTarget)} target</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-2">Overall Progress</p>
          <Progress value={overallProgress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">{overallProgress.toFixed(1)}% complete</p>
        </div>
        <div className="space-y-3">
          {allGoals.map(goal => {
            const progress = ((Number(goal.current_amount) || 0) / (Number(goal.target_amount) || 1)) * 100;
            return (
              <div key={goal.id} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{goal.name}</span>
                  <span className="text-muted-foreground">
                    {formatAmount(Number(goal.current_amount || 0))} / {formatAmount(Number(goal.target_amount))}
                  </span>
                </div>
                <Progress value={Math.min(progress, 100)} className="h-1" />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
