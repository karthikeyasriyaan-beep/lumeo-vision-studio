import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Terms of Service</CardTitle>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using Lumeo, you accept and agree to be bound by the terms and provision 
                of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
              <p className="text-muted-foreground leading-relaxed">
                Lumeo is a personal finance management application that helps users track income, expenses, 
                loans, subscriptions, and financial goals. We provide analytics, reporting, and data 
                visualization tools to help users understand their financial situation.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. User Responsibilities</h2>
              <p className="text-muted-foreground leading-relaxed">
                You are responsible for:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>Providing accurate and up-to-date information</li>
                <li>Using the service in compliance with applicable laws</li>
                <li>Not sharing your account with others</li>
                <li>Backing up important financial data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Financial Disclaimer</h2>
              <p className="text-muted-foreground leading-relaxed">
                Lumeo is a financial tracking tool and does not provide financial advice, investment 
                recommendations, or tax advice. All financial decisions should be made in consultation 
                with qualified financial professionals. We are not responsible for any financial 
                decisions made based on data or insights from our platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Data Accuracy</h2>
              <p className="text-muted-foreground leading-relaxed">
                While we strive to provide accurate tools and calculations, you are responsible for 
                verifying the accuracy of all financial data entered into the system. We recommend 
                regularly reconciling your Lumeo data with official financial statements.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Service Availability</h2>
              <p className="text-muted-foreground leading-relaxed">
                We strive to maintain high service availability but cannot guarantee uninterrupted access. 
                We may perform maintenance, updates, or experience technical issues that temporarily 
                affect service availability.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                To the fullest extent permitted by law, Lumeo shall not be liable for any indirect, 
                incidental, special, consequential, or punitive damages, or any loss of profits or 
                revenues, whether incurred directly or indirectly.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Termination</h2>
              <p className="text-muted-foreground leading-relaxed">
                You may terminate your account at any time. We reserve the right to terminate or 
                suspend accounts that violate these terms or for any other reason with reasonable notice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these terms at any time. Users will be notified of 
                significant changes via email or through the application.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about these Terms of Service, please contact us at:
                <br />
                Email: legal@lumeo.app
                <br />
                Address: [Your Business Address]
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Terms;