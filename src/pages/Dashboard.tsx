import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useCurrency } from "@/components/currency-selector";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  CreditCard,
  Receipt,
  PiggyBank,
  Repeat,
  DollarSign,
} from "lucide-react";
import BackgroundBlobs from "@/components/BackgroundBlobs";
import DashboardLayout from "@/components/DashboardLayout";
import LiveSummaryBar from "@/components/LiveSummaryBar";

export default function Dashboard() {
  const { user } = useAuth();
  const { formatAmount } = useCurrency();

  const { data: income = [] } = useQuery({
    queryKey: ['income', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('income')
        .select('*')
        .eq('user_id', user.id);
      return data || [];
    },
    enabled: !!user
  });

  const { data: expenses = [] } = useQuery({
    queryKey: ['expenses', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id);
      return data || [];
    },
    enabled: !!user
  });

  const { data: subscriptions = [] } = useQuery({
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

  const { data: loans = [] } = useQuery({
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

  const { data: savings = [] } = useQuery({
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

  const { data: receipts = [] } = useQuery({
    queryKey: ['receipts', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('receipts')
        .select('*')
        .eq('user_id', user.id);
      return data || [];
    },
    enabled: !!user
  });

  const totalIncome = income.reduce((sum, item) => sum + Number(item.amount), 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
  const totalLoans = loans.reduce((sum, loan) => sum + Number(loan.current_balance), 0);
  const totalSavings = savings.reduce((sum, saving) => sum + Number(saving.current_amount), 0);
  const netBalance = totalIncome - totalExpenses;

  const stats = [
    {
      title: "Total Income",
      value: formatAmount(totalIncome),
      icon: TrendingUp,
      iconColor: "text-success",
      bgColor: "bg-success/10"
    },
    {
      title: "Total Expenses",
      value: formatAmount(totalExpenses),
      icon: TrendingDown,
      iconColor: "text-destructive",
      bgColor: "bg-destructive/10"
    },
    {
      title: "Net Balance",
      value: formatAmount(netBalance),
      icon: Wallet,
      iconColor: netBalance >= 0 ? "text-success" : "text-destructive",
      bgColor: netBalance >= 0 ? "bg-success/10" : "bg-destructive/10"
    },
    {
      title: "Total Debt",
      value: formatAmount(totalLoans),
      icon: CreditCard,
      iconColor: "text-destructive",
      bgColor: "bg-destructive/10"
    },
    {
      title: "Active Subscriptions",
      value: subscriptions.filter(s => s.status === 'active').length,
      icon: Repeat,
      iconColor: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      title: "Total Savings",
      value: formatAmount(totalSavings),
      icon: PiggyBank,
      iconColor: "text-success",
      bgColor: "bg-success/10"
    },
  ];

  return (
    <DashboardLayout>
      <div className="relative space-y-6 animate-slide-up">
        <BackgroundBlobs />
        
        {/* Live Summary Bar */}
        <LiveSummaryBar />
        
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold gradient-text font-display">Welcome Back</h1>
          <p className="text-muted-foreground">Your intelligent financial companion</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, index) => (
            <Card key={index} className="glass hover-glow overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                    <h3 className="text-2xl font-bold animate-count-up">{stat.value}</h3>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="glass hover-lift cursor-pointer group">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-display">
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Receipt className="h-4 w-4 text-primary" />
                </div>
                Receipts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold mb-1 animate-count-up">{receipts.length}</p>
              <p className="text-xs text-muted-foreground">Total uploaded</p>
            </CardContent>
          </Card>

          <Card className="glass hover-lift cursor-pointer group">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-display">
                <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                  <DollarSign className="h-4 w-4 text-accent" />
                </div>
                Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold mb-1 animate-count-up">{income.length + expenses.length}</p>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card className="glass hover-lift cursor-pointer group">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-display">
                <div className="p-2 rounded-lg bg-success/10 group-hover:bg-success/20 transition-colors">
                  <PiggyBank className="h-4 w-4 text-success" />
                </div>
                Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold mb-1 animate-count-up">{savings.length}</p>
              <p className="text-xs text-muted-foreground">Active goals</p>
            </CardContent>
          </Card>

          <Card className="glass hover-lift cursor-pointer group">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-display">
                <div className="p-2 rounded-lg bg-destructive/10 group-hover:bg-destructive/20 transition-colors">
                  <CreditCard className="h-4 w-4 text-destructive" />
                </div>
                Loans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold mb-1 animate-count-up">{loans.length}</p>
              <p className="text-xs text-muted-foreground">Active loans</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
