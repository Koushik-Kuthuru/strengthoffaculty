import Link from 'next/link';
import { Logo } from '@/components/logo';
import { GraduationCap } from 'lucide-react';

export function LandingFooter() {
  return (
    <footer className="border-t bg-accent/10">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-4">
             <div className="flex items-center justify-start gap-2" aria-label="Strength of Faculty home">
                <GraduationCap className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold font-headline text-foreground">Strength of Faculty</span>
            </div>
            <p className="text-sm text-muted-foreground">Connecting India's educators with opportunities.</p>
          </div>
          <div>
            <h3 className="mb-4 font-headline font-semibold">Platform</h3>
            <ul className="space-y-2">
              <li><Link href="/#features" className="text-sm text-muted-foreground hover:text-foreground">Features</Link></li>
              <li><Link href="/signup" className="text-sm text-muted-foreground hover:text-foreground">For Teachers</Link></li>
              <li><Link href="/signup" className="text-sm text-muted-foreground hover:text-foreground">For Institutions</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-headline font-semibold">Company</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">About Us</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Blog</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-headline font-semibold">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Strength of Faculty. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
