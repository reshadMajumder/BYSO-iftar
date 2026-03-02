'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ProfileFormValues } from './profile-form';

const POSITION_LABELS: Record<string, string> = {
  founding_member: 'Founding Member',
  committee_leader: 'Committee Leader',
  general_member: 'General Member',
  school_member: 'School Member',
};

interface UserProfileCardProps {
  user: Partial<ProfileFormValues>
}

export default function UserProfileCard({ user }: UserProfileCardProps) {
  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'U';

  return (
    <>
      <CardHeader className="items-center text-center">
        <Avatar className="h-24 w-24 mb-4 border-4 border-primary">
          <AvatarFallback className="text-2xl font-bold">{initials}</AvatarFallback>
        </Avatar>
        <CardTitle className="font-headline text-2xl">{user.name || 'Member'}</CardTitle>
        <CardDescription>
          {user.position ? (
            <Badge variant="secondary">{POSITION_LABELS[user.position] ?? user.position}</Badge>
          ) : (
            'No position assigned'
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-sm text-muted-foreground">{user.phone || 'No phone provided.'}</p>
        {user.bloodgroup && (
          <p className="text-sm mt-2"><strong>Blood Group:</strong> {user.bloodgroup}</p>
        )}
        {user.unit_name && (
          <p className="text-sm mt-2"><strong>Unit Name:</strong> {unitNameLabel(user.unit_name)}</p>
        )}
      </CardContent>
    </>
  );
}

function unitNameLabel(value?: string) {
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
  return value ? labels[value] ?? value : '';
}
