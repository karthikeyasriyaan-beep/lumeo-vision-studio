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
    <div className="relative min-h-screen p-6 space-y-8 animate-slide-up">
      <BackgroundBlobs />
      
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold gradient-text">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Comprehensive insights into your financial data</p>
      </div>

      {/* Analytics Sections */}
      <div className="space-y-8">
        <ExpenseAnalytics expenses={expenses} formatAmount={formatAmount} />
        <IncomeAnalytics income={income} formatAmount={formatAmount} />
        <SubscriptionAnalytics subscriptions={subscriptions} formatAmount={formatAmount} />
        <LoanAnalytics loans={loans} formatAmount={formatAmount} />
        <ReceiptAnalytics receipts={receipts} formatAmount={formatAmount} />
        <SavingsGoalsAnalytics savings={savings} goals={[]} formatAmount={formatAmount} />
      </div>
    </div>
  );
}
