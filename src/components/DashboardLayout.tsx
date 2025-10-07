import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { CurrencySelector } from "@/components/currency-selector";
import {
  LayoutDashboard,
  ArrowLeftRight,
  CreditCard,
  Receipt,
  PiggyBank,
  TrendingUp,
  Settings,
  LogOut,
  Repeat,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Transactions", href: "/transactions", icon: ArrowLeftRight },
  { name: "Subscriptions", href: "/subscriptions", icon: Repeat },
  { name: "Loans & Debts", href: "/loans", icon: CreditCard },
  { name: "Receipts", href: "/receipts", icon: Receipt },
  { name: "Savings", href: "/savings", icon: PiggyBank },
  { name: "Analytics", href: "/analytics", icon: TrendingUp },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { signOut } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card/50 backdrop-blur-xl">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-border px-6">
            <h1 className="text-2xl font-bold gradient-text">Lumeo</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Bottom actions */}
          <div className="border-t border-border p-4 space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3"
              onClick={signOut}
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/50 backdrop-blur-xl px-6">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">
              {navigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <CurrencySelector />
            <ThemeToggle />
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
