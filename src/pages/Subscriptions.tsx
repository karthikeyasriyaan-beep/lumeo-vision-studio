import { useState } from "react";
import { Plus, Repeat, Calendar, AlertTriangle, BarChart3, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/components/currency-selector";
import { AddSubscriptionDialog } from "@/components/forms/AddSubscriptionDialog";
import EditSubscriptionDialog from "@/components/forms/EditSubscriptionDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import BackgroundBlobs from "@/components/BackgroundBlobs";
import { SubscriptionsChart } from "@/components/charts/SubscriptionsChart";

export default function Subscriptions() {
  const { formatAmount } = useCurrency();
  const { user } = useAuth();
  const [selectedSubscription, setSelectedSubscription] = useState<any>(null);

  const { data: subscriptions = [], refetch } = useQuery({
    queryKey: ['subscriptions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      return data || [];
    },
    enabled: !!user
  });

  const totalMonthly = subscriptions
    .filter(sub => sub.status === "active")
    .reduce((sum, sub) => {
      const amount = Number(sub.amount);
      return sum + (sub.billing_cycle === "Monthly" ? amount : 
                    sub.billing_cycle === "Yearly" ? amount / 12 :
                    sub.billing_cycle === "Quarterly" ? amount / 3 :
                    sub.billing_cycle === "Weekly" ? amount * 4 : amount);
    }, 0);

  const totalYearly = totalMonthly * 12;

  return (
    <div className="relative min-h-screen p-4 sm:p-6 space-y-4 sm:space-y-6 animate-slide-up">
      <BackgroundBlobs />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold gradient-text">Subscriptions</h1>
          <p className="text-muted-foreground">Manage your recurring payments and subscriptions</p>
        </div>
        <AddSubscriptionDialog onSuccess={() => refetch()} />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass hover-glow">
          <CardContent className="p-6 text-center">
            <Repeat className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-1">Monthly Total</h3>
            <p className="text-2xl font-bold status-negative">
              -{formatAmount(totalMonthly)}
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass hover-glow">
          <CardContent className="p-6 text-center">
            <Calendar className="h-8 w-8 text-warning mx-auto mb-3" />
            <h3 className="font-semibold mb-1">Yearly Total</h3>
            <p className="text-2xl font-bold status-negative">
              -{formatAmount(totalYearly)}
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass hover-glow">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-3" />
            <h3 className="font-semibold mb-1">Active Subscriptions</h3>
            <p className="text-2xl font-bold">
              {subscriptions.filter(sub => sub.status === "active").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Chart */}
      {subscriptions.length > 0 && (
        <SubscriptionsChart subscriptions={subscriptions} formatAmount={formatAmount} />
      )}

      {/* Subscriptions List */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Your Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          {subscriptions.length > 0 ? (
            <div className="space-y-4">
              {subscriptions.map((subscription) => (
                <div key={subscription.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-background/50 border border-border/50 hover:bg-background/80 transition-colors">
                  <div className="flex items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Repeat className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium break-words">{subscription.name}</h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0"
                          onClick={() => setSelectedSubscription(subscription)}
                        >
                          <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </Button>
                        <Badge variant={subscription.status === 'active' ? 'default' : 'destructive'} className="text-xs">
                          {subscription.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">{subscription.category}</Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground break-words">
                        {subscription.billing_cycle} • Next billing: {subscription.next_billing_date ? new Date(subscription.next_billing_date).toLocaleDateString() : 'Not set'}
                      </p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right w-full sm:w-auto">
                    <p className="text-base sm:text-lg font-bold status-negative">
                      -{formatAmount(Number(subscription.amount))}
                    </p>
                    <p className="text-xs text-muted-foreground">{subscription.billing_cycle}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Repeat className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No subscriptions yet</p>
              <p className="text-sm">Start by adding your first subscription to track recurring expenses</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Subscription Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass hover-glow">
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subscriptions.length > 0 ? (
                Object.entries(subscriptions.reduce((acc, sub) => {
                  const category = sub.category || 'Other';
                  acc[category] = (acc[category] || 0) + Number(sub.amount);
                  return acc;
                }, {} as Record<string, number>))
                .map(([category, amount]) => ({
                  category,
                  amount,
                  color: `hsl(${Math.random() * 360}, 70%, 50%)`
                }))
                .slice(0, 5)
                .map((item) => (
                  <div key={item.category} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{item.category}</span>
                      <span className="text-muted-foreground">{formatAmount(item.amount)}/month</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-500 bg-primary"
                        style={{ width: `${totalMonthly > 0 ? (item.amount / totalMonthly) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No subscription data yet</p>
                  <p className="text-sm">Add subscriptions to see category breakdown</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="glass hover-glow">
          <CardHeader>
            <CardTitle>Upcoming Renewals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {subscriptions.length > 0 ? (
                subscriptions
                  .filter(sub => sub.status === 'active' && sub.next_billing_date)
                  .sort((a, b) => new Date(a.next_billing_date).getTime() - new Date(b.next_billing_date).getTime())
                  .slice(0, 5)
                  .map((subscription) => (
                    <div key={subscription.id} className="flex items-center justify-between p-3 rounded-lg bg-background/30">
                      <div>
                        <p className="font-medium text-sm">{subscription.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(subscription.next_billing_date).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="font-bold text-sm status-negative">
                        -{formatAmount(Number(subscription.amount))}
                      </span>
                    </div>
                  ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No upcoming renewals</p>
                  <p className="text-sm">Add subscriptions to track renewals</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedSubscription && (
        <EditSubscriptionDialog
          subscription={selectedSubscription}
          open={!!selectedSubscription}
          onOpenChange={(open) => !open && setSelectedSubscription(null)}
          onSuccess={() => {
            refetch();
            setSelectedSubscription(null);
          }}
        />
      )}
    </div>
  );
}