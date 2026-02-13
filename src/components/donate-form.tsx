'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DollarSign, User, CreditCard, Gift, CheckCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Progress } from './ui/progress';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { useFirestore, useUser } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';

const steps = [
  { id: 1, name: 'Amount', icon: DollarSign },
  { id: 2, name: 'Your Details', icon: User },
  { id: 3, name: 'Payment', icon: CreditCard },
  { id: 4, name: 'Thank You', icon: Gift },
];

const donationAmounts = [25, 50, 100, 250];

const donorDetailsSchema = z.object({
  donorName: z.string().min(2, { message: 'Full name is required.' }),
  donorEmail: z.string().email({ message: 'A valid email is required.' }),
});

type DonorDetailsValues = z.infer<typeof donorDetailsSchema>;

export function DonateForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [amount, setAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  const form = useForm<DonorDetailsValues>({
    resolver: zodResolver(donorDetailsSchema),
    defaultValues: {
      donorName: '',
      donorEmail: '',
    },
  });

  const handleAmountSelect = (selectedAmount: number) => {
    setAmount(selectedAmount);
    setCustomAmount('');
  }
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setCustomAmount(value);
      setAmount(Number(value) || 0);
    }
  }

  const handleDetailsSubmit = () => {
    setCurrentStep(3);
  };
  
  const handleConfirmDonation = async () => {
     if (!firestore) {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'Database service is not available.',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    const donorDetails = form.getValues();

    try {
      const donationData = {
        amount: amount,
        isRecurring: isRecurring,
        donorName: donorDetails.donorName,
        donorEmail: donorDetails.donorEmail,
        donationDate: serverTimestamp(),
        userId: user ? user.uid : null,
      };

      const donationsRef = collection(firestore, 'donations');
      addDocumentNonBlocking(donationsRef, donationData);
      
      setCurrentStep(4);

    } catch (error) {
       console.error('Error submitting donation:', error);
       toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'Could not process your donation. Please try again later.',
      });
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const handlePrev = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const progress = (currentStep / steps.length) * 100;

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-2xl">
      <CardHeader>
        <CardTitle className="font-headline text-3xl text-primary">Make a Donation</CardTitle>
        <CardDescription>Your contribution makes a world of difference.</CardDescription>
        {currentStep < 4 && <Progress value={progress} className="mt-4" />}
      </CardHeader>
      <CardContent>
        {currentStep === 1 && (
          <div className="space-y-6">
            <h3 className="font-headline text-xl">1. Choose your donation amount</h3>
            <RadioGroup value={isRecurring ? 'monthly' : 'one-time'} onValueChange={(val) => setIsRecurring(val === 'monthly')} className="flex gap-4">
                <Label htmlFor="one-time" className="flex items-center gap-2 p-4 border rounded-md cursor-pointer flex-1 has-[:checked]:bg-accent/20 has-[:checked]:border-accent transition-all">
                    <RadioGroupItem value="one-time" id="one-time" /> One-time
                </Label>
                 <Label htmlFor="monthly" className="flex items-center gap-2 p-4 border rounded-md cursor-pointer flex-1 has-[:checked]:bg-accent/20 has-[:checked]:border-accent transition-all">
                    <RadioGroupItem value="monthly" id="monthly" /> Monthly
                </Label>
            </RadioGroup>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {donationAmounts.map(val => (
                    <Button key={val} variant={amount === val && customAmount === '' ? "default" : "outline"} className="py-6 text-lg" onClick={() => handleAmountSelect(val)}>
                        ${val}
                    </Button>
                ))}
            </div>
             <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input type="text" placeholder="Or enter custom amount" value={customAmount} onChange={handleCustomAmountChange} className="pl-10 text-lg h-12" />
            </div>
            <Button size="lg" className="w-full" onClick={() => setCurrentStep(2)} disabled={amount <= 0}>Continue</Button>
          </div>
        )}
        {currentStep === 2 && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleDetailsSubmit)} className="space-y-6">
              <h3 className="font-headline text-xl">2. Your Details</h3>
               <FormField
                  control={form.control}
                  name="donorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="donorEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <div className="flex justify-between">
                <Button variant="outline" onClick={handlePrev}>Back</Button>
                <Button type="submit">Proceed to Payment</Button>
              </div>
            </form>
          </Form>
        )}
        {currentStep === 3 && (
           <div className="space-y-6">
            <h3 className="font-headline text-xl">3. Payment Information</h3>
            <p className="text-sm text-muted-foreground">This is a demo. Please do not enter real credit card information.</p>
            <div className="space-y-2">
                <Label htmlFor="card-number">Card Number</Label>
                <Input id="card-number" placeholder="0000 0000 0000 0000" />
            </div>
            <div className="grid grid-cols-3 gap-4">
                 <div className="space-y-2 col-span-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input id="expiry" placeholder="MM / YY" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="123" />
                </div>
            </div>
             <div className="flex justify-between">
              <Button variant="outline" onClick={handlePrev}>Back</Button>
              <Button onClick={handleConfirmDonation} className="bg-accent text-accent-foreground hover:bg-accent/90" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Processing...</> : `Confirm Donation of $${amount}`}
              </Button>
            </div>
          </div>
        )}
         {currentStep === 4 && (
           <div className="text-center space-y-6 flex flex-col items-center">
            <CheckCircle className="h-20 w-20 text-green-500" />
            <h3 className="font-headline text-2xl text-primary">Thank You For Your Generosity!</h3>
            <p className="text-muted-foreground max-w-md">
                Your ${amount} {isRecurring ? 'monthly' : ''} donation has been processed. A receipt has been sent to your email. Your support helps us continue our vital work in the community.
            </p>
            <Button variant="outline" onClick={() => { setCurrentStep(1); form.reset(); }}>Make Another Donation</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

    