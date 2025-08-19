
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChange, setUserRole } from '@/lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Briefcase, User as UserIcon } from 'lucide-react';
import { Logo } from '@/components/logo';

export default function RoleSelectionPage() {
  const router = useRouter();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleRoleSelect = async (role: 'teacher' | 'institution') => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      await setUserRole(user.uid, role);
      if (role === 'teacher') {
        router.push('/onboarding/teacher/profile');
      } else {
        router.push('/onboarding/institution/profile');
      }
    } catch (error) {
      console.error("Failed to set user role:", error);
      // You could show a toast message here
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-4">
      <div className="mb-8">
        <Logo />
      </div>
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Welcome to TeacherConnect!</CardTitle>
          <CardDescription>To get started, please tell us who you are.</CardDescription>
        </CardHeader>
      </Card>
      <div className="mt-8 grid w-full max-w-lg grid-cols-1 gap-6 md:grid-cols-2">
        <Card 
          className="cursor-pointer hover:border-primary hover:shadow-lg transition-all"
          onClick={() => !isSubmitting && handleRoleSelect('teacher')}
        >
          <CardHeader className="flex flex-col items-center justify-center p-8 text-center">
            <UserIcon className="h-12 w-12 mb-4 text-primary" />
            <h3 className="text-lg font-semibold">I am a Teacher</h3>
            <p className="text-sm text-muted-foreground mt-2">Looking for job opportunities, networking, and resources.</p>
          </CardHeader>
        </Card>
        <Card 
          className="cursor-pointer hover:border-primary hover:shadow-lg transition-all"
          onClick={() => !isSubmitting && handleRoleSelect('institution')}
        >
          <CardHeader className="flex flex-col items-center justify-center p-8 text-center">
            <Briefcase className="h-12 w-12 mb-4 text-primary" />
            <h3 className="text-lg font-semibold">I am an Institution</h3>
            <p className="text-sm text-muted-foreground mt-2">Looking to hire qualified educators and manage job postings.</p>
          </CardHeader>
        </Card>
      </div>
       {isSubmitting && <Loader2 className="h-8 w-8 animate-spin mt-8" />}
    </div>
  );
}
