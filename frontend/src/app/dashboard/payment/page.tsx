
'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/lib/constants';
import { fetchWithAuth } from '@/lib/api';
import { CopyableText } from '@/components/copyable-text';

const paymentSchema = z.object({
  transaction_id: z.string().min(1, 'Transaction ID is required.'),
  method: z.enum(['bkash', 'nagad'], {
    errorMap: () => ({ message: 'Please select a payment method.' }),
  }),
  phone: z.string().min(1, 'Phone number is required.'),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

function PaymentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const amount = searchParams.get('amount');
  const paymentType = searchParams.get('type') || 'donation';

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      method: undefined,
    }
  });

  const selectedMethod = form.watch('method');

  const methodDetails: Record<string, { name: string; number: string; sendType: string }> = {
    bkash: { name: 'bKash', number: '01782044801', sendType: 'Send Money' },
    nagad: { name: 'Nagad', number: '01719913297', sendType: 'Send Money' },
  };

  async function onSubmit(data: PaymentFormValues) {
    if (!amount) {
        toast({ variant: 'destructive', title: 'Error', description: 'Amount is missing.' });
        return;
    }

    const paymentData = {
        ...data,
        amount,
        payment_type: paymentType,
    };

    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/api/payment/get-create/`, {
            method: 'POST',
            body: JSON.stringify(paymentData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to create payment.');
        }

        toast({
            title: 'Payment Submitted',
            description: 'Your payment is being processed.',
        });
        
        if (paymentType === 'donation') {
          router.push('/dashboard/donate');
        } else {
          router.push('/dashboard');
        }

    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Submission Failed',
            description: error.message || 'An unexpected error occurred.',
        });
    }
  }

  return (
    <div className="flex justify-center items-center py-12">
        <Card className="w-full max-w-lg">
            <CardHeader>
                <CardTitle>Complete Your Payment</CardTitle>
                <CardDescription>
                    You are paying <span className="font-bold text-primary">{Number(amount).toLocaleString()}tk</span> for <span className="font-bold capitalize">{paymentType}</span>.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="mb-6 p-4 bg-muted rounded-lg text-sm space-y-4">
                    <p className="font-bold">Payment Instructions:</p>
                    <ol className="list-decimal list-inside space-y-3">
                        <li>Select your payment method below (bKash or Nagad).</li>
                        {selectedMethod && (
                            <>
                                <li>
                                    Open your <span className="font-bold text-primary">{methodDetails[selectedMethod].name}</span> App and select <span className="font-bold text-primary">&quot;{methodDetails[selectedMethod].sendType}&quot;</span>.
                                </li>
                                <li>
                                    <span>Send money to this number:</span>
                                    <CopyableText text={methodDetails[selectedMethod].number} />
                                </li>
                                <li>
                                    <span>Enter the amount:</span> <span className="font-bold text-primary">{Number(amount).toLocaleString()}tk</span>
                                </li>
                                <li>Complete the payment and copy the Transaction ID (TrxID).</li>
                            </>
                        )}
                    </ol>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Your Phone Number (used to pay)</FormLabel>
                                <FormControl>
                                    <Input placeholder="The number you paid from" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="method"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Payment Method</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a payment method" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    <SelectItem value="bkash">bKash</SelectItem>
                                    <SelectItem value="nagad">Nagad</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="transaction_id"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Transaction ID (TrxID)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter the TrxID from your bKash message" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? 'Submitting...' : 'Submit Payment'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    </div>
  );
}


export default function PaymentPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PaymentPageContent />
        </Suspense>
    )
}
