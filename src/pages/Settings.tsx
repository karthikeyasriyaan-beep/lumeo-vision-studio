import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Upload, Trash2, AlertTriangle } from "lucide-react";
import { CurrencySelector } from "@/components/currency-selector";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isClearing, setIsClearing] = useState(false);

  const handleClearData = async () => {
    if (!user) return;
    
    setIsClearing(true);
    try {
      // Clear all user data from all tables
      const clearPromises = [
        supabase.from('income').delete().eq('user_id', user.id),
        supabase.from('expenses').delete().eq('user_id', user.id),
        supabase.from('loans').delete().eq('user_id', user.id),
        supabase.from('subscriptions').delete().eq('user_id', user.id),
        supabase.from('receipts').delete().eq('user_id', user.id),
        supabase.from('goals').delete().eq('user_id', user.id),
      ];
      
      const results = await Promise.all(clearPromises);
      
      // Check for errors
      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        throw new Error('Some data could not be cleared');
      }

      toast({
        title: "Data cleared successfully",
        description: "All your financial data has been permanently deleted.",
      });
    } catch (error) {
      console.error('Error clearing data:', error);
      toast({
        title: "Error clearing data",
        description: "There was an error clearing your data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsClearing(false);
    }
  };

  const handleImportData = () => {
    // Create file input programmatically
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.csv';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            // Handle import logic here
            toast({
              title: "Import feature coming soon",
              description: "Data import functionality will be available in a future update.",
            });
          } catch (error) {
            toast({
              title: "Invalid file format",
              description: "Please upload a valid JSON or CSV file.",
              variant: "destructive",
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight gradient-text">Settings</h1>
        <p className="text-muted-foreground">
          Manage your preferences and data settings
        </p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        {/* Appearance Settings */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Appearance
            </CardTitle>
            <CardDescription>
              Customize how Lumeo looks and feels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Theme</p>
                <p className="text-sm text-muted-foreground">Switch between light and dark mode</p>
              </div>
              <ThemeToggle />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Currency</p>
                <p className="text-sm text-muted-foreground">Choose your preferred currency</p>
              </div>
              <CurrencySelector />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Data Management
            </CardTitle>
            <CardDescription>
              Import and manage your financial data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <Button 
                variant="outline" 
                className="justify-start gap-2"
                onClick={handleImportData}
              >
                <Upload className="h-4 w-4" />
                Import Data
                <span className="text-xs text-muted-foreground ml-auto">JSON, CSV</span>
              </Button>
              <Separator />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="justify-start gap-2">
                    <Trash2 className="h-4 w-4" />
                    Clear All Data
                    <span className="text-xs text-muted-foreground ml-auto">Permanent</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete all your financial data including:
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Income and expense records</li>
                        <li>Loan and debt information</li>
                        <li>Subscription data</li>
                        <li>Receipt images and data</li>
                        <li>Financial goals and progress</li>
                      </ul>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleClearData}
                      disabled={isClearing}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isClearing ? "Clearing..." : "Yes, clear all data"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Your account details and security
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Data Storage</p>
                <p className="text-sm text-muted-foreground">Securely stored with bank-level encryption</p>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Protected
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Legal */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Privacy & Legal</CardTitle>
            <CardDescription>
              Review our policies and terms
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button variant="ghost" size="sm" asChild>
              <a href="/privacy" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a href="/terms" target="_blank" rel="noopener noreferrer">
                Terms of Service
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}