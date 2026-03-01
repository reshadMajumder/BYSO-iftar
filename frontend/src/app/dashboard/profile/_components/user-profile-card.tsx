
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
      </CardContent>
    </>
  );
}
