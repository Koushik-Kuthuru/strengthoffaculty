"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Logo } from "@/components/logo";
import { auth } from "@/lib/firebase";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignOut = () => {
    auth.signOut().then(() => {
      router.push("/");
    });
  };

  if (loading) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-accent/10 p-4">
            <div className="w-full max-w-md text-center">
                <div className="mb-6 flex justify-center">
                    <Logo />
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-48 mx-auto" />
                        <Skeleton className="h-4 w-64 mx-auto mt-2" />
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4">
                        <Skeleton className="h-24 w-24 rounded-full" />
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-10 w-24 mt-4" />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
  }

  if (!user) {
    return null; 
  }

  const getInitials = (name: string | null) => {
    if (!name) return "";
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return names[0].substring(0, 2).toUpperCase();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-accent/10 p-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
            <Logo />
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Welcome to your Dashboard</CardTitle>
            <CardDescription>
              You have successfully logged in.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24 text-3xl">
              <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
              <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold">{user.displayName}</h2>
            <p className="text-muted-foreground">{user.email}</p>
            <Button onClick={handleSignOut} className="mt-4">
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
