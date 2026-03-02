'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/lib/constants';

const registerFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  phone: z.string().min(11, { message: 'Please enter a valid phone number.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  position: z.enum(['founding_member', 'committee_leader', 'general_member', 'school_member'], {
    required_error: 'Please select your membership type.',
  }),
  bloodgroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'other'], {
    required_error: 'Please select your blood group.',
  }),
  unit_name: z.enum(['cumilla_district', 'burichang_upazila', 'debidwer_upazila', 'barura_upazila', 'sadar_dakshin_upazila', 'brahmanpara_upazila', 'comilla_modern_high_school', 'comilla_high_school'], {
    required_error: 'Please select your unit.',
  }),
  religion: z.string().optional(),
  gender: z.enum(['male', 'female', 'other'], { required_error: 'Please select a gender.' }),
  agree: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms.',
  }),
});

type RegisterFormValues = z.infer<typeof registerFormSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    mode: 'onChange',
  });

  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true);

    const { agree, ...payload } = data;

    try {
      const response = await fetch(`${API_BASE_URL}/api/accounts/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: 'Registration Successful',
          description: 'You can now log in with your credentials.',
        });
        router.push('/login');
      } else {
        const errorMessages = Object.entries(result)
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
          .join('\n');
        toast({
          variant: 'destructive',
          title: 'Registration Failed',
          description: errorMessages || 'An unexpected error occurred. Please try again.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request. Please check your connection.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+8801xxxxxxxxx" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Membership Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your membership type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="founding_member">Founding Member (600 TK)</SelectItem>
                  <SelectItem value="committee_leader">Committee Leader (500 TK)</SelectItem>
                  <SelectItem value="general_member">General Member (400 TK)</SelectItem>
                  <SelectItem value="school_member">School Member (300 TK)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="bloodgroup"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Blood Group</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your blood group" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="unit_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit Name</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="cumilla_district">Cumilla District</SelectItem>
                    <SelectItem value="burichang_upazila">Burichang Upazila</SelectItem>
                    <SelectItem value="debidwer_upazila">Debidwer Upazila</SelectItem>
                    <SelectItem value="barura_upazila">Barura Upazila</SelectItem>
                    <SelectItem value="sadar_dakshin_upazila">Sadar Dakshin Upazila</SelectItem>
                    <SelectItem value="brahmanpara_upazila">Brahmanpara Upazila</SelectItem>
                    <SelectItem value="comilla_modern_high_school">Comilla Modern High School</SelectItem>
                    <SelectItem value="comilla_high_school">Comilla High School</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl><RadioGroupItem value="male" /></FormControl>
                      <FormLabel className="font-normal">Male</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl><RadioGroupItem value="female" /></FormControl>
                      <FormLabel className="font-normal">Female</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl><RadioGroupItem value="other" /></FormControl>
                      <FormLabel className="font-normal">Other</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="religion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Religion</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your religion" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="islam">Islam</SelectItem>
                    <SelectItem value="hinduism">Hinduism</SelectItem>
                    <SelectItem value="christianity">Christianity</SelectItem>
                    <SelectItem value="buddhism">Buddhism</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="agree"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  à¦†à¦®à¦¿ à¦à¦‡ à¦®à¦°à§à¦®à§‡ à¦…à¦™à§à¦—à§€à¦•à¦¾à¦° à¦•à¦°à¦›à¦¿ à¦¯à§‡ BYSO à¦‡à¦«à¦¤à¦¾à¦° à¦®à¦¾à¦¹à¦«à¦¿à¦² à§¨à§¦à§¨à§¬ à¦…à¦¨à§à¦·à§à¦ à¦¾à¦¨à§‡ à¦¸à¦‚à¦—à¦ à¦¨à§‡à¦° à¦¸à¦•à¦² à¦¨à§€à¦¤à¦¿à¦®à¦¾à¦²à¦¾ à¦“ à¦¶à§ƒà¦™à§à¦–à¦²à¦¾ à¦®à§‡à¦¨à§‡ à¦šà¦²à¦¬ à¦à¦¬à¦‚ à¦†à¦¯à¦¼à§‹à¦œà¦• à¦•à¦®à¦¿à¦Ÿà¦¿à¦° à¦¨à¦¿à¦°à§à¦¦à§‡à¦¶à¦¨à¦¾ à¦…à¦¨à§à¦¯à¦¾à¦¯à¦¼à§€ à¦…à¦‚à¦¶à¦—à§à¦°à¦¹à¦£ à¦•à¦°à¦¬à¥¤
                </FormLabel>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>
    </Form>
  );
}
