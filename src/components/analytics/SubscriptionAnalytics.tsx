import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface SubscriptionAnalyticsProps {
  subscriptions: any[];
  formatAmount: (amount: number) => string;
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export function SubscriptionAnalytics({ subscriptions, formatAmount }: SubscriptionAnalyticsProps) {
  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active');
  const totalMonthly = activeSubscriptions.reduce((sum, sub) => {
    const amount = Number(sub.amount);
    if (sub.billing_cycle === 'yearly') {
      return sum + (amount / 12);
    }
    return sum + amount;
  }, 0);

  const chartData = activeSubscriptions.map(sub => ({
    name: sub.name,
    value: Number(sub.amount),
  }));

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle>Subscription Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">Monthly Total</p>
          <p className="text-2xl font-bold">{formatAmount(totalMonthly)}</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="hsl(var(--primary))"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
