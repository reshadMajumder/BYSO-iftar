
'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { ProfileFormValues } from '../profile/_components/profile-form';

const UNIT_NAME_LABELS: Record<string, string> = {
  cumilla_district: 'Cumilla District',
  burichang_upazila: 'Burichang Upazila',
  debidwer_upazila: 'Debidwer Upazila',
  barura_upazila: 'Barura Upazila',
  sadar_dakshin_upazila: 'Sadar Dakshin Upazila',
  brahmanpara_upazila: 'Brahmanpara Upazila',
  comilla_modern_high_school: 'Comilla Modern High School',
  comilla_high_school: 'Comilla High School',
};

interface UserProfileProps {
  user: Partial<ProfileFormValues> & { profile_image?: string; batch?: string | number };
}

export default function UserProfile({ user }: UserProfileProps) {
  return (
    <Card className="shadow-lg h-full">
      <CardHeader className="items-center text-center">
        <Avatar className="h-24 w-24 mb-4 border-4 border-primary">
          <AvatarImage src={user.profile_image} alt={user.name} />
          <AvatarFallback>{user.name ? user.name.split(' ').map(n => n[0]).join('') : 'U'}</AvatarFallback>
        </Avatar>
        <CardTitle className="font-headline text-2xl">{user.name}</CardTitle>
        <CardDescription>Batch of {user.batch}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-center">
        <p className="text-muted-foreground">{user.phone || 'No phone provided'}</p>
        {user.bloodgroup && (
          <div className="flex justify-between px-2">
            <span className="font-medium text-foreground">Blood Group</span>
            <span className="text-muted-foreground">{user.bloodgroup}</span>
          </div>
        )}
        {user.unit_name && (
          <div className="flex justify-between px-2">
            <span className="font-medium text-foreground">Unit</span>
            <span className="text-muted-foreground">{UNIT_NAME_LABELS[user.unit_name] ?? user.unit_name}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
