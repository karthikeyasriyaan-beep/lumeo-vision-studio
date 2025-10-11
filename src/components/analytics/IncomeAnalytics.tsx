import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface IncomeAnalyticsProps {
  income: any[];
  formatAmount: (amount: number) => string;
}

export function IncomeAnalytics({ income, formatAmount }: IncomeAnalyticsProps) {
  const totalIncome = income.reduce((sum, inc) => sum + Number(inc.amount), 0);
  
  const monthlyData = income.reduce((acc: any, inc) => {
    const date = new Date(inc.date);
    const month = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    if (!acc[month]) {
      acc[month] = 0;
    }
    acc[month] += Number(inc.amount);
    return acc;
  }, {});

  const chartData = Object.entries(monthlyData).map(([name, value]) => ({
    name,
    amount: value,
  }));

  return (
    <Card className="glass-strong hover-lift border-border/50">
      <CardHeader>
        <CardTitle className="font-display text-xl">Income Analytics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 rounded-lg bg-background/40 backdrop-blur">
          <p className="text-sm text-muted-foreground mb-1">Total Income</p>
          <p className="text-3xl font-bold font-display gradient-text animate-count-up">{formatAmount(totalIncome)}</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
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
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="hsl(var(--chart-2))" 
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--chart-2))', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
