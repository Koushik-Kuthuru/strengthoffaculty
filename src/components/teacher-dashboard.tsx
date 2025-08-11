
"use client";

import { User, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { MapPin } from "lucide-react";

export function TeacherDashboard() {
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
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-8 mt-6">
      <div className="lg:col-span-1">
        <Card>
            <CardHeader className="flex flex-col items-center text-center">
                 <Avatar className="h-24 w-24 text-3xl mb-2">
                    <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || 'User'} />
                    <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{user?.displayName}</CardTitle>
                <CardDescription>Math Teacher - Mumbai, India</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 text-sm">
                <Button variant="outline">My Profile</Button>
                <Button variant="ghost" className="justify-start">My Applications</Button>
                <Button variant="ghost" className="justify-start">Saved Jobs</Button>
                <Button variant="ghost" className="justify-start">Followed Institutions</Button>
            </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
         <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Job Recommendations</CardTitle>
                    <CardDescription>Based on your profile and preferences.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <Avatar className="mt-1">
                                <AvatarImage src="https://placehold.co/40x40.png" alt="school logo" data-ai-hint="school logo"/>
                                <AvatarFallback>VIS</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="font-semibold">Physics Teacher</p>
                                <p className="text-sm text-muted-foreground">Vidya International School</p>
                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="h-3 w-3" /> Mumbai, India</p>
                            </div>
                            <Button>Apply Now</Button>
                        </div>
                         <div className="flex items-start gap-4">
                            <Avatar className="mt-1">
                                <AvatarImage src="https://placehold.co/40x40.png" alt="school logo" data-ai-hint="school building" />
                                <AvatarFallback>DPS</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="font-semibold">Chemistry Teacher</p>
                                <p className="text-sm text-muted-foreground">Delhi Public School</p>
                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="h-3 w-3" /> Delhi, India</p>
                            </div>
                            <Button>Apply Now</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Activity Feed</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-start gap-4">
                      <Avatar>
                         <AvatarImage src="https://placehold.co/40x40.png" alt="Institution logo" data-ai-hint="school logo"/>
                        <AvatarFallback>VI</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                         <div className="flex justify-between items-center">
                           <p className="font-semibold">Vidya International School</p>
                            <p className="text-xs text-muted-foreground">1d ago</p>
                        </div>
                        <p className="mt-1 text-sm">We're hiring a new Physics teacher for our Mumbai campus! Apply now. #Hiring #Jobs</p>
                        <Badge variant="secondary" className="mt-2">New Job Posting</Badge>
                      </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>

      <div className="hidden lg:block lg:col-span-1">
        <div className="space-y-6">
            <Card>
                <CardHeader><CardTitle>Suggested Institutions</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                        <Avatar>
                            <AvatarImage src="https://placehold.co/40x40.png" alt="school logo" data-ai-hint="school building" />
                            <AvatarFallback>IS</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">International School</p>
                            <p className="text-sm text-muted-foreground">Education</p>
                        </div>
                        <Button variant="outline" size="sm" className="ml-auto">Follow</Button>
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader><CardTitle>Trending Resources</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                   <p className="text-sm font-medium hover:underline cursor-pointer">New classroom management techniques</p>
                   <p className="text-sm font-medium hover:underline cursor-pointer">Guide to online teaching tools</p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
