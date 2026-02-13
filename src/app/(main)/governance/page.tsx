import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Shield, Award } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Governance',
  description: 'Understand the governance structure of the Grand Coptic Benevolent Society, including the roles of the General Assembly and the Board of Directors.',
};

export default function GovernancePage() {
  return (
    <div className="bg-background">
      <div className="container py-16 lg:py-24">
        <div className="text-center">
          <h1 className="font-headline text-4xl md:text-5xl text-primary">Our Governance</h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            Our society is built on a foundation of transparency, accountability, and volunteer leadership.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary flex items-center gap-3">
                <Users className="h-6 w-6 text-accent" />
                The General Assembly
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none text-muted-foreground">
              <p>The General Assembly is the supreme authority of the society and is composed of all active members who have fulfilled their obligations. It convenes annually to ensure the society remains true to its mission.</p>
              <strong>Key Duties:</strong>
              <ul>
                <li>Electing the Board of Directors every four years.</li>
                <li>Approving the annual budget and final accounts.</li>
                <li>Setting the society's general policies and strategic direction.</li>
                <li>Overseeing the work of the Board and various committees.</li>
                <li>Amending the society's bylaws when necessary.</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary flex items-center gap-3">
                <Shield className="h-6 w-6 text-accent" />
                The Board of Directors
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none text-muted-foreground">
              <p>The Board of Directors is elected by the General Assembly and is responsible for managing the society's day-to-day affairs and implementing its policies. The board consists of dedicated members who serve on a voluntary basis.</p>
              <strong>Key Duties:</strong>
              <ul>
                <li>Managing assets and properties of the society.</li>
                <li>Forming committees to oversee specific programs.</li>
                <li>Preparing budgets and activity reports for the General Assembly.</li>
                <li>Representing the society in all administrative and legal matters.</li>
                <li>Appointing and supervising staff.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-16 text-center">
          <h2 className="font-headline text-3xl md:text-4xl text-primary">Organizational Structure</h2>
          <p className="mt-4 max-w-3xl mx-auto text-muted-foreground">
            Our structure ensures democratic oversight and efficient management.
          </p>
          <div className="mt-12 flex flex-col items-center">
            <div className="p-4 bg-primary text-primary-foreground rounded-lg shadow-lg w-72">
                <h3 className="font-bold font-headline">General Assembly</h3>
                <p className="text-sm">(All Active Members)</p>
            </div>
            <div className="h-12 w-px bg-border my-2"></div>
             <div className="p-4 bg-secondary rounded-lg shadow-md w-72">
                <h3 className="font-bold font-headline">Board of Directors</h3>
                <p className="text-sm">(Elected by General Assembly)</p>
            </div>
            <div className="h-12 w-px bg-border my-2"></div>
            <div className="flex flex-wrap justify-center gap-4">
               <div className="p-3 bg-card border rounded-lg shadow-sm w-56">
                <h3 className="font-bold font-headline">Executive Committees</h3>
                <p className="text-sm">(e.g., Health, Education)</p>
              </div>
              <div className="p-3 bg-card border rounded-lg shadow-sm w-56">
                <h3 className="font-bold font-headline">Staff & Volunteers</h3>
                <p className="text-sm">(Operational Teams)</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
