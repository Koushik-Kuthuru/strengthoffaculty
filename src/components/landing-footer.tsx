import Link from 'next/link';
import { Logo } from '@/components/logo';

export function LandingFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="mb-8">
            <Logo />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div>
            <h3 className="mb-4 font-headline font-semibold">General</h3>
            <ul className="space-y-2">
              <li><Link href="/signup" className="text-sm text-muted-foreground hover:text-foreground">Sign Up</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Help Center</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">About</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Press</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Blog</Link></li>
            </ul>
          </div>
           <div>
            <h3 className="mb-4 font-headline font-semibold">Browse</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Learning</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Jobs</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Events</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-headline font-semibold">For Business</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Post a Job</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Marketing</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Analytics</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-headline font-semibold">Directories</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Members</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Jobs</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Institutions</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Topics</Link></li>
            </ul>
          </div>
           <div>
            <h3 className="mb-4 font-headline font-semibold">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms of Use</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          Strength of Faculty © {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
}
