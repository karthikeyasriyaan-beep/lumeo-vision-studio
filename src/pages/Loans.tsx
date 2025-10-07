import { useState } from "react";
import { CreditCard, TrendingDown, Calendar, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useCurrency } from "@/components/currency-selector";
import { AddLoanDialog } from "@/components/forms/AddLoanDialog";
import EditLoanDialog from "@/components/forms/EditLoanDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import BackgroundBlobs from "@/components/BackgroundBlobs";
import { LoansChart } from "@/components/charts/LoansChart";

export default function Loans() {
  const { formatAmount } = useCurrency();
  const { user } = useAuth();
  const [selectedLoan, setSelectedLoan] = useState<any>(null);

  const { data: loans = [], refetch } = useQuery({
    queryKey: ['loans', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('loans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      return data || [];
    },
    enabled: !!user
  });

  const totalDebt = loans.reduce((sum, loan) => sum + Number(loan.current_balance), 0);
  const totalMonthlyPayments = loans.reduce((sum, loan) => sum + Number(loan.monthly_payment || 0), 0);

  return (
    <div className="relative min-h-screen p-4 sm:p-6 space-y-4 sm:space-y-6 animate-slide-up">
      <BackgroundBlobs />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold gradient-text">Loans & Debts</h1>
          <p className="text-muted-foreground">Track your loans, debts and payment progress</p>
        </div>
        <AddLoanDialog onSuccess={() => refetch()} />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass hover-glow">
          <CardContent className="p-6 text-center">
            <CreditCard className="h-8 w-8 text-destructive mx-auto mb-3" />
            <h3 className="font-semibold mb-1">Total Debt</h3>
            <p className="text-2xl font-bold status-negative">
              -{formatAmount(totalDebt)}
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass hover-glow">
          <CardContent className="p-6 text-center">
            <Calendar className="h-8 w-8 text-warning mx-auto mb-3" />
            <h3 className="font-semibold mb-1">Monthly Payments</h3>
            <p className="text-2xl font-bold status-negative">
              -{formatAmount(totalMonthlyPayments)}
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass hover-glow">
          <CardContent className="p-6 text-center">
            <TrendingDown className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-1">Avg Interest Rate</h3>
            <p className="text-2xl font-bold">
              {loans.length > 0 ? (loans.reduce((sum, loan) => sum + Number(loan.interest_rate || 0), 0) / loans.length).toFixed(1) : 0}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Chart */}
      {loans.length > 0 && (
        <LoansChart loans={loans} formatAmount={formatAmount} />
      )}

      {/* Loans List */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Your Loans & Debts</CardTitle>
        </CardHeader>
        <CardContent>
          {loans.length > 0 ? (
            <div className="space-y-6">
              {loans.map((loan) => {
                const progressPercentage = ((Number(loan.principal_amount) - Number(loan.current_balance)) / Number(loan.principal_amount)) * 100;
                
                return (
                  <div key={loan.id} className="p-4 rounded-lg bg-background/50 border border-border/50 hover:bg-background/80 transition-colors space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
                          <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-destructive" />
                        </div>
                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-medium text-base sm:text-lg break-words">{loan.title}</h3>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0"
                              onClick={() => setSelectedLoan(loan)}
                            >
                              <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </Button>
                            <Badge variant="destructive" className="text-xs">debt</Badge>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground break-words">
                            Next payment: {loan.due_date ? new Date(loan.due_date).toLocaleDateString() : 'Not set'} • {loan.interest_rate || 0}% APR
                          </p>
                        </div>
                      </div>
                      <div className="text-left sm:text-right w-full sm:w-auto">
                        <p className="text-xs sm:text-sm text-muted-foreground">Monthly Payment</p>
                        <p className="text-base sm:text-lg font-bold status-negative">
                          -{formatAmount(Number(loan.monthly_payment || 0))}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Remaining: {formatAmount(Number(loan.current_balance))}</span>
                        <span>Total: {formatAmount(Number(loan.principal_amount))}</span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                      <p className="text-xs text-muted-foreground text-center">
                        {progressPercentage.toFixed(1)}% paid off
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <CreditCard className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No loans or debts yet</p>
              <p className="text-sm">Start by adding your first loan or debt to track payments</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Debt Freedom Timeline */}
      <Card className="glass hover-glow">
        <CardHeader>
          <CardTitle>Debt Freedom Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loans.length > 0 ? (
              loans.map((loan) => {
                const monthsRemaining = loan.monthly_payment ? Math.ceil(Number(loan.current_balance) / Number(loan.monthly_payment)) : 0;
                const payoffDate = new Date();
                payoffDate.setMonth(payoffDate.getMonth() + monthsRemaining);
                
                return (
                  <div key={loan.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 py-2">
                    <div>
                      <p className="font-medium">{loan.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {monthsRemaining} months remaining
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-sm font-medium">
                        {payoffDate.toLocaleDateString('en-US', { 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No loan data yet</p>
                <p className="text-sm">Add loans to see payoff timeline</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedLoan && (
        <EditLoanDialog
          loan={selectedLoan}
          open={!!selectedLoan}
          onOpenChange={(open) => !open && setSelectedLoan(null)}
          onSuccess={() => {
            refetch();
            setSelectedLoan(null);
          }}
        />
      )}
    </div>
  );
}