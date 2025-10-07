import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Privacy = () => {
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
            <CardTitle className="text-3xl">Privacy Policy</CardTitle>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed">
                We collect information you provide directly to us, such as when you create an account, 
                add financial data, or contact us for support. This includes your Google account information 
                (name, email), financial transactions, receipts, and usage data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use your information to provide, maintain, and improve our services, including:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                <li>Processing and storing your financial data</li>
                <li>Providing analytics and insights</li>
                <li>Sending important service updates</li>
                <li>Ensuring security and preventing fraud</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement industry-standard security measures to protect your data, including 
                encryption at rest and in transit, secure authentication, and regular security audits. 
                Your financial data is stored securely and never shared with third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. International Compliance</h2>
              <p className="text-muted-foreground leading-relaxed">
                Lumeo complies with major data protection regulations including:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                <li>GDPR (European Union & United Kingdom)</li>
                <li>CCPA & GLBA (United States)</li>
                <li>LGPD (Brazil)</li>
                <li>PDPA (Singapore)</li>
                <li>POPIA (South Africa)</li>
                <li>PIPEDA (Canada)</li>
                <li>Privacy Act (Australia)</li>
                <li>APPI (Japan)</li>
                <li>DPDP Act (India)</li>
                <li>DIFC Data Protection Law (UAE)</li>
                <li>Federal Data Protection Act (Switzerland)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed">
                You have the right to access, update, or delete your personal information. 
                You can also request data portability or restrict processing of your data. 
                Contact us at privacy@lumeo.app to exercise these rights.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your data only as long as necessary to provide our services or as required by law. 
                You can delete your account and all associated data at any time from your settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about this Privacy Policy, please contact us at:
                <br />
                Email: privacy@lumeo.app
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

export default Privacy;