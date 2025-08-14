
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChange, getUserProfile } from '@/lib/firebase';
import { User } from 'firebase/auth';
import { DashboardLayout } from "@/components/dashboard-layout";
import { TeacherDashboard } from "@/components/teacher-dashboard";
import { Skeleton } from '@/components/ui/skeleton';
import { Logo } from '@/components/logo';


export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const profile = await getUserProfile(currentUser.uid);
        
        if (profile && !profile.profileCompleted) {
            router.push('/onboarding/teacher/profile');
        } else {
            setLoading(false);
        }
      } else {
        router.push('/login');
      }
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

  return (
    <DashboardLayout>
      <TeacherDashboard />
    </DashboardLayout>
  );
}
