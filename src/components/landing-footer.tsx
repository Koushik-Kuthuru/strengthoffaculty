import Link from 'next/link';
import { Logo } from '@/components/logo';

export function LandingFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-4">
             <Logo />
            <p className="text-sm text-muted-foreground">India’s Faculty, One Network.</p>
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
