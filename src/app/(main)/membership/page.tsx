import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Membership',
  description: 'Learn how to become a member of the Al-Birr Society and join our mission to serve the community.',
};

export default function MembershipPage() {
  return (
    <div className="bg-background">
      <div className="container py-16 lg:py-24">
        <div className="text-center">
          <h1 className="font-headline text-4xl md:text-5xl text-primary">Join Our Mission</h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            Become a member of the Al-Birr Society and be part of a legacy of compassion and service that spans over a century.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-5">
          <div className="md:col-span-3">
             <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="font-headline text-xl">Eligibility Criteria</AccordionTrigger>
                <AccordionContent className="prose max-w-none text-muted-foreground">
                  <p>To become a member, an individual must meet the following criteria:</p>
                  <ul>
                    <li>Be of Egyptian nationality.</li>
                    <li>Have full legal capacity to make decisions.</li>
                    <li>Possess a good reputation and be of good conduct.</li>
                    <li>Have no criminal record or convictions for crimes affecting honor or integrity.</li>
                    <li>Commit to upholding the society's bylaws and regulations.</li>
                    <li>Commit to paying the prescribed membership fees.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="font-headline text-xl">Member Rights & Obligations</AccordionTrigger>
                <AccordionContent className="prose max-w-none text-muted-foreground">
                  <p>Members are the backbone of our society and enjoy certain rights while being expected to fulfill key obligations.</p>
                  <strong>Rights:</strong>
                   <ul>
                    <li>Attend General Assembly meetings.</li>
                    <li>Vote on decisions and in elections.</li>
                    <li>Run for a position on the Board of Directors.</li>
                    <li>Participate in the society's activities and programs.</li>
                  </ul>
                  <strong>Obligations:</strong>
                   <ul>
                    <li>Pay annual membership fees on time.</li>
                    <li>Actively participate in achieving the society's goals.</li>
                    <li>Adhere to the bylaws and decisions made by the General Assembly and Board.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="font-headline text-xl">Termination of Membership</AccordionTrigger>
                <AccordionContent className="prose max-w-none text-muted-foreground">
                  <p>Membership may be terminated under the following circumstances:</p>
                   <ul>
                    <li>Formal resignation submitted to the Board of Directors.</li>
                    <li>Death of the member.</li>
                    <li>Failure to pay membership fees for a full year after being notified.</li>
                    <li>Conduct that causes serious material or moral damage to the society.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div className="md:col-span-2">
            <Card className="bg-secondary sticky top-24">
              <CardHeader>
                <CardTitle className="font-headline text-2xl text-primary">Ready to Apply?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  The application process is simple. Interested individuals can download the membership form, fill it out, and submit it at our headquarters.
                </p>
                <Button size="lg" className="w-full" asChild>
                  <Link href="/contact">Contact Us for Application Details</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
