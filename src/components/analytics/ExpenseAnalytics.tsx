import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ExpenseAnalyticsProps {
  expenses: any[];
  formatAmount: (amount: number) => string;
}

export function ExpenseAnalytics({ expenses, formatAmount }: ExpenseAnalyticsProps) {
  const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  
  const categoryData = expenses.reduce((acc: any, exp) => {
    const category = exp.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += Number(exp.amount);
    return acc;
  }, {});

  const chartData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    amount: value,
  }));

  return (
    <Card className="glass-strong hover-lift border-border/50">
      <CardHeader>
        <CardTitle className="font-display text-xl">Expense Analytics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 rounded-lg bg-background/40 backdrop-blur">
          <p className="text-sm text-muted-foreground mb-1">Total Expenses</p>
          <p className="text-3xl font-bold font-display gradient-text animate-count-up">{formatAmount(totalExpenses)}</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            />
            <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
