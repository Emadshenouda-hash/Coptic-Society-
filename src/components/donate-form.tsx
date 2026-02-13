'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DollarSign, User, CreditCard, Gift, CheckCircle, Loader2 } from 'lucide-react';
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
import { useLanguage } from '@/context/language-context';

const steps_en = [
  { id: 1, name: 'Amount', icon: DollarSign },
  { id: 2, name: 'Your Details', icon: User },
  { id: 3, name: 'Payment', icon: CreditCard },
  { id: 4, name: 'Thank You', icon: Gift },
];

const steps_ar = [
  { id: 1, name: 'المبلغ', icon: DollarSign },
  { id: 2, name: 'تفاصيلك', icon: User },
  { id: 3, name: 'الدفع', icon: CreditCard },
  { id: 4, name: 'شكراً لك', icon: Gift },
];

const donationAmounts = [25, 50, 100, 250];

const translations = {
  en: {
    formTitle: 'Make a Donation',
    formDescription: 'Your contribution makes a world of difference.',
    step1Title: '1. Choose your donation amount',
    oneTime: 'One-time',
    monthly: 'Monthly',
    customAmount: 'Or enter custom amount',
    continue: 'Continue',
    step2Title: '2. Your Details',
    fullNameLabel: 'Full Name',
    fullNamePlaceholder: 'John Doe',
    emailLabel: 'Email Address',
    emailPlaceholder: 'john.doe@example.com',
    back: 'Back',
    proceedToPayment: 'Proceed to Payment',
    step3Title: '3. Payment Information',
    demoText: 'This is a demo. Please do not enter real credit card information.',
    cardNumber: 'Card Number',
    expiryDate: 'Expiry Date',
    cvc: 'CVC',
    processing: 'Processing...',
    confirmDonation: 'Confirm Donation of',
    step4Title: 'Thank You For Your Generosity!',
    thankYouMessage: 'Your ${amount} {isRecurring} donation has been processed. A receipt has been sent to your email. Your support helps us continue our vital work in the community.',
    monthlyWord: 'monthly',
    makeAnotherDonation: 'Make Another Donation',
    errorOccurred: 'An error occurred',
    dbUnavailable: 'Database service is not available.',
    couldNotProcess: 'Could not process your donation. Please try again later.',
    validation: {
        nameRequired: 'Full name is required.',
        emailRequired: 'A valid email is required.',
    }
  },
  ar: {
    formTitle: 'قدم تبرعاً',
    formDescription: 'مساهمتك تحدث فرقاً كبيراً.',
    step1Title: '١. اختر مبلغ التبرع',
    oneTime: 'مرة واحدة',
    monthly: 'شهرياً',
    customAmount: 'أو أدخل مبلغًا مخصصًا',
    continue: 'متابعة',
    step2Title: '٢. تفاصيلك',
    fullNameLabel: 'الاسم الكامل',
    fullNamePlaceholder: 'جون دو',
    emailLabel: 'البريد الإلكتروني',
    emailPlaceholder: 'john.doe@example.com',
    back: 'رجوع',
    proceedToPayment: 'الانتقال إلى الدفع',
    step3Title: '٣. معلومات الدفع',
    demoText: 'هذا عرض تجريبي. الرجاء عدم إدخال معلومات بطاقة ائتمان حقيقية.',
    cardNumber: 'رقم البطاقة',
    expiryDate: 'تاريخ الانتهاء',
    cvc: 'CVC',
    processing: 'قيد المعالجة...',
    confirmDonation: 'تأكيد التبرع بمبلغ',
    step4Title: 'شكراً لك على كرمك!',
    thankYouMessage: 'لقد تمت معالجة تبرعك {isRecurring} بقيمة ${amount}. تم إرسال إيصال إلى بريدك الإلكتروني. يساعدنا دعمك على مواصلة عملنا الحيوي في المجتمع.',
    monthlyWord: 'الشهري',
    makeAnotherDonation: 'قدم تبرعًا آخر',
    errorOccurred: 'حدث خطأ',
    dbUnavailable: 'خدمة قاعدة البيانات غير متوفرة.',
    couldNotProcess: 'تعذر معالجة تبرعك. يرجى المحاولة مرة أخرى في وقت لاحق.',
    validation: {
        nameRequired: 'الاسم الكامل مطلوب.',
        emailRequired: 'البريد الإلكتروني مطلوب.',
    }
  }
};


export function DonateForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [amount, setAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const { language } = useLanguage();
  const t = translations[language];
  const steps = language === 'ar' ? steps_ar : steps_en;

  const donorDetailsSchema = z.object({
    donorName: z.string().min(2, { message: t.validation.nameRequired }),
    donorEmail: z.string().email({ message: t.validation.emailRequired }),
  });

  type DonorDetailsValues = z.infer<typeof donorDetailsSchema>;

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
        title: t.errorOccurred,
        description: t.dbUnavailable,
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
        title: t.errorOccurred,
        description: t.couldNotProcess,
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
        <CardTitle className="font-headline text-3xl text-primary">{t.formTitle}</CardTitle>
        <CardDescription>{t.formDescription}</CardDescription>
        {currentStep < 4 && <Progress value={progress} className="mt-4" />}
      </CardHeader>
      <CardContent>
        {currentStep === 1 && (
          <div className="space-y-6">
            <h3 className="font-headline text-xl">1. {t.step1Title}</h3>
            <RadioGroup value={isRecurring ? 'monthly' : 'one-time'} onValueChange={(val) => setIsRecurring(val === 'monthly')} className="flex gap-4">
                <Label htmlFor="one-time" className="flex items-center gap-2 p-4 border rounded-md cursor-pointer flex-1 has-[:checked]:bg-accent/20 has-[:checked]:border-accent transition-all">
                    <RadioGroupItem value="one-time" id="one-time" /> {t.oneTime}
                </Label>
                 <Label htmlFor="monthly" className="flex items-center gap-2 p-4 border rounded-md cursor-pointer flex-1 has-[:checked]:bg-accent/20 has-[:checked]:border-accent transition-all">
                    <RadioGroupItem value="monthly" id="monthly" /> {t.monthly}
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
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground rtl:right-3 rtl:left-auto" />
                <Input type="text" placeholder={t.customAmount} value={customAmount} onChange={handleCustomAmountChange} className="pl-10 text-lg h-12 rtl:pr-10 rtl:pl-3" />
            </div>
            <Button size="lg" className="w-full" onClick={() => setCurrentStep(2)} disabled={amount <= 0}>{t.continue}</Button>
          </div>
        )}
        {currentStep === 2 && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleDetailsSubmit)} className="space-y-6">
              <h3 className="font-headline text-xl">{t.step2Title}</h3>
               <FormField
                  control={form.control}
                  name="donorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.fullNameLabel}</FormLabel>
                      <FormControl>
                        <Input placeholder={t.fullNamePlaceholder} {...field} />
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
                      <FormLabel>{t.emailLabel}</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder={t.emailPlaceholder} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <div className="flex justify-between">
                <Button variant="outline" onClick={handlePrev}>{t.back}</Button>
                <Button type="submit">{t.proceedToPayment}</Button>
              </div>
            </form>
          </Form>
        )}
        {currentStep === 3 && (
           <div className="space-y-6">
            <h3 className="font-headline text-xl">{t.step3Title}</h3>
            <p className="text-sm text-muted-foreground">{t.demoText}</p>
            <div className="space-y-2">
                <Label htmlFor="card-number">{t.cardNumber}</Label>
                <Input id="card-number" placeholder="0000 0000 0000 0000" />
            </div>
            <div className="grid grid-cols-3 gap-4">
                 <div className="space-y-2 col-span-2">
                    <Label htmlFor="expiry">{t.expiryDate}</Label>
                    <Input id="expiry" placeholder="MM / YY" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="cvc">{t.cvc}</Label>
                    <Input id="cvc" placeholder="123" />
                </div>
            </div>
             <div className="flex justify-between">
              <Button variant="outline" onClick={handlePrev}>{t.back}</Button>
              <Button onClick={handleConfirmDonation} className="bg-accent text-accent-foreground hover:bg-accent/90" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin rtl:ml-2 rtl:mr-0"/> {t.processing}</> : `${t.confirmDonation} $${amount}`}
              </Button>
            </div>
          </div>
        )}
         {currentStep === 4 && (
           <div className="text-center space-y-6 flex flex-col items-center">
            <CheckCircle className="h-20 w-20 text-green-500" />
            <h3 className="font-headline text-2xl text-primary">{t.step4Title}</h3>
            <p className="text-muted-foreground max-w-md">
                {t.thankYouMessage
                  .replace('{amount}', `$${amount}`)
                  .replace('{isRecurring}', isRecurring ? t.monthlyWord : '')}
            </p>
            <Button variant="outline" onClick={() => { setCurrentStep(1); form.reset(); }}>{t.makeAnotherDonation}</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
