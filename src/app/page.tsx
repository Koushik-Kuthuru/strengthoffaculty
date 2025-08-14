
"use client";

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
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";
import { signInWithGoogle, signUpWithEmailPassword, signInWithEmailPassword, sendPasswordReset } from "@/lib/firebase";
import { FirebaseError } from "firebase/app";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Eye, EyeOff } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";


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


function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" {...props}>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
      <path fill="none" d="M0 0h48v48H0z" />
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

const PasswordStrength = ({ value, label }: { value: number, label: string }) => {
  const strengthColor = useMemo(() => {
    if (value < 33) return 'bg-red-500';
    if (value < 66) return 'bg-yellow-500';
    return 'bg-green-500';
  }, [value]);

  return (
    <div>
      <Progress value={value} className="h-2" indicatorClassName={strengthColor} />
      <p className="text-sm mt-1">{label}</p>
    </div>
  );
};

const Requirement = ({ met, text }: { met: boolean; text: string }) => (
  <div className={`flex items-center text-sm ${met ? 'text-green-600' : 'text-muted-foreground'}`}>
    {met ? <CheckCircle className="mr-2 h-4 w-4" /> : <XCircle className="mr-2 h-4 w-4" />}
    {text}
  </div>
);


const LoginForm = ({ onSignupClick, onForgotPasswordClick, onModalClose }: { onSignupClick: () => void, onForgotPasswordClick: () => void, onModalClose: () => void }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailPassword(email, password);
      router.push('/dashboard');
      onModalClose();
    } catch (error) {
       console.error("Error signing in with email: ", error);
       if (error instanceof FirebaseError) {
         toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: error.message,
        });
      }
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      router.push('/dashboard');
      onModalClose();
    } catch (error) {
      if (error instanceof FirebaseError && (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request')) {
        console.log("Sign-in popup closed by user.");
        return;
      }
      console.error("Error signing in with Google: ", error);
       if (error instanceof FirebaseError) {
         toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: error.message,
        });
      }
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-2xl font-headline text-center">Welcome Back</DialogTitle>
        <DialogDescription className="text-center">
          Sign in to continue to your Strength of Faculty account.
        </DialogDescription>
      </DialogHeader>
      <div className="px-6 pb-6">
        <form className="grid gap-4" onSubmit={handleEmailSignIn}>
            <div className="grid gap-2">
            <Label htmlFor="email-login">Email</Label>
            <Input id="email-login" type="email" placeholder="name@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="grid gap-2">
            <div className="flex items-center">
                <Label htmlFor="password-login">Password</Label>
                <Button variant="link" type="button" className="ml-auto p-0 h-auto text-sm underline" onClick={onForgotPasswordClick}>
                  Forgot your password?
                </Button>
            </div>
             <div className="relative">
                <Input id="password-login" type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 h-full -translate-y-1/2 px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 transition-all duration-300" />
                  ) : (
                    <Eye className="h-4 w-4 transition-all duration-300" />
                  )}
                   <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full">
            Sign In
            </Button>
            <Button variant="outline" className="w-full" type="button" onClick={handleGoogleSignIn}>
              <GoogleIcon className="mr-2 h-4 w-4" />
              Sign in with Google
            </Button>
        </form>
        <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Button variant="link" className="p-0 h-auto underline" onClick={onSignupClick}>
              Sign up
            </Button>
        </div>
      </div>
    </DialogContent>
  );
};


const SignupForm = ({ onLoginClick, onModalClose }: { onLoginClick: () => void, onModalClose: () => void }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordRequirements = useMemo(() => {
    const hasLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*]/.test(password);

    const metCount = [hasLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
    const strength = (metCount / 5) * 100;
    
    let strengthLabel = "Weak";
    if (strength > 33 && strength < 100) strengthLabel = "Medium";
    if (strength === 100) strengthLabel = "Strong";
    if (password.length === 0) strengthLabel = "";

    return { strength, strengthLabel, hasLength, hasUpper, hasLower, hasNumber, hasSpecial };
  }, [password]);


  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords do not match.",
        description: "Please ensure your passwords match before proceeding."
      });
      return;
    }
    if (passwordRequirements.strength < 100) {
       toast({
        variant: "destructive",
        title: "Weak Password",
        description: "Please ensure all password requirements are met."
      });
      return;
    }

    try {
      await signUpWithEmailPassword(email, password);
      // We can also update the user's profile with the full name here if needed
      router.push('/dashboard');
      onModalClose();
    } catch (error) {
      console.error("Error signing up with email: ", error);
       if (error instanceof FirebaseError) {
          let description = error.message;
          if (error.code === 'auth/email-already-in-use') {
            description = "This email is already registered. Please sign in or use a different email.";
          }
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: description,
          });
      }
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await signInWithGoogle();
      router.push('/dashboard');
      onModalClose();
    } catch (error) {
      if (error instanceof FirebaseError && (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request')) {
        console.log("Sign-up popup closed by user.");
        return;
      }
      console.error("Error signing up with Google: ", error);
       if (error instanceof FirebaseError) {
         toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: error.message,
        });
      }
    }
  };
  
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-2xl font-headline text-center">Create an Account</DialogTitle>
        <DialogDescription className="text-center">
          Join our network of educators and institutions today.
        </DialogDescription>
      </DialogHeader>
      <div className="px-6 pb-6 max-h-[80vh] overflow-y-auto">
        <form className="grid gap-4" onSubmit={handleEmailSignUp}>
          <div className="grid grid-cols-1 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first-name">First Name</Label>
              <Input id="first-name" placeholder="John" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last-name">Last Name</Label>
              <Input id="last-name" placeholder="Doe" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email-signup">Email</Label>
            <Input
              id="email-signup"
              type="email"
              placeholder="name@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password-signup">Password</Label>
            <div className="relative">
              <Input id="password-signup" type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 h-full -translate-y-1/2 px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 transition-all duration-300" />
                ) : (
                  <Eye className="h-4 w-4 transition-all duration-300" />
                )}
                <span className="sr-only">
                  {showPassword ? "Hide password" : "Show password"}
                </span>
              </Button>
            </div>
          </div>
           {password.length > 0 && (
            <div className="space-y-2">
              <PasswordStrength value={passwordRequirements.strength} label={passwordRequirements.strengthLabel} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                <Requirement met={passwordRequirements.hasLength} text="At least 8 characters" />
                <Requirement met={passwordRequirements.hasUpper} text="One uppercase letter" />
                <Requirement met={passwordRequirements.hasLower} text="One lowercase letter" />
                <Requirement met={passwordRequirements.hasNumber} text="One number" />
                <Requirement met={passwordRequirements.hasSpecial} text="One special character" />
              </div>
            </div>
          )}
           <div className="grid gap-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <div className="relative">
              <Input id="confirm-password" type={showConfirmPassword ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
               <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 h-full -translate-y-1/2 px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 transition-all duration-300" />
                ) : (
                  <Eye className="h-4 w-4 transition-all duration-300" />
                )}
                 <span className="sr-only">
                  {showConfirmPassword ? "Hide password" : "Show password"}
                </span>
              </Button>
            </div>
          </div>
          <Button type="submit" className="w-full">
            Create Account
          </Button>
          <Button variant="outline" className="w-full" type="button" onClick={handleGoogleSignUp}>
             <GoogleIcon className="mr-2 h-4 w-4" />
            Sign up with Google
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Button variant="link" className="p-0 h-auto underline" onClick={onLoginClick}>
            Sign in
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};


const ForgotPasswordForm = ({ onLoginClick, onModalClose }: { onLoginClick: () => void, onModalClose: () => void }) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendPasswordReset(email);
      toast({
        title: "Password Reset Email Sent",
        description: "Please check your inbox for a link to reset your password.",
      });
      onModalClose();
    } catch (error) {
      console.error("Error sending password reset email: ", error);
      if (error instanceof FirebaseError) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: error.message,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-2xl font-headline text-center">Forgot Password</DialogTitle>
        <DialogDescription className="text-center">
          Enter your email to receive a password reset link.
        </DialogDescription>
      </DialogHeader>
      <div className="px-6 pb-6">
        <form className="grid gap-4" onSubmit={handlePasswordReset}>
          <div className="grid gap-2">
            <Label htmlFor="email-forgot">Email</Label>
            <Input id="email-forgot" type="email" placeholder="name@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Remember your password?{" "}
          <Button variant="link" className="p-0 h-auto underline" onClick={onLoginClick}>
            Sign in
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};


export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const router = useRouter();

  const handleShowLogin = () => {
    setShowSignup(false);
    setShowForgotPassword(false);
    setShowLogin(true);
  };

  const handleShowSignup = () => {
    setShowLogin(false);
    setShowForgotPassword(false);
    setShowSignup(true);
  };
  
  const handleShowForgotPassword = () => {
    setShowLogin(false);
    setShowSignup(false);
    setShowForgotPassword(true);
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      router.push('/dashboard');
    } catch (error) {
      console.error("Error signing in with Google: ", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <LandingHeader onLoginClick={handleShowLogin} onSignupClick={handleShowSignup} />
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
                 <Button size="lg" className="justify-center p-6 rounded-full text-base bg-blue-600 hover:bg-blue-700 text-white" onClick={handleGoogleSignIn}>
                    <GoogleIcon className="mr-4 h-6 w-6"/> Continue with Google
                </Button>
                <Button size="lg" variant="outline" className="justify-center p-6 rounded-full text-base">
                   <MicrosoftIcon className="mr-4 h-6 w-6" /> Continue with Microsoft
                </Button>
                 <Button size="lg" variant="outline" className="justify-center p-6 rounded-full text-base" onClick={handleShowLogin}>
                   Sign in with email
                </Button>
              </div>
              <p className="text-xs text-muted-foreground max-w-md">
                By continuing, you agree to SoF’s <Link href="#" className="underline">User Terms</Link>, <Link href="#" className="underline">Privacy Policy</Link>, and <Link href="#" className="underline">Code of Conduct</Link>.
              </p>
               <p className="mt-4">
                New to SoF? <Button variant="link" className="text-primary font-bold hover:underline p-0" onClick={handleShowSignup}>Join now</Button>
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
                    <Button onClick={handleShowSignup}>Get Started</Button>
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
            <Button size="lg" className="rounded-full px-12 py-6 text-xl" onClick={handleShowSignup}>Get Started</Button>
          </div>
        </section>
      </main>

      <Dialog open={showLogin} onOpenChange={setShowLogin}>
        <LoginForm onSignupClick={handleShowSignup} onForgotPasswordClick={handleShowForgotPassword} onModalClose={() => setShowLogin(false)} />
      </Dialog>
      <Dialog open={showSignup} onOpenChange={setShowSignup}>
        <SignupForm onLoginClick={handleShowLogin} onModalClose={() => setShowSignup(false)} />
      </Dialog>
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <ForgotPasswordForm onLoginClick={handleShowLogin} onModalClose={() => setShowForgotPassword(false)} />
      </Dialog>
      
      <LandingFooter />
    </div>
  );
}

    