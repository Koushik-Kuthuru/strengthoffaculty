
"use client";

import { AppLayout } from "@/components/app-layout";
import { User, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Rss, Video, Image as ImageIcon, FileText, Bookmark, Users } from "lucide-react";
import { Separator } from "@/components/ui/separator";

function FeedPageContent() {
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
      {/* Left Column */}
      <div className="md:col-span-3 lg:col-span-3 space-y-6">
        <Card className="overflow-hidden">
            <div className="h-16 bg-muted"></div>
            <CardHeader className="flex flex-col items-center text-center -mt-12">
                 <Avatar className="h-24 w-24 text-3xl border-4 border-card">
                    <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || 'User'} />
                    <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl mt-2">{user?.displayName}</CardTitle>
                <CardDescription className="text-sm">Student at St. Martin's Engineering College, Hyderabad</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="text-sm py-4 space-y-2">
                <div className="flex justify-between">
                    <p className="text-muted-foreground">Profile viewers</p>
                    <p className="font-semibold text-primary">94</p>
                </div>
                 <div className="flex justify-between">
                    <p className="text-muted-foreground">Post impressions</p>
                    <p className="font-semibold text-primary">83</p>
                </div>
            </CardContent>
            <Separator />
            <CardContent className="py-4">
                <p className="text-xs text-muted-foreground">Access exclusive tools & insights</p>
                <Button variant="link" className="p-0 h-auto text-sm">Try Premium for free</Button>
            </CardContent>
            <Separator/>
            <CardContent className="py-4 flex items-center gap-2">
                <Bookmark className="h-4 w-4 text-muted-foreground"/>
                <p className="text-sm font-semibold">My items</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader><CardTitle className="text-base">Recent</CardTitle></CardHeader>
             <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2"><Users className="h-4 w-4"/> Education</p>
                <p className="flex items-center gap-2"><Users className="h-4 w-4"/> TeachingJobs</p>
                <p className="flex items-center gap-2"><Users className="h-4 w-4"/> India</p>
            </CardContent>
        </Card>
      </div>

      {/* Center Column */}
      <div className="md:col-span-6 lg:col-span-6 space-y-6">
        <Card>
            <CardContent className="p-4">
                <div className="flex items-center gap-4">
                    <Avatar>
                        <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || 'User'} />
                        <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" className="flex-1 justify-start rounded-full text-muted-foreground">Start a post</Button>
                </div>
                <div className="flex justify-around mt-4">
                    <Button variant="ghost" size="sm"><Video className="text-blue-500" /> Video</Button>
                    <Button variant="ghost" size="sm"><ImageIcon className="text-green-500"/> Photo</Button>
                    <Button variant="ghost" size="sm"><FileText className="text-yellow-500"/> Article</Button>
                </div>
            </CardContent>
        </Card>
        <div className="flex items-center gap-2">
            <Separator className="flex-1"/>
            <span className="text-xs text-muted-foreground">Sort by: Top</span>
        </div>
        <Card>
            <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar>
                     <AvatarImage src="https://placehold.co/40x40.png" alt="User avatar" data-ai-hint="person face" />
                    <AvatarFallback>HG</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                     <p className="font-semibold">Hardik Gothwal</p>
                     <p className="text-xs text-muted-foreground">Full Stack & AI-Focused Software Engineer | 2d ago</p>
                  </div>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-sm mb-4">I just built a fun project where I recreated the famous "invisible cloak" illusion in real-time using computer vision. How it works: ...more</p>
                <img src="https://placehold.co/600x400.png" alt="Project post" className="rounded-lg" data-ai-hint="person holding cloth"/>
            </CardContent>
        </Card>
      </div>

      {/* Right Column */}
      <div className="md:col-span-3 lg:col-span-3 space-y-6">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Faculty News</CardTitle>
                <Rss className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-start gap-2">
                    <div className="font-semibold text-sm">▸</div>
                    <div>
                        <p className="font-semibold text-sm">Mumbai rains: Flights delayed, offices...</p>
                        <p className="text-xs text-muted-foreground">7h ago • 22,446 readers</p>
                    </div>
                </div>
                <div className="flex items-start gap-2">
                    <div className="font-semibold text-sm">▸</div>
                    <div>
                        <p className="font-semibold text-sm">'Skibidi,' 'delulu' join dictionary</p>
                        <p className="text-xs text-muted-foreground">3h ago • 21,808 readers</p>
                    </div>
                </div>
                 <div className="flex items-start gap-2">
                    <div className="font-semibold text-sm">▸</div>
                    <div>
                        <p className="font-semibold text-sm">India's next semiconductor leap</p>
                        <p className="text-xs text-muted-foreground">5h ago • 345 readers</p>
                    </div>
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Suggested Institutions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                    <Avatar>
                        <AvatarImage src="https://placehold.co/40x40.png" alt="school logo" data-ai-hint="school building" />
                        <AvatarFallback>IS</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold text-sm">International School</p>
                        <Button variant="outline" size="sm" className="mt-1 h-8 rounded-full">Follow</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}


export default function FeedPage() {
    return (
        <AppLayout>
            <FeedPageContent />
        </AppLayout>
    )
}
