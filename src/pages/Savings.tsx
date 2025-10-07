import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, Wallet, Target, Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useCurrency } from "@/components/currency-selector";
import AddSavingsDialog from "@/components/forms/AddSavingsDialog";
import EditSavingsDialog from "@/components/forms/EditSavingsDialog";
import BackgroundBlobs from "@/components/BackgroundBlobs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SavingsChart } from "@/components/charts/SavingsChart";

const Savings = () => {
  const { user } = useAuth();
  const { formatAmount } = useCurrency();
  const [selectedSaving, setSelectedSaving] = useState<any>(null);

  const { data: savings = [], refetch } = useQuery({
    queryKey: ['savings', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('savings')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const totalSavings = savings.reduce((sum, saving) => sum + Number(saving.current_amount || 0), 0);
  const totalGoals = savings.reduce((sum, saving) => sum + Number(saving.target_amount || 0), 0);
  const averageProgress = savings.length > 0
    ? savings.reduce((sum, saving) => {
        const progress = (Number(saving.current_amount) / Number(saving.target_amount)) * 100;
        return sum + progress;
      }, 0) / savings.length
    : 0;

  return (
    <div className="relative min-h-screen p-4 sm:p-6 lg:p-8">
      <BackgroundBlobs />
      
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-slide-up">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight gradient-text">Savings Goals</h1>
            <p className="text-muted-foreground mt-2">Track and grow your savings</p>
          </div>
          <AddSavingsDialog onSuccess={refetch}>
            <Button size="lg" className="gap-2 hover-glow w-full sm:w-auto">
              <Plus className="h-5 w-5" />
              Add Savings Goal
            </Button>
          </AddSavingsDialog>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="glass hover-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Saved</CardTitle>
              <Wallet className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold gradient-text">{formatAmount(totalSavings)}</div>
            </CardContent>
          </Card>

          <Card className="glass hover-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Goals</CardTitle>
              <Target className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold gradient-text">{formatAmount(totalGoals)}</div>
            </CardContent>
          </Card>

          <Card className="glass hover-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
              <TrendingUp className="h-5 w-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold status-positive">{averageProgress.toFixed(1)}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Chart */}
        {savings.length > 0 && (
          <SavingsChart savings={savings} formatAmount={formatAmount} />
        )}

        {/* Savings List */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-2xl">Your Savings Goals</CardTitle>
          </CardHeader>
          <CardContent>
            {savings.length === 0 ? (
              <div className="text-center py-12">
                <Wallet className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground text-lg">No savings goals yet</p>
                <p className="text-sm text-muted-foreground mt-2">Start by creating your first savings goal</p>
              </div>
            ) : (
              <div className="space-y-4">
                {savings.map((saving) => {
                  const progress = (Number(saving.current_amount) / Number(saving.target_amount)) * 100;
                  return (
                     <div 
                      key={saving.id}
                      className="p-4 sm:p-6 rounded-xl border bg-card/50 hover:bg-card/80 transition-all duration-300 hover:shadow-lg"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h3 className="text-lg sm:text-xl font-semibold break-words">{saving.title}</h3>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0"
                              onClick={() => setSelectedSaving(saving)}
                            >
                              <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0"
                              onClick={() => setSelectedSaving(saving)}
                            >
                              <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                          {saving.description && (
                            <p className="text-sm text-muted-foreground break-words">{saving.description}</p>
                          )}
                          {saving.category && (
                            <Badge variant="outline" className="mt-2 text-xs">{saving.category}</Badge>
                          )}
                        </div>
                        <div className="text-left sm:text-right">
                          <div className="text-xl sm:text-2xl font-bold gradient-text">
                            {formatAmount(Number(saving.current_amount))}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            of {formatAmount(Number(saving.target_amount))}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{progress.toFixed(1)}%</span>
                        </div>
                        <Progress value={progress} className="h-3" />
                      </div>
                      {saving.target_date && (
                        <div className="mt-3 text-sm text-muted-foreground">
                          Target Date: {new Date(saving.target_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedSaving && (
        <EditSavingsDialog
          saving={selectedSaving}
          open={!!selectedSaving}
          onOpenChange={(open) => !open && setSelectedSaving(null)}
          onSuccess={() => {
            refetch();
            setSelectedSaving(null);
          }}
        />
      )}
    </div>
  );
};

export default Savings;
