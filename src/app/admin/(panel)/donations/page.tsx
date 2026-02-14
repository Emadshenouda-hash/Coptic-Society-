'use client';

import { useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface Donation {
  id: string;
  donorName: string;
  donorEmail: string;
  amount: number;
  isRecurring: boolean;
  donationDate: {
    seconds: number;
    nanoseconds: number;
  } | Date | string;
}

export default function AdminDonationsPage() {
  const firestore = useFirestore();

  const donationsCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'donations');
  }, [firestore]);

  const { data: donations, isLoading, error } = useCollection<Donation>(donationsCollectionRef);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    try {
        return format(date, 'PPP p');
    } catch {
        return 'Invalid Date';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">View Donations</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Donation Records</CardTitle>
          <CardDescription>
            View a list of all donations made through the website.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {error && <p className="text-destructive">Error loading donations: {error.message}</p>}
          {!isLoading && !error && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Donor Name</TableHead>
                  <TableHead>Donor Email</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donations && donations.length > 0 ? (
                  donations.map((donation) => (
                    <TableRow key={donation.id}>
                      <TableCell>{formatDate(donation.donationDate)}</TableCell>
                      <TableCell>{donation.donorName}</TableCell>
                      <TableCell>{donation.donorEmail}</TableCell>
                      <TableCell>{formatCurrency(donation.amount)}</TableCell>
                      <TableCell>
                        <Badge variant={donation.isRecurring ? 'default' : 'secondary'}>
                            {donation.isRecurring ? 'Recurring' : 'One-time'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No donations found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
