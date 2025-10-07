"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  Shield, TrendingUp, Smartphone, PieChart, Receipt, 
  CreditCard, BarChart3, Lock, Globe, Zap, ArrowRight, 
  Award, Target 
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Welcome = () => {
  const { signInWithGoogle, loading } = useAuth();

  const handleGoogleSignIn = async () => {
    const { error } = await signInWithGoogle();
    if (error) console.error("Sign in error:", error);
  };

  const features = [
    {
      icon: TrendingUp,
      title: "Smart Analytics",
      description: "Gain clear insights into spending patterns with real-time analytics and reports."
    },
    {
      icon: Smartphone,
      title: "Mobile First",
      description: "Manage finances anywhere with a smooth, responsive design built for all devices."
    },
    {
      icon: Receipt,
      title: "Receipt Scanning",
      description: "Upload or scan receipts to track expenses instantly with AI-powered recognition."
    },
    {
      icon: PieChart,
      title: "Visual Reports",
      description: "Understand your finances with beautiful, exportable charts and dashboards."
    },
    {
      icon: CreditCard,
      title: "Complete Tracking",
      description: "Track income, expenses, loans, debts, and subscriptions in one simple platform."
    },
    {
      icon: BarChart3,
      title: "Goal Progress",
      description: "Set financial goals and measure your progress with clarity and precision."
    }
  ];

  const whyChoose = [
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "Your data is fully encrypted and secured with enterprise-grade technology."
    },
    {
      icon: Globe,
      title: "Global Compliance",
      description: "Stay compliant with GDPR, CCPA, and other financial data regulations worldwide."
    },
    {
      icon: Zap,
      title: "Real-Time Sync",
      description: "Your data updates instantly across all devices with zero delays."
    },
    {
      icon: Lock,
      title: "Privacy First",
      description: "Your information stays private. We never sell or share your data."
    }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background via-background/95 to-background text-foreground">
      {/* Header with Theme Toggle and Sign In */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
        <Button
          onClick={handleGoogleSignIn}
          disabled={loading}
          variant="outline"
          className="border-2"
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>
        <ThemeToggle />
      </div>

      {/* Hero */}
      <section className="relative container mx-auto px-6 pt-32 pb-32 flex flex-col items-center text-center overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="blob blob-lg absolute top-20 left-10 bg-primary/5" />
          <div className="blob blob-sm absolute bottom-40 right-20 bg-accent/5" />
        </div>


        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight max-w-5xl"
        >
          Welcome to{" "}
          <span className="gradient-text">
            Lumeo
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mt-8 text-lg md:text-2xl text-muted-foreground max-w-3xl leading-relaxed"
        >
          The intelligent financial platform that transforms complex data into actionable insights. 
          Track, analyze, and optimize your wealth with enterprise-grade tools.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mt-12 flex flex-col sm:flex-row gap-4 items-center"
        >
          <Button
            onClick={handleGoogleSignIn}
            disabled={loading}
            size="lg"
            className="text-lg px-12 py-7 rounded-xl shadow-strong hover:shadow-medium transition-all"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                Start Free Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </>
            )}
          </Button>

          <Button 
            variant="outline" 
            size="lg"
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-lg px-12 py-7 rounded-xl border-2 hover:bg-muted/50 transition-all"
          >
            See How It Works
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.7 }}
          className="mt-12 flex items-center gap-8 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            Bank-level security
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            Real-time sync
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            Global compliance
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 text-sm font-medium">
            <Target className="w-4 h-4 text-primary" /> Features
          </span>
          <h2 className="mt-6 text-4xl md:text-5xl font-bold">
            Tools for{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Financial Growth
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border bg-card hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 mb-4 flex items-center justify-center rounded-lg bg-muted">
                    <f.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-semibold">{f.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{f.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Choose */}
      <section className="py-24 container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Lumeo
            </span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Built with security, compliance, and privacy-first principles — Lumeo is made for the serious investor.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {whyChoose.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 border bg-card hover:shadow-md transition-shadow">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-muted">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>


      {/* Final CTA */}
      <section className="py-32 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="relative text-center glass rounded-3xl p-16 md:p-24 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 -z-10" />
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Ready to Transform Your{" "}
            <span className="gradient-text">
              Financial Future?
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            Join thousands of users who've taken control of their finances with Lumeo. 
            Start tracking, analyzing, and growing your wealth today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={handleGoogleSignIn}
              disabled={loading}
              size="lg"
              className="text-lg px-12 py-7 rounded-xl shadow-strong hover:shadow-medium transition-all"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </Button>
            <div className="text-sm text-muted-foreground">
              No credit card required • Free forever
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t text-sm text-muted-foreground flex justify-center gap-8">
        <a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a>
        <a href="/terms" className="hover:text-primary transition-colors">Terms of Service</a>
      </footer>
    </div>
  );
};

export default Welcome;