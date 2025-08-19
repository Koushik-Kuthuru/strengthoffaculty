
"use client";

import { User, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { Rss, Briefcase, Users, PlusCircle } from "lucide-react";
import { Separator } from "./ui/separator";

export function InstitutionDashboard() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, []);

  const getInitials = (name: string | null) => {
    if (!name) return "";
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return names[0]?.[0]?.toUpperCase() || '';
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      <div className="md:col-span-3 lg:col-span-3 space-y-6">
        <Card className="overflow-hidden">
            <div className="h-16 bg-muted"></div>
            <CardHeader className="flex flex-col items-center text-center -mt-12">
                 <Avatar className="h-24 w-24 text-3xl border-4 border-card">
                    <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || 'User'} />
                    <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl mt-2">{user?.displayName || "Vidya International School"}</CardTitle>
                <CardDescription className="text-sm">Education Management</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="text-sm py-4 space-y-2">
                <div className="flex justify-between">
                    <p className="text-muted-foreground">Profile viewers</p>
                    <p className="font-semibold text-primary">128</p>
                </div>
                 <div className="flex justify-between">
                    <p className="text-muted-foreground">Job views</p>
                    <p className="font-semibold text-primary">1,204</p>
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader><CardTitle className="text-base">Manage</CardTitle></CardHeader>
             <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>Company Page</p>
                <p>Job Postings</p>
                <p>Analytics</p>
            </CardContent>
        </Card>
      </div>

      <div className="md:col-span-6 lg:col-span-6 space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Welcome, {user?.displayName || "Institution"}</CardTitle>
                <CardDescription>Manage your job postings and find the best talent.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button className="w-full">
                    <PlusCircle className="mr-2"/>
                    Post a Job
                </Button>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Active Job Postings</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-semibold">Physics Teacher</p>
                        <p className="text-sm text-muted-foreground">Mumbai, Full-time</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-muted-foreground">Applicants</p>
                        <p className="font-semibold text-lg">28</p>
                    </div>
                </div>
                <Separator className="my-4"/>
                 <div className="flex items-center justify-between">
                    <div>
                        <p className="font-semibold">Head of Department - Arts</p>
                        <p className="text-sm text-muted-foreground">Delhi, Full-time</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-muted-foreground">Applicants</p>
                        <p className="font-semibold text-lg">12</p>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>

      <div className="md:col-span-3 lg:col-span-3 space-y-6">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Suggested Candidates</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                    <Avatar>
                         <AvatarImage src="https://placehold.co/40x40.png" alt="user avatar" data-ai-hint="person face" />
                        <AvatarFallback>AP</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold text-sm">Ananya Patel</p>
                        <p className="text-xs text-muted-foreground">M.Sc Physics, 5+ years exp.</p>
                    </div>
                </div>
                 <div className="flex items-center gap-4">
                    <Avatar>
                        <AvatarImage src="https://placehold.co/40x40.png" alt="user avatar" data-ai-hint="person face portrait" />
                        <AvatarFallback>RK</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold text-sm">Rohan Kumar</p>
                        <p className="text-xs text-muted-foreground">PhD English, 10+ years exp.</p>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
