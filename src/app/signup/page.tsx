
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";
import { signInWithGoogle, signUpWithEmailPassword } from "@/lib/firebase";
import { FirebaseError } from "firebase/app";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Eye, EyeOff } from "lucide-react";

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


export default function SignupPage() {
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
    <div className="flex min-h-screen items-center justify-center bg-accent/10 p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-6 flex justify-center">
            <Logo />
        </Link>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
            <CardDescription>
              Join our network of educators and institutions today.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={handleEmailSignUp}>
              <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} />
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
              <Link href="/login" className="underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
