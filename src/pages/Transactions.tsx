import { useState } from "react";
import { TrendingUp, TrendingDown, Filter, Search, DollarSign, Pencil } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCurrency } from "@/components/currency-selector";
import { AddIncomeDialog } from "@/components/forms/AddIncomeDialog";
import { AddExpenseDialog } from "@/components/forms/AddExpenseDialog";
import EditIncomeDialog from "@/components/forms/EditIncomeDialog";
import EditExpenseDialog from "@/components/forms/EditExpenseDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import BackgroundBlobs from "@/components/BackgroundBlobs";

export default function Transactions() {
  const { formatAmount } = useCurrency();
  const { user } = useAuth();
  const [selectedIncome, setSelectedIncome] = useState<any>(null);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: income = [], refetch: refetchIncome } = useQuery({
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

  const { data: expenses = [], refetch: refetchExpenses } = useQuery({
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

  const totalIncome = income.reduce((sum, item) => sum + Number(item.amount), 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
  const netBalance = totalIncome - totalExpenses;

  // Combined and sorted transactions
  const allTransactions = [
    ...income.map(item => ({ ...item, type: 'income' as const })),
    ...expenses.map(item => ({ ...item, type: 'expense' as const }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredTransactions = allTransactions.filter(t => {
    const title = t.type === 'income' ? t.source : t.name;
    const description = t.notes || '';
    return title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="relative min-h-screen p-6 lg:p-8">
      <BackgroundBlobs />
      
      <div className="max-w-7xl mx-auto space-y-8 animate-slide-up">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight gradient-text">Transactions</h1>
            <p className="text-muted-foreground mt-2">Track income and expenses in one place</p>
          </div>
          <div className="flex gap-3">
            <AddIncomeDialog onSuccess={refetchIncome} />
            <AddExpenseDialog onSuccess={refetchExpenses} />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="glass hover-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
              <DollarSign className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${netBalance >= 0 ? 'status-positive' : 'status-negative'}`}>
                {netBalance >= 0 ? '+' : ''}{formatAmount(netBalance)}
              </div>
            </CardContent>
          </Card>

          <Card className="glass hover-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <TrendingUp className="h-5 w-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold status-positive">
                +{formatAmount(totalIncome)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {income.length} transactions
              </p>
            </CardContent>
          </Card>

          <Card className="glass hover-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <TrendingDown className="h-5 w-5 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold status-negative">
                -{formatAmount(totalExpenses)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {expenses.length} transactions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search transactions..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-2xl">All Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="income">Income</TabsTrigger>
                <TabsTrigger value="expenses">Expenses</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {filteredTransactions.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <DollarSign className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No transactions yet</p>
                    <p className="text-sm">Start by adding your first income or expense</p>
                  </div>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <div 
                      key={`${transaction.type}-${transaction.id}`}
                      className="flex items-center justify-between p-4 rounded-xl border bg-card/50 hover:bg-card/80 transition-all duration-300 hover:shadow-lg cursor-pointer group"
                      onClick={() => {
                        if (transaction.type === 'income') {
                          setSelectedIncome(transaction);
                        } else {
                          setSelectedExpense(transaction);
                        }
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          transaction.type === 'income' ? 'bg-success/10' : 'bg-destructive/10'
                        }`}>
                          {transaction.type === 'income' ? (
                            <TrendingUp className="h-6 w-6 text-success" />
                          ) : (
                            <TrendingDown className="h-6 w-6 text-destructive" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-medium">{transaction.type === 'income' ? transaction.source : transaction.name}</h3>
                            {transaction.category && (
                              <Badge variant="outline">{transaction.category}</Badge>
                            )}
                            <Badge variant={transaction.type === 'income' ? 'default' : 'destructive'}>
                              {transaction.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(transaction.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`text-xl font-bold ${
                          transaction.type === 'income' ? 'status-positive' : 'status-negative'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}
                          {formatAmount(Number(transaction.amount))}
                        </div>
                        <Pencil className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="income" className="space-y-4">
                {income.map((item) => (
                  <div 
                    key={item.id}
                    className="flex items-center justify-between p-4 rounded-xl border bg-card/50 hover:bg-card/80 transition-all duration-300 hover:shadow-lg cursor-pointer group"
                    onClick={() => setSelectedIncome(item)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-success" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-medium">{item.source}</h3>
                          {item.category && <Badge variant="outline">{item.category}</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(item.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-xl font-bold status-positive">
                        +{formatAmount(Number(item.amount))}
                      </div>
                      <Pencil className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="expenses" className="space-y-4">
                {expenses.map((item) => (
                  <div 
                    key={item.id}
                    className="flex items-center justify-between p-4 rounded-xl border bg-card/50 hover:bg-card/80 transition-all duration-300 hover:shadow-lg cursor-pointer group"
                    onClick={() => setSelectedExpense(item)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                        <TrendingDown className="h-6 w-6 text-destructive" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-medium">{item.name}</h3>
                          {item.category && <Badge variant="outline">{item.category}</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(item.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-xl font-bold status-negative">
                        -{formatAmount(Number(item.amount))}
                      </div>
                      <Pencil className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialogs */}
      {selectedIncome && (
        <EditIncomeDialog
          income={selectedIncome}
          open={!!selectedIncome}
          onOpenChange={(open) => !open && setSelectedIncome(null)}
          onSuccess={() => {
            refetchIncome();
            setSelectedIncome(null);
          }}
        />
      )}
      {selectedExpense && (
        <EditExpenseDialog
          expense={selectedExpense}
          open={!!selectedExpense}
          onOpenChange={(open) => !open && setSelectedExpense(null)}
          onSuccess={() => {
            refetchExpenses();
            setSelectedExpense(null);
          }}
        />
      )}
    </div>
  );
}
