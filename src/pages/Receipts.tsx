import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Receipt, Download, Image as ImageIcon, Pencil, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useCurrency } from "@/components/currency-selector";
import { AddReceiptDialog } from "@/components/forms/AddReceiptDialog";
import EditReceiptDialog from "@/components/forms/EditReceiptDialog";
import BackgroundBlobs from "@/components/BackgroundBlobs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Filter, Eye } from "lucide-react";
import { ReceiptsChart } from "@/components/charts/ReceiptsChart";

export default function Receipts() {
  const { formatAmount } = useCurrency();
  const { user } = useAuth();
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);

  const { data: receipts = [], refetch } = useQuery({
    queryKey: ['receipts', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('receipts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      return data || [];
    },
    enabled: !!user
  });

  const totalAmount = receipts.reduce((sum, receipt) => sum + Number(receipt.amount), 0);
  const processedCount = receipts.length;

  return (
    <div className="relative min-h-screen p-6 space-y-6 animate-slide-up">
      <BackgroundBlobs />
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold gradient-text">Receipt Tracker</h1>
          <p className="text-muted-foreground">Organize and manage your receipts digitally</p>
        </div>
        <AddReceiptDialog onSuccess={() => refetch()} />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass hover-glow">
          <CardContent className="p-6 text-center">
            <FileText className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-1">Total Receipts</h3>
            <p className="text-2xl font-bold">
              {receipts.length}
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass hover-glow">
          <CardContent className="p-6 text-center">
            <Download className="h-8 w-8 text-success mx-auto mb-3" />
            <h3 className="font-semibold mb-1">Processed</h3>
            <p className="text-2xl font-bold status-positive">
              {processedCount}
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass hover-glow">
          <CardContent className="p-6 text-center">
            <Eye className="h-8 w-8 text-warning mx-auto mb-3" />
            <h3 className="font-semibold mb-1">Total Value</h3>
            <p className="text-2xl font-bold">
              {formatAmount(totalAmount)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Chart */}
      {receipts.length > 0 && (
        <ReceiptsChart receipts={receipts} formatAmount={formatAmount} />
      )}

      {/* Search and Filters */}
      <Card className="glass">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search receipts..." className="pl-10" />
              </div>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Receipts List */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Your Receipts</CardTitle>
        </CardHeader>
        <CardContent>
          {receipts.length > 0 ? (
            <div className="space-y-4">
              {receipts.map((receipt) => (
                <div key={receipt.id} className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/50 hover:bg-background/80 transition-colors">
                  <div className="flex items-center gap-4">
                  {receipt.image_url ? (
                    <img 
                      src={receipt.image_url} 
                      alt={receipt.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Receipt className="h-6 w-6 text-primary" />
                    </div>
                  )}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-lg">{receipt.title}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setSelectedReceipt(receipt)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {receipt.merchant && `${receipt.merchant} • `}
                      {new Date(receipt.date).toLocaleDateString()}
                    </p>
                  </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold">
                        {formatAmount(Number(receipt.amount))}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Receipt className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No receipts yet</p>
                    <p className="text-sm">Start by uploading your first receipt to track expenses</p>
                  </div>
          )}
        </CardContent>
      </Card>

      {/* Export Data Button */}
      <Card className="glass">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg mb-1">Export Your Data</h3>
              <p className="text-sm text-muted-foreground">Download all your receipts data as JSON</p>
            </div>
            <Button
              onClick={() => {
                const dataStr = JSON.stringify(receipts, null, 2);
                const dataBlob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `receipts-${new Date().toISOString().split('T')[0]}.json`;
                link.click();
                URL.revokeObjectURL(url);
              }}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Download Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}