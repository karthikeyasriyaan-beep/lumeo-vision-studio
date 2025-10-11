import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useCurrency } from "@/components/currency-selector";
import BackgroundBlobs from "@/components/BackgroundBlobs";
import { ExpenseAnalytics } from "@/components/analytics/ExpenseAnalytics";
import { IncomeAnalytics } from "@/components/analytics/IncomeAnalytics";
import { SubscriptionAnalytics } from "@/components/analytics/SubscriptionAnalytics";
import { LoanAnalytics } from "@/components/analytics/LoanAnalytics";
import { ReceiptAnalytics } from "@/components/analytics/ReceiptAnalytics";
import { SavingsGoalsAnalytics } from "@/components/analytics/SavingsGoalsAnalytics";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Analytics() {
  const { user } = useAuth();
  const { formatAmount } = useCurrency();

  // Fetch all data
  const { data: expenses = [], isLoading: expensesLoading } = useQuery({
    queryKey: ['expenses', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
      return data || [];
    },
    enabled: !!user
  });

  const { data: income = [], isLoading: incomeLoading } = useQuery({
    queryKey: ['income', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('income')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
      return data || [];
    },
    enabled: !!user
  });

  const { data: subscriptions = [], isLoading: subsLoading } = useQuery({
    queryKey: ['subscriptions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id);
      return data || [];
    },
    enabled: !!user
  });

  const { data: loans = [], isLoading: loansLoading } = useQuery({
    queryKey: ['loans', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('loans')
        .select('*')
        .eq('user_id', user.id);
      return data || [];
    },
    enabled: !!user
  });

  const { data: receipts = [], isLoading: receiptsLoading } = useQuery({
    queryKey: ['receipts', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('receipts')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
      return data || [];
    },
    enabled: !!user
  });

  const { data: savings = [], isLoading: savingsLoading } = useQuery({
    queryKey: ['savings', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('savings')
        .select('*')
        .eq('user_id', user.id);
      return data || [];
    },
    enabled: !!user
  });

  // Aggregates for summaries
  const totalExpenses = expenses.reduce((sum: number, exp: any) => sum + Number(exp.amount || 0), 0);
  const totalIncome = income.reduce((sum: number, inc: any) => sum + Number(inc.amount || 0), 0);
  const netSavings = totalIncome - totalExpenses;

  const activeSubscriptions = subscriptions.filter((sub: any) => sub.status === 'active');
  const totalMonthlySubs = activeSubscriptions.reduce((sum: number, sub: any) => {
    const amount = Number(sub.amount) || 0;
    return sum + (sub.billing_cycle === 'yearly' ? amount / 12 : amount);
  }, 0);

  const activeLoans = loans.filter((loan: any) => loan.status === 'active');
  const totalDebt = activeLoans.reduce((sum: number, loan: any) => sum + Number(loan.current_balance || 0), 0);
  const totalInitialDebt = activeLoans.reduce((sum: number, loan: any) => sum + Number(loan.initial_amount || 0), 0);
  const totalPaidDebt = totalInitialDebt - totalDebt;

  const totalReceiptsAmount = receipts.reduce((sum: number, r: any) => sum + Number(r.amount || 0), 0);

  const allGoals = [...savings];
  const totalTarget = allGoals.reduce((sum: number, g: any) => sum + Number(g.target_amount || 0), 0);
  const totalSaved = allGoals.reduce((sum: number, g: any) => sum + Number(g.current_amount || 0), 0);
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  const isLoading = expensesLoading || incomeLoading || subsLoading || 
                    loansLoading || receiptsLoading || savingsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen p-8 space-y-8 animate-fade-in">
      <BackgroundBlobs />
      
      {/* Header */}
      <div className="space-y-3 mb-4">
        <h1 className="text-4xl font-bold font-display tracking-tight">Insights & Analytics</h1>
        <p className="text-muted-foreground text-lg">Scan your finances at a glance</p>
      </div>

      <Tabs defaultValue="summary" className="space-y-6">
        <TabsList className="glass-strong">
          <TabsTrigger value="summary">Monthly</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="spending">Spending</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="loans">Loans</TabsTrigger>
          <TabsTrigger value="receipts">Receipts</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-lg bg-background/40 backdrop-blur">
              <p className="text-sm text-muted-foreground mb-1">Total Income</p>
              <p className="text-3xl font-bold font-display gradient-text animate-count-up">{formatAmount(totalIncome)}</p>
            </div>
            <div className="p-4 rounded-lg bg-background/40 backdrop-blur">
              <p className="text-sm text-muted-foreground mb-1">Total Expenses</p>
              <p className="text-3xl font-bold font-display gradient-text animate-count-up">{formatAmount(totalExpenses)}</p>
            </div>
            <div className="p-4 rounded-lg bg-background/40 backdrop-blur">
              <p className="text-sm text-muted-foreground mb-1">Net Savings</p>
              <p className="text-3xl font-bold font-display gradient-text animate-count-up">{formatAmount(netSavings)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <IncomeAnalytics income={income} formatAmount={formatAmount} />
            <ExpenseAnalytics expenses={expenses} formatAmount={formatAmount} />
          </div>

          <p className="text-sm text-muted-foreground">You saved {formatAmount(netSavings)} this period.</p>
        </TabsContent>

        <TabsContent value="earnings" className="space-y-4">
          <IncomeAnalytics income={income} formatAmount={formatAmount} />
          <p className="text-sm text-muted-foreground">Total income: {formatAmount(totalIncome)}.</p>
        </TabsContent>

        <TabsContent value="spending" className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <ExpenseAnalytics expenses={expenses} formatAmount={formatAmount} />
            <ReceiptAnalytics receipts={receipts} formatAmount={formatAmount} />
          </div>
          <p className="text-sm text-muted-foreground">Total expenses: {formatAmount(totalExpenses)} | Receipts total: {formatAmount(totalReceiptsAmount)}.</p>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <SavingsGoalsAnalytics savings={savings} goals={[]} formatAmount={formatAmount} />
          <p className="text-sm text-muted-foreground">Saved {formatAmount(totalSaved)} of {formatAmount(totalTarget)} ({overallProgress.toFixed(1)}%).</p>
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-4">
          <SubscriptionAnalytics subscriptions={subscriptions} formatAmount={formatAmount} />
          <p className="text-sm text-muted-foreground">Active: {activeSubscriptions.length} • Est. monthly: {formatAmount(totalMonthlySubs)}.</p>
        </TabsContent>

        <TabsContent value="loans" className="space-y-4">
          <LoanAnalytics loans={loans} formatAmount={formatAmount} />
          <p className="text-sm text-muted-foreground">Debt: {formatAmount(totalDebt)} • Paid: {formatAmount(totalPaidDebt)}.</p>
        </TabsContent>

        <TabsContent value="receipts" className="space-y-4">
          <ReceiptAnalytics receipts={receipts} formatAmount={formatAmount} />
          <p className="text-sm text-muted-foreground">{receipts.length} receipts • {formatAmount(totalReceiptsAmount)} total.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
