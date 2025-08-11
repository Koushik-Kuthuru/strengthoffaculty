
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Home, Briefcase, MessageSquare, Bell, Menu, Search, Users, GraduationCap, Moon, Sun } from 'lucide-react';
import { Logo } from './logo';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { setTheme } = useTheme()

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

  const getInitials = (name: string | null) => {
    if (!name) return "";
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return names[0]?.[0]?.toUpperCase() || '';
  }

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Logo />
      </div>
    );
  }
  
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 w-full border-b bg-card">
            <div className="container flex h-16 items-center">
                <div className="mr-4 flex items-center">
                    <Link href="/dashboard" className="mr-2">
                        <GraduationCap className="h-8 w-8 text-primary" />
                    </Link>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                        type="search"
                        placeholder="Search"
                        className="w-full appearance-none bg-background pl-8 shadow-none md:w-[280px] lg:w-[320px]"
                        />
                    </div>
                </div>

                <nav className="flex-1 justify-center hidden md:flex">
                    <div className="flex items-center space-x-6 lg:space-x-8">
                        <Link href="/dashboard" className="flex flex-col items-center text-sm font-medium transition-colors hover:text-primary">
                            <Home className="h-6 w-6" />
                            <span>Home</span>
                        </Link>
                        <Link href="#" className="flex flex-col items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                            <Users className="h-6 w-6" />
                            <span>My Network</span>
                        </Link>
                        <Link href="#" className="flex flex-col items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                            <Briefcase className="h-6 w-6" />
                             <span>Jobs</span>
                        </Link>
                        <Link href="#" className="flex flex-col items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                            <MessageSquare className="h-6 w-6" />
                            <span>Messaging</span>
                        </Link>
                        <Link href="#" className="flex flex-col items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                            <Bell className="h-6 w-6" />
                            <span>Notifications</span>
                        </Link>
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                               <button className="flex flex-col items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                                 <Avatar className="h-6 w-6">
                                    <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                                    <AvatarFallback className="text-xs">{getInitials(user.displayName)}</AvatarFallback>
                                </Avatar>
                                <span>Me</span>
                               </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>
                                    <div className="flex items-center gap-2">
                                         <Avatar className="h-8 w-8">
                                            <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                                            <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold">{user.displayName}</p>
                                            <p className="text-xs text-muted-foreground font-normal">Teacher</p>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Profile</DropdownMenuItem>
                                <DropdownMenuItem>Settings</DropdownMenuItem>
                                <DropdownMenuSub>
                                  <DropdownMenuSubTrigger>
                                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                    <span className="ml-2">Theme</span>
                                  </DropdownMenuSubTrigger>
                                  <DropdownMenuSubContent>
                                    <DropdownMenuItem onClick={() => setTheme("light")}>
                                      Light
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                                      Dark
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTheme("system")}>
                                      System
                                    </DropdownMenuItem>
                                  </DropdownMenuSubContent>
                                </DropdownMenuSub>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleSignOut}>Logout</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </nav>
                <div className="flex items-center space-x-2 md:hidden">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Avatar className="h-8 w-8">
                                <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                                <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                                </Avatar>
                                <span className="sr-only">Toggle user menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                             <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                <span className="ml-2">Theme</span>
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent>
                                <DropdownMenuItem onClick={() => setTheme("light")}>
                                    Light
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("dark")}>
                                    Dark
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("system")}>
                                    System
                                </DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuSub>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleSignOut}>Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
        <main className="container py-8">
            {children}
        </main>
         <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t z-50">
            <nav className="flex justify-around py-2">
                 <Link href="/dashboard" className="flex flex-col items-center text-sm font-medium transition-colors hover:text-primary">
                    <Home className="h-6 w-6" />
                </Link>
                <Link href="#" className="flex flex-col items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                    <Users className="h-6 w-6" />
                </Link>
                <Link href="#" className="flex flex-col items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                    <Briefcase className="h-6 w-6" />
                </Link>
                <Link href="#" className="flex flex-col items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                    <MessageSquare className="h-6 w-6" />
                </Link>
                <Link href="#" className="flex flex-col items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                    <Bell className="h-6 w-6" />
                </Link>
            </nav>
        </footer>
    </div>
  )
}
