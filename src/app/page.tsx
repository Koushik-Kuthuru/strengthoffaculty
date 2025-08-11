import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LandingHeader } from "@/components/landing-header";
import { LandingFooter } from "@/components/landing-footer";
import { ArrowRight } from "lucide-react";

const SubjectButton = ({ subject }: { subject: string }) => (
  <Button variant="outline" className="rounded-full px-6 py-3 text-lg font-semibold text-muted-foreground hover:bg-primary/10 hover:border-primary/50 transition-all duration-300">
    {subject}
  </Button>
);

function GoogleIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a10 10 0 0 0-9.05 14.26A9.94 9.94 0 0 0 12 22a10 10 0 0 0 9.05-7.74" />
            <path d="M2.95 14.26A10.04 10.04 0 0 1 12 2" />
        </svg>
    )
}

function MicrosoftIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.5,11.5H3v-8h8.5V11.5z M21,3v8.5h-8.5V3H21z M11.5,21h-8v-8h8.5V21z M21,13h-8.5v8H21V13z"/>
        </svg>
    )
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <LandingHeader />
      <main className="flex-1">
        <section className="py-12 md:py-24">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div className="flex flex-col gap-6">
              <h1 className="text-4xl md:text-5xl font-thin leading-tight text-foreground/80 font-headline">
                Welcome to India’s <span className="text-primary font-bold">Teaching Network</span>
              </h1>
              <p className="text-muted-foreground text-lg">Connect. Collaborate. Empower Education.</p>
              <div className="flex flex-col gap-3 max-w-md">
                 <Button size="lg" className="justify-center p-6 rounded-full text-base bg-blue-600 hover:bg-blue-700 text-white">
                    <GoogleIcon className="mr-4 h-6 w-6"/> Continue with Google
                </Button>
                <Button size="lg" variant="outline" className="justify-center p-6 rounded-full text-base">
                   <MicrosoftIcon className="mr-4 h-6 w-6" /> Continue with Microsoft
                </Button>
                 <Button size="lg" variant="outline" className="justify-center p-6 rounded-full text-base">
                   Sign in with email
                </Button>
              </div>
              <p className="text-xs text-muted-foreground max-w-md">
                By continuing, you agree to SoF’s <Link href="#" className="underline">User Terms</Link>, <Link href="#" className="underline">Privacy Policy</Link>, and <Link href="#" className="underline">Code of Conduct</Link>.
              </p>
               <p className="mt-4">
                New to SoF? <Link href="/signup" className="text-primary font-bold hover:underline">Join now</Link>
              </p>
            </div>

            {/* Right Column */}
            <div className="relative h-[400px] md:h-[500px] flex items-center justify-center">
                <Image
                  src="https://placehold.co/700x500.png"
                  alt="Teachers collaborating in a seminar"
                  width={700}
                  height={500}
                  className="rounded-lg shadow-2xl object-cover"
                  data-ai-hint="teacher seminar"
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg"></div>
                 <h2 className="absolute bottom-8 left-8 text-white text-5xl font-light">
                    find your <span className="font-bold">faculty strength</span>
                    <p className="text-lg font-normal mt-2">Connect with top educators across India</p>
                 </h2>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto text-center">
              <h2 className="text-4xl font-thin text-foreground/80 mb-8">
                Explore Faculty Communities by Subject
              </h2>
            <div className="flex flex-wrap gap-4 items-center justify-center">
                <SubjectButton subject="Math" />
                <SubjectButton subject="Science" />
                <SubjectButton subject="English" />
                <SubjectButton subject="History" />
                <SubjectButton subject="Computer Science" />
                <SubjectButton subject="Physical Education" />
                <Button variant="ghost" className="text-primary hover:bg-primary/10">Show all subjects <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
            <p className="mt-8 text-lg text-muted-foreground">Discover educators, share knowledge, and grow your teaching network.</p>
          </div>
        </section>

      </main>
      <LandingFooter />
    </div>
  );
}
