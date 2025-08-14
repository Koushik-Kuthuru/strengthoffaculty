
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChange, getUserProfile } from '@/lib/firebase';
import { User } from 'firebase/auth';
import { DashboardLayout } from "@/components/dashboard-layout";
import { InstitutionDashboard } from "@/components/institution-dashboard";
import { TeacherDashboard } from "@/components/teacher-dashboard";
import { Skeleton } from '@/components/ui/skeleton';
import { Logo } from '@/components/logo';


export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const profile = await getUserProfile(currentUser.uid);
        
        if (profile) {
            if (!profile.role) {
                router.push('/onboarding/role');
            } else if (!profile.profileCompleted) {
                router.push(`/onboarding/${profile.role}/profile`);
            } else {
                setUserRole(profile.role);
                setLoading(false);
            }
        } else {
            // New user, profile doesn't exist yet
            router.push('/onboarding/role');
        }

      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);


  if (loading || !userRole) {
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
      {userRole === 'teacher' ? <TeacherDashboard /> : <InstitutionDashboard />}
    </DashboardLayout>
  );
}
