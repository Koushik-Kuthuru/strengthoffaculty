
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChange, getUserProfile } from '@/lib/firebase';
import { User } from 'firebase/auth';
import { DashboardLayout } from "@/components/dashboard-layout";
import { TeacherDashboard } from "@/components/teacher-dashboard";
import { InstitutionDashboard } from "@/components/institution-dashboard";
import { Skeleton } from '@/components/ui/skeleton';
import { Logo } from '@/components/logo';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userProfile = await getUserProfile(currentUser.uid);
        setProfile(userProfile);

        if (!userProfile?.role) {
          router.push('/onboarding/role');
        } else if (!userProfile?.profileCompleted) {
          if (userProfile.role === 'teacher') {
            router.push('/onboarding/teacher/profile');
          } else if (userProfile.role === 'institution') {
            router.push('/onboarding/institution/profile');
          }
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
      {profile?.role === 'teacher' && <TeacherDashboard />}
      {profile?.role === 'institution' && <InstitutionDashboard />}
    </DashboardLayout>
  );
}
