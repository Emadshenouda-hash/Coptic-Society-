'use client';

import { useState } from 'react';
import { DollarSign, User, CreditCard, Gift, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Progress } from './ui/progress';

const steps = [
  { id: 1, name: 'Amount', icon: DollarSign },
  { id: 2, name: 'Your Details', icon: User },
  { id: 3, name: 'Payment', icon: CreditCard },
  { id: 4, name: 'Thank You', icon: Gift },
];

const donationAmounts = [25, 50, 100, 250];

export function DonateForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [amount, setAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);

  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const handlePrev = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
  const handleAmountSelect = (selectedAmount: number) => {
    setAmount(selectedAmount);
    setCustomAmount('');
  }
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setCustomAmount(value);
      setAmount(Number(value));
    }
  }

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
            <Button size="lg" className="w-full" onClick={handleNext}>Continue</Button>
          </div>
        )}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="font-headline text-xl">2. Your Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" placeholder="John" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" placeholder="Doe" />
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="john.doe@example.com" />
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePrev}>Back</Button>
              <Button onClick={handleNext}>Proceed to Payment</Button>
            </div>
          </div>
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
              <Button onClick={handleNext} className="bg-accent text-accent-foreground hover:bg-accent/90">Confirm Donation of ${amount}</Button>
            </div>
          </div>
        )}
         {currentStep === 4 && (
           <div className="text-center space-y-6 flex flex-col items-center">
            <CheckCircle className="h-20 w-20 text-green-500" />
            <h3 className="font-headline text-2xl text-primary">Thank You For Your Generosity!</h3>
            <p className="text-muted-foreground max-w-md">
                Your ${amount} {isRecurring ? 'monthly' : ''} donation has been processed successfully. A receipt has been sent to your email. Your support helps us continue our vital work in the community.
            </p>
            <Button variant="outline" onClick={() => setCurrentStep(1)}>Make Another Donation</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
