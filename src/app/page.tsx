
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LandingHeader } from "@/components/landing-header";
import { LandingFooter } from "@/components/landing-footer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChevronRight } from "lucide-react";


const SubjectButton = ({ subject }: { subject: string }) => (
  <Button variant="outline" className="rounded-full px-6 py-3 text-lg font-semibold text-muted-foreground hover:bg-primary/10 hover:border-primary/50 transition-all duration-300">
    {subject}
  </Button>
);

const TagButton = ({ tag }: { tag: string }) => (
    <Button variant="outline" className="rounded-full px-4 py-2 font-semibold text-muted-foreground hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 m-1">
      {tag}
    </Button>
);

const ActionButton = ({ text }: { text: string }) => (
    <Link
      href="#"
      className="flex justify-between items-center p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors duration-200"
    >
      <span className="font-semibold text-lg text-foreground/80">{text}</span>
      <ChevronRight className="h-6 w-6 text-muted-foreground" />
    </Link>
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
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-center text-center">
              <Image
                src="https://placehold.co/300x200.png"
                width={300}
                height={200}
                alt="Connect with Faculty"
                className="mb-6 rounded-lg"
                data-ai-hint="collaboration meeting"
              />
              <h3 className="text-2xl font-semibold mb-2">Connect with Faculty Who Inspire</h3>
              <p className="text-muted-foreground mb-4 max-w-sm">
                Build meaningful academic connections with faculty who lead in teaching, research, and mentorship.
              </p>
              <Button variant="outline" className="rounded-full">Browse Faculty Directory</Button>
            </div>
            <div className="flex flex-col items-center text-center">
              <Image
                src="https://placehold.co/300x200.png"
                width={300}
                height={200}
                alt="Learn from Educators"
                className="mb-6 rounded-lg"
                data-ai-hint="learning online"
              />
              <h3 className="text-2xl font-semibold mb-2">Learn From World-Class Educators</h3>
              <p className="text-muted-foreground mb-4 max-w-sm">
                Choose your area of interest and explore the faculty guiding students toward success.
              </p>
              <div className="w-full max-w-xs">
                <Select>
                  <SelectTrigger className="rounded-full">
                    <SelectValue placeholder="Select a discipline to explore" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="humanities">Humanities</SelectItem>
                    <SelectItem value="sciences">Sciences</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="interdisciplinary">Interdisciplinary Programs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-muted/30">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 className="text-3xl font-thin text-foreground/80 mb-2">
                       Sharpen your teaching skills with quick activities
                    </h2>
                     <h3 className="text-xl text-muted-foreground mb-4 font-light">Enhance your expertise with daily micro-learning</h3>
                    <p className="text-muted-foreground mb-6">
                        Take a short break to explore subject quizzes, pedagogy tips, or NEP 2020 nuggets curated for teachers.
                    </p>
                     <div className="flex flex-wrap items-center">
                        <TagButton tag="QuizTime" />
                        <TagButton tag="PedagoTips" />
                        <TagButton tag="PolicyPulse" />
                        <TagButton tag="Did You Know?" />
                        <TagButton tag="EduPuzzle" />
                    </div>
                </div>
                 <div className="flex items-center justify-center">
                     <Image
                      src="https://placehold.co/500x300.png"
                      alt="Brain teasers and quizzes"
                      width={500}
                      height={300}
                      className="rounded-lg shadow-xl"
                      data-ai-hint="quiz puzzle"
                    />
                </div>
            </div>
        </section>

        <section className="py-16 md:py-24">
             <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                 <div className="flex items-center justify-center">
                     <Image
                      src="https://placehold.co/500x400.png"
                      alt="Teacher profile on a mobile device"
                      width={500}
                      height={400}
                      className="rounded-lg shadow-xl"
                      data-ai-hint="teacher profile mobile"
                    />
                </div>
                <div>
                    <h2 className="text-3xl font-thin text-foreground/80 mb-2">
                       Let schools and colleges know you're open to teach or mentor
                    </h2>
                     <h3 className="text-xl text-muted-foreground mb-4 font-light">Let the right institutions know you’re open to teach or mentor</h3>
                    <p className="text-muted-foreground mb-6">
                        With the Open to Teach feature, educators can show availability for full-time, part-time, online classes, or mentoring.
                    </p>
                    <Button>Get Started</Button>
                </div>
            </div>
        </section>
        
        <section className="py-16 md:py-24 bg-muted/30">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="flex flex-col gap-4">
                    <h2 className="text-3xl font-thin text-foreground/80 mb-2">
                        Who is our faculty for?
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Anyone seeking transformative learning, mentorship, and real-world impact.
                    </p>
                    <div className="flex flex-col gap-3 mt-4">
                       <ActionButton text="Meet a faculty mentor" />
                       <ActionButton text="Explore teaching & research" />
                       <ActionButton text="Join a program guided by experts" />
                    </div>
                </div>
                 <div className="flex items-center justify-center">
                     <Image
                      src="https://placehold.co/500x400.png"
                      alt="Professors and students interacting on campus"
                      width={500}
                      height={400}
                      className="rounded-lg shadow-xl"
                      data-ai-hint="professors students conversation"
                    />
                </div>
            </div>
        </section>

        <section className="py-16 md:py-32 bg-background">
          <div className="container mx-auto text-center">
            <div className="max-w-4xl mx-auto">
                <Image
                  src="https://placehold.co/1200x400.png"
                  alt="A community of educators and institutions"
                  width={1200}
                  height={400}
                  className="rounded-lg mb-8"
                  data-ai-hint="diverse people community"
                />
            </div>
            <h2 className="text-4xl md:text-5xl font-thin mb-6">Join your colleagues and friends on Strength of Faculty.</h2>
            <Button size="lg" className="rounded-full px-12 py-6 text-xl">Get Started</Button>
          </div>
        </section>

      </main>
      <LandingFooter />
    </div>
  );
}
