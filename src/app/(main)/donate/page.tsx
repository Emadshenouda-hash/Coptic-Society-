import { DonateForm } from "@/components/donate-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Heart, Utensils } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Donate',
  description: 'Support the Al-Birr Society with your donation and help us continue our mission of serving the community.',
};

const impactItems = [
    {
        icon: Utensils,
        amount: '$25',
        description: 'can provide a food basket for a family for a week.'
    },
    {
        icon: Heart,
        amount: '$50',
        description: 'can cover the cost of a medical check-up and essential medicines.'
    },
    {
        icon: DollarSign,
        amount: '$100',
        description: 'can support a student with school supplies for a year.'
    }
]

export default function DonatePage() {
  return (
    <div className="bg-secondary">
      <div className="container py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="font-headline text-4xl md:text-5xl text-primary">Your Support, Their Future</h1>
              <p className="text-lg text-muted-foreground">
                Every donation, no matter the size, contributes directly to our programs and brings hope to those in need. Join us in making a lasting impact.
              </p>
            </div>
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="font-headline text-2xl text-primary">See Your Impact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {impactItems.map(item => (
                    <div key={item.amount} className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20 text-accent">
                            <item.icon className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-foreground"><strong className="font-semibold">{item.amount}</strong> {item.description}</p>
                        </div>
                    </div>
                ))}
              </CardContent>
            </Card>
          </div>
          <div>
            <DonateForm />
          </div>
        </div>
      </div>
    </div>
  );
}
