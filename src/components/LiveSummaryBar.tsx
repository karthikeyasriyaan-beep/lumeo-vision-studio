import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useCurrency } from "@/components/currency-selector";
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from "lucide-react";
import { motion } from "framer-motion";

export default function LiveSummaryBar() {
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

  const totalIncome = income.reduce((sum, item) => sum + Number(item.amount), 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
  const totalSavings = savings.reduce((sum, saving) => sum + Number(saving.current_amount || 0), 0);
  const balance = totalIncome - totalExpenses;

  const stats = [
    {
      label: "Balance",
      value: balance,
      icon: Wallet,
      color: balance >= 0 ? "text-primary" : "text-destructive",
      bgColor: balance >= 0 ? "bg-primary/10" : "bg-destructive/10"
    },
    {
      label: "Income",
      value: totalIncome,
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      label: "Expenses",
      value: totalExpenses,
      icon: TrendingDown,
      color: "text-destructive",
      bgColor: "bg-destructive/10"
    },
    {
      label: "Savings",
      value: totalSavings,
      icon: PiggyBank,
      color: "text-accent",
      bgColor: "bg-accent/10"
    }
  ];

  return (
    <div className="glass-strong sticky top-16 z-20 mb-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3 p-3 rounded-lg bg-background/30 hover:bg-background/50 transition-all"
          >
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
              <motion.p
                key={stat.value}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-lg font-bold ${stat.color} truncate`}
              >
                {formatAmount(stat.value)}
              </motion.p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
