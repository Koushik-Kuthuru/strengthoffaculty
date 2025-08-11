import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LandingHeader } from "@/components/landing-header";
import { LandingFooter } from "@/components/landing-footer";
import { ArrowRight } from "lucide-react";

const TopicButton = ({ topic }: { topic: string }) => (
  <Button variant="outline" className="rounded-full px-6 py-3 text-lg font-semibold text-muted-foreground hover:bg-accent/40 hover:border-primary/50 transition-all duration-300">
    {topic}
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


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <LandingHeader />
      <main className="flex-1">
        <section className="py-12 md:py-24">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div className="flex flex-col gap-6">
              <h1 className="text-4xl md:text-6xl font-thin leading-tight text-foreground/80">
                With you every step of your career
              </h1>
              <div className="flex flex-col gap-3 max-w-md">
                 <Button size="lg" className="justify-start p-6 rounded-full text-base bg-blue-600 hover:bg-blue-700 text-white">
                    <GoogleIcon className="mr-4 h-6 w-6"/> Continue with Google
                </Button>
                <Button size="lg" variant="outline" className="justify-start p-6 rounded-full text-base">
                   Sign in with email
                </Button>
              </div>
              <p className="text-xs text-muted-foreground max-w-md">
                By clicking Continue to join or sign in, you agree to Strength of Faculty&apos;s User Agreement, Privacy Policy, and Cookie Policy.
              </p>
               <p className="mt-4">
                New to Strength of Faculty? <Link href="/signup" className="text-primary font-bold hover:underline">Join now</Link>
              </p>
            </div>

            {/* Right Column */}
            <div className="relative h-[400px] md:h-[500px] flex items-center justify-center">
                <Image
                  src="https://placehold.co/700x500.png"
                  alt="Two professionals in a discussion"
                  width={700}
                  height={500}
                  className="rounded-lg shadow-2xl object-cover"
                  data-ai-hint="professionals discussion"
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
                 <h2 className="absolute bottom-8 left-8 text-white text-5xl font-light">
                    find your <span className="font-bold">in</span>
                 </h2>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-accent/10">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-5">
              <h2 className="text-4xl font-thin text-foreground/80">
                Explore top educational content
              </h2>
              <p className="mt-4 text-muted-foreground">
                Discover relevant posts and expert insights — curated by topic and in one place.
              </p>
            </div>
            <div className="md:col-span-7 flex flex-wrap gap-3 items-center justify-start">
                <TopicButton topic="Curriculum Design" />
                <TopicButton topic="Classroom Management" />
                <TopicButton topic="EdTech" />
                <TopicButton topic="Pedagogy" />
                <TopicButton topic="Professional Development" />
                <TopicButton topic="Education Policy" />
                <TopicButton topic="Further Education" />
                <Button variant="ghost" className="text-primary hover:bg-accent/20">Show all <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        </section>

      </main>
      <LandingFooter />
    </div>
  );
}
