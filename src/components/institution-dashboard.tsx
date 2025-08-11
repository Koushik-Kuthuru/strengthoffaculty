
"use client";

import { User, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { Rss, FileText, PlusCircle, Users } from "lucide-react";
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
                    <AvatarImage src="https://placehold.co/100x100.png" alt={user?.displayName || 'Institution'} data-ai-hint="school logo" />
                    <AvatarFallback>VI</AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl mt-2">{user?.displayName || 'Vidya International School'}</CardTitle>
                <CardDescription className="text-sm">Higher Education, Mumbai</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="text-sm py-4 space-y-2">
                <div className="flex justify-between">
                    <p className="text-muted-foreground">Followers</p>
                    <p className="font-semibold text-primary">1,204</p>
                </div>
                 <div className="flex justify-between">
                    <p className="text-muted-foreground">Job Post Views</p>
                    <p className="font-semibold text-primary">8,421</p>
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader><CardTitle className="text-base">Manage</CardTitle></CardHeader>
             <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>My Jobs</p>
                <p>Applications</p>
                <p>Saved Teachers</p>
             </CardContent>
        </Card>
      </div>

      <div className="md:col-span-6 lg:col-span-6 space-y-6">
        <Card>
            <CardContent className="p-4">
                <div className="flex items-center gap-4">
                    <Avatar>
                        <AvatarImage src="https://placehold.co/40x40.png" alt={user?.displayName || 'Institution'} data-ai-hint="school building" />
                        <AvatarFallback>VI</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" className="flex-1 justify-start rounded-full text-muted-foreground">Share an update</Button>
                </div>
                 <div className="flex justify-around mt-4">
                    <Button variant="ghost" size="sm"><PlusCircle className="text-primary"/> Post a Job</Button>
                    <Button variant="ghost" size="sm"><FileText className="text-yellow-500"/> Write an Article</Button>
                </div>
            </CardContent>
        </Card>
        <div className="flex items-center gap-2">
            <Separator className="flex-1"/>
            <span className="text-xs text-muted-foreground">Sort by: Recent</span>
        </div>
        <Card>
            <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar>
                     <AvatarImage src="https://placehold.co/40x40.png" alt="Institution logo" data-ai-hint="school logo"/>
                    <AvatarFallback>VI</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                     <p className="font-semibold">Vidya International School</p>
                     <p className="text-xs text-muted-foreground">Posted 2d ago</p>
                  </div>
                </div>
            </CardHeader>
            <CardContent>
                <p className="font-semibold">We are hiring a Physics Teacher!</p>
                <p className="text-sm mt-2">Our Mumbai campus is looking for an experienced Physics teacher to join our team. Competitive salary and benefits.</p>
                <Badge variant="secondary" className="mt-2">32 Applicants</Badge>
            </CardContent>
        </Card>
      </div>

      <div className="md:col-span-3 lg:col-span-3 space-y-6">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Education News</CardTitle>
                <Rss className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-start gap-2">
                    <div className="font-semibold text-sm">▸</div>
                    <div>
                        <p className="font-semibold text-sm">New education policy announced</p>
                        <p className="text-xs text-muted-foreground">1h ago • 12,321 readers</p>
                    </div>
                </div>
                 <div className="flex items-start gap-2">
                    <div className="font-semibold text-sm">▸</div>
                    <div>
                        <p className="font-semibold text-sm">AI in classrooms: The future</p>
                        <p className="text-xs text-muted-foreground">8h ago • 5,432 readers</p>
                    </div>
                </div>
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle className="text-base">Suggested Teachers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                    <Avatar>
                        <AvatarImage src="https://placehold.co/40x40.png" alt="teacher photo" data-ai-hint="teacher portrait" />
                        <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold text-sm">Anjali Desai</p>
                         <p className="text-xs text-muted-foreground">Physics Teacher</p>
                        <Button variant="outline" size="sm" className="mt-1 h-8 rounded-full"> <Users className="mr-2 h-4 w-4" /> Connect</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
