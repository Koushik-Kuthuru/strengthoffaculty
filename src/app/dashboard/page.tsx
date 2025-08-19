
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChange, getUserProfile, auth } from '@/lib/firebase';
import { User } from 'firebase/auth';
import { DashboardLayout } from "@/components/dashboard-layout";
import { TeacherDashboard } from "@/components/teacher-dashboard";
import { InstitutionDashboard } from "@/components/institution-dashboard";
import { Skeleton } from '@/components/ui/skeleton';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { WifiOff } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkUser = async (currentUser: User | null) => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      setUser(currentUser);
      const userProfile = await getUserProfile(currentUser.uid);
      setProfile(userProfile);
    } catch (e: any) {
      if (e.code === 'unavailable') {
        setError("You are offline. Please check your connection and try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (currentUser) => {
      await checkUser(currentUser);
    });

    return () => unsubscribe();
  }, [router]);


  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
            <Logo />
            <Skeleton className="h-4 w-48" />
        </div>
      </div>
    );
  }
  
  if (error) {
     return (
       <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-center">
            <WifiOff className="h-16 w-16 text-destructive" />
            <h1 className="text-xl font-semibold">Connection Error</h1>
            <p className="text-muted-foreground max-w-xs">{error}</p>
            <Button onClick={() => checkUser(auth.currentUser)}>Retry</Button>
        </div>
      </div>
     )
  }

  return (
    <DashboardLayout>
      {profile?.role === 'teacher' && <TeacherDashboard />}
      {profile?.role === 'institution' && <InstitutionDashboard />}
      {!profile?.role && <TeacherDashboard />}
    </DashboardLayout>
  );
}

