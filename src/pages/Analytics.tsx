import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import BackgroundBlobs from "@/components/BackgroundBlobs";
import { BarChart3, PieChart, TrendingUp } from "lucide-react";

export default function Analytics() {
  const { user } = useAuth();

  // Fetch all data for comprehensive analytics
  const { data: income = [] } = useQuery({
    queryKey: ['income', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase.from('income').select('*').eq('user_id', user.id);
      return data || [];
    },
    enabled: !!user
  });

  const { data: expenses = [] } = useQuery({
    queryKey: ['expenses', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase.from('expenses').select('*').eq('user_id', user.id);
      return data || [];
    },
    enabled: !!user
  });

  const { data: subscriptions = [] } = useQuery({
    queryKey: ['subscriptions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase.from('subscriptions').select('*').eq('user_id', user.id);
      return data || [];
    },
    enabled: !!user
  });

  const { data: loans = [] } = useQuery({
    queryKey: ['loans', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase.from('loans').select('*').eq('user_id', user.id);
      return data || [];
    },
    enabled: !!user
  });

  const { data: savings = [] } = useQuery({
    queryKey: ['savings', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase.from('savings').select('*').eq('user_id', user.id);
      return data || [];
    },
    enabled: !!user
  });

  const { data: receipts = [] } = useQuery({
    queryKey: ['receipts', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase.from('receipts').select('*').eq('user_id', user.id);
      return data || [];
    },
    enabled: !!user
  });

  // Calculate category breakdowns
  const expensesByCategory = expenses.reduce((acc, expense) => {
    const category = expense.category || 'Uncategorized';
    acc[category] = (acc[category] || 0) + Number(expense.amount);
    return acc;
  }, {} as Record<string, number>);

  const incomeByCategory = income.reduce((acc, item) => {
    const category = item.category || 'Uncategorized';
    acc[category] = (acc[category] || 0) + Number(item.amount);
    return acc;
  }, {} as Record<string, number>);

  return (
    <DashboardLayout>
      <div className="relative space-y-6 animate-slide-up">
        <BackgroundBlobs />

        <div>
          <h1 className="text-3xl font-bold gradient-text">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive insights into your financial data
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="glass hover-glow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{income.length + expenses.length}</div>
              <p className="text-xs text-muted-foreground">
                {income.length} income, {expenses.length} expenses
              </p>
            </CardContent>
          </Card>

          <Card className="glass hover-glow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Features</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {[subscriptions, loans, savings, receipts].filter(arr => arr.length > 0).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Out of 4 feature categories
              </p>
            </CardContent>
          </Card>

          <Card className="glass hover-glow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Data Points</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {income.length + expenses.length + subscriptions.length + loans.length + savings.length + receipts.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Total records tracked
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Category Breakdowns */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Expenses by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(expensesByCategory).map(([category, amount]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{category}</span>
                    <span className="text-sm text-muted-foreground">
                      ${Number(amount).toFixed(2)}
                    </span>
                  </div>
                ))}
                {Object.keys(expensesByCategory).length === 0 && (
                  <p className="text-sm text-muted-foreground">No expense data yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle>Income by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(incomeByCategory).map(([category, amount]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{category}</span>
                    <span className="text-sm text-muted-foreground">
                      ${Number(amount).toFixed(2)}
                    </span>
                  </div>
                ))}
                {Object.keys(incomeByCategory).length === 0 && (
                  <p className="text-sm text-muted-foreground">No income data yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Usage */}
        <Card className="glass">
          <CardHeader>
            <CardTitle>Feature Usage Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-1">
                <p className="text-sm font-medium">Subscriptions</p>
                <p className="text-2xl font-bold">{subscriptions.length}</p>
                <p className="text-xs text-muted-foreground">
                  {subscriptions.filter(s => s.status === 'active').length} active
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Loans & Debts</p>
                <p className="text-2xl font-bold">{loans.length}</p>
                <p className="text-xs text-muted-foreground">
                  {loans.filter(l => l.status === 'active').length} active
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Savings Goals</p>
                <p className="text-2xl font-bold">{savings.length}</p>
                <p className="text-xs text-muted-foreground">
                  {savings.filter(s => Number(s.current_amount) < Number(s.target_amount)).length} in progress
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Receipts</p>
                <p className="text-2xl font-bold">{receipts.length}</p>
                <p className="text-xs text-muted-foreground">Total uploaded</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Income Entries</p>
                <p className="text-2xl font-bold">{income.length}</p>
                <p className="text-xs text-muted-foreground">Recorded</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Expense Entries</p>
                <p className="text-2xl font-bold">{expenses.length}</p>
                <p className="text-xs text-muted-foreground">Recorded</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
