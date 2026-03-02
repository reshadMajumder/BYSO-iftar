
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
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
import { useToast } from '@/hooks/use-toast';
import { fetchWithAuth } from '@/lib/api';
import { API_BASE_URL } from '@/lib/constants';

const profileFormSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
    phone: z.string().optional(),
    position: z.enum(['founding_member', 'committee_leader', 'general_member', 'school_member']).nullable().optional(),
    bloodgroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'other']).nullable().optional(),
    unit_name: z.enum(['cumilla_district', 'burichang_upazila', 'debidwer_upazila', 'barura_upazila', 'sadar_dakshin_upazila', 'brahmanpara_upazila', 'comilla_modern_high_school', 'comilla_high_school']).nullable().optional(),
    religion: z.enum(['islam', 'hinduism', 'christianity', 'buddhism', 'other']).nullable().optional(),
    gender: z.enum(['male', 'female', 'other']).nullable().optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;



interface ProfileFormProps {
    defaultValues: Partial<ProfileFormValues>;
}

export default function ProfileForm({ defaultValues }: ProfileFormProps) {
    const { toast } = useToast();
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues,
        mode: 'onChange',
    });

    const { formState: { dirtyFields, isSubmitting } } = form;

    async function onSubmit(data: ProfileFormValues) {
        const changedData: Partial<ProfileFormValues> = {};

        // Only include dirty fields in the submission data
        for (const key in dirtyFields) {
            if (key in data) {
                (changedData as any)[key] = (data as any)[key];
            }
        }

        // If no fields have changed, don't submit.
        if (Object.keys(changedData).length === 0) {
            toast({
                title: 'No changes to save',
                description: 'You haven\'t made any changes to your profile.',
            });
            return;
        }

        try {
            const response = await fetchWithAuth(`${API_BASE_URL}/api/accounts/profile/`, {
                method: 'PUT',
                body: JSON.stringify(changedData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to update profile.');
            }

            toast({
                title: 'Profile Updated!',
                description: 'Your changes have been saved successfully.',
            });
            form.reset(data); // Reset form state with new data to clear dirty fields

        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Update Failed',
                description: error.message || 'An unexpected error occurred.',
            });
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
                                    <Input placeholder="John Doe" {...field} />
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
                                    <Input placeholder="+880123456789" {...field} disabled />
                                </FormControl>
                                <FormDescription>Your phone number cannot be changed.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="bloodgroup"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Blood Group</FormLabel>
                                    <FormControl>
                                            <Input value={field.value ?? defaultValues.bloodgroup ?? ''} disabled />
                                    </FormControl>
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
                                    <FormControl>
                                            <Input value={field.value ? unitNameLabel(field.value) : (defaultValues.unit_name ? unitNameLabel(defaultValues.unit_name) : '')} disabled />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Position</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value ?? ''}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select your position" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="founding_member">Founding Member</SelectItem>
                                    <SelectItem value="committee_leader">Committee Leader</SelectItem>
                                    <SelectItem value="general_member">General Member</SelectItem>
                                    <SelectItem value="school_member">School Member</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormDescription>Your membership position in BYSO.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

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
                                        value={field.value ?? ''}
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="religion"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Religion</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value ?? ''}>
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

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Update Profile'}
                </Button>
            </form>
        </Form>
    );
}

function unitNameLabel(value: string) {
    const labels: Record<string, string> = {
        cumilla_district: 'Cumilla District',
        burichang_upazila: 'Burichang Upazila',
        debidwer_upazila: 'Debidwer Upazila',
        barura_upazila: 'Barura Upazila',
        sadar_dakshin_upazila: 'Sadar Dakshin Upazila',
        brahmanpara_upazila: 'Brahmanpara Upazila',
        comilla_modern_high_school: 'Comilla Modern High School',
        comilla_high_school: 'Comilla High School',
    };
    return labels[value] ?? value;
}
