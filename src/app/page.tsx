import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LandingHeader } from "@/components/landing-header";
import { LandingFooter } from "@/components/landing-footer";
import { Briefcase, Users, Sparkles, BookOpen, Building, Search, ArrowRight } from 'lucide-react';

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
    <CardHeader>
      <div className="mx-auto bg-accent/20 p-4 rounded-full w-fit">
        {icon}
      </div>
      <CardTitle className="font-headline mt-4">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <LandingHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-accent/10">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold font-headline leading-tight">
              Strength of Faculty
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              The ultimate platform for teachers to find their dream jobs and for institutions to hire qualified faculty.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/signup">Join Now <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">Explore Features</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Who is it for Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center font-headline">Who is Strength of Faculty For?</h2>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><BookOpen className="text-primary"/> Find a Teaching Job</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Browse thousands of openings, build your professional profile, and connect with institutions across India.</p>
                </CardContent>
              </Card>
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Building className="text-primary"/> Hire Qualified Faculty</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Post job openings, search our extensive database of teacher profiles, and find the perfect fit for your institution.</p>
                </CardContent>
              </Card>
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Search className="text-primary"/> Access Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Stay updated with the latest in education, share resources, and grow your professional network.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24 bg-accent/10">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center font-headline">Everything You Need to Succeed</h2>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Briefcase className="h-8 w-8 text-primary" />}
                title="Advanced Job Search"
                description="Filter jobs by subject, location, salary, and job type to find your perfect match."
              />
              <FeatureCard 
                icon={<Users className="h-8 w-8 text-primary" />}
                title="Build Your Network"
                description="Follow institutions and educators. Share updates and build your professional presence."
              />
              <FeatureCard 
                icon={<Sparkles className="h-8 w-8 text-primary" />}
                title="AI-Powered Matching"
                description="Our smart AI analyzes your profile to suggest the most relevant job opportunities for you."
              />
            </div>
          </div>
        </section>

        {/* Activity Showcase Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center font-headline">See The Platform in Action</h2>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold font-headline">A Dynamic Professional Feed</h3>
                <p className="text-muted-foreground">Stay informed with a personalized feed of posts from the institutions and educators you follow. Share your achievements, teaching resources, or educational insights.</p>
                <Card className="shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src="https://placehold.co/40x40.png" alt="User avatar" data-ai-hint="teacher portrait" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                           <p className="font-semibold">Jyoti Desai</p>
                           <p className="text-xs text-muted-foreground">2h ago</p>
                        </div>
                        <p className="mt-1 text-sm">Excited to share a new resource I created for teaching Python to beginners! #Education #Coding</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                 <Card className="shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar>
                         <AvatarImage src="https://placehold.co/40x40.png" alt="Institution logo" data-ai-hint="school logo"/>
                        <AvatarFallback>VI</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                         <div className="flex justify-between items-center">
                           <p className="font-semibold">Vidya International School</p>
                            <p className="text-xs text-muted-foreground">1d ago</p>
                        </div>
                        <p className="mt-1 text-sm">We're hiring a new Physics teacher for our Mumbai campus! Apply now. #Hiring #Jobs</p>
                        <Badge variant="secondary" className="mt-2">New Job Posting</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div>
                <Image
                  src="https://placehold.co/600x450.png"
                  alt="Illustration of teachers collaborating"
                  width={600}
                  height={450}
                  className="rounded-lg shadow-xl"
                  data-ai-hint="teacher collaboration"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
