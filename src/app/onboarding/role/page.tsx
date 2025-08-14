
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { auth, setUserRole } from '@/lib/firebase';
import { User, Briefcase, GraduationCap, Loader2 } from 'lucide-react';
import { Logo } from '@/components/logo';

export default function RoleSelectionPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loadingRole, setLoadingRole] = useState<string | null>(null);

  const handleRoleSelect = async (role: 'teacher' | 'institution') => {
    setLoadingRole(role);
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to select a role.',
      });
      router.push('/login');
      return;
    }

    try {
      await setUserRole(currentUser.uid, role);
      router.push(`/onboarding/${role}/profile`);
    } catch (error) {
      console.error('Role selection error:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem setting your role. Please try again.',
      });
      setLoadingRole(null);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20 p-4">
      <div className="w-full max-w-md text-center">
         <div className="mb-8 flex justify-center">
            <Logo />
         </div>
        <Card className="text-left">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-center">Welcome to the Network!</CardTitle>
            <CardDescription className="text-center">
              To get started, please tell us who you are.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-auto p-6 flex flex-col gap-2 items-center justify-center"
              onClick={() => handleRoleSelect('teacher')}
              disabled={!!loadingRole}
            >
              {loadingRole === 'teacher' ? (
                 <Loader2 className="h-8 w-8 animate-spin" />
              ) : (
                <GraduationCap className="h-8 w-8 text-primary" />
              )}
              <span className="font-semibold text-lg">I am a Teacher</span>
              <p className="text-xs text-muted-foreground text-center">Create a profile, showcase your skills, and find jobs.</p>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-6 flex flex-col gap-2 items-center justify-center"
              onClick={() => handleRoleSelect('institution')}
              disabled={!!loadingRole}
            >
              {loadingRole === 'institution' ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : (
                <Briefcase className="h-8 w-8 text-primary" />
              )}
              <span className="font-semibold text-lg">I am an Institution</span>
               <p className="text-xs text-muted-foreground text-center">Post jobs, find talent, and build your team.</p>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
