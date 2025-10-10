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
    <Card className="glass">
      <CardHeader>
        <CardTitle>Income Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">Total Income</p>
          <p className="text-2xl font-bold">{formatAmount(totalIncome)}</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Line type="monotone" dataKey="amount" stroke="hsl(var(--chart-2))" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
