import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Menu, Briefcase, Users, Rss, GraduationCap } from 'lucide-react';

export function LandingHeader() {
  const navLinks = [
    { href: "#", label: "Jobs", icon: <Briefcase /> },
    { href: "#", label: "People", icon: <Users /> },
    { href: "#", label: "News", icon: <Rss /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6">
             <div className="flex items-center justify-center gap-2" aria-label="Strength of Faculty home">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="hidden items-center gap-6 text-sm md:flex">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="flex flex-col items-center gap-1 text-foreground/60 transition-colors hover:text-foreground/80">
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
          </nav>
          <div className="hidden items-center gap-2 md:flex ml-6">
            <Button variant="ghost" asChild>
              <Link href="/signup" className="text-lg">Join now</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/login" className="text-lg px-6 py-3 rounded-full">Sign In</Link>
            </Button>
          </div>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col gap-4 p-4">
                  <Logo />
                  <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="text-foreground/80 transition-colors hover:text-foreground flex items-center gap-2">
                       {link.icon} {link.label}
                    </Link>
                  ))}
                  </nav>
                  <div className="mt-4 flex flex-col gap-2">
                     <Button variant="ghost" asChild>
                      <Link href="/login">Sign In</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/signup">Join Now</Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
