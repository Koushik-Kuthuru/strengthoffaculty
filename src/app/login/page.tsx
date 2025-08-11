"use client";

import Link from "next/link"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/logo"
import { signInWithGoogle, signInWithEmailPassword } from "@/lib/firebase";
import { FirebaseError } from "firebase/app";
import { useToast } from "@/hooks/use-toast";

function GoogleIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a10 10 0 0 0-9.05 14.26A9.94 9.94 0 0 0 12 22a10 10 0 0 0 9.05-7.74" />
            <path d="M2.95 14.26A10.04 10.04 0 0 1 12 2" />
        </svg>
    )
}

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailPassword(email, password);
      router.push('/dashboard');
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
    <div className="flex min-h-screen items-center justify-center bg-accent/10 p-4">
        <div className="w-full max-w-md">
            <Link href="/" className="mb-6 flex justify-center">
                <Logo />
            </Link>
            <Card>
                <CardHeader className="text-center">
                <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
                <CardDescription>
                    Sign in to continue to your Strength of Faculty account.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <form className="grid gap-4" onSubmit={handleEmailSignIn}>
                    <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="name@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                        <Link href="#" className="ml-auto inline-block text-sm underline">
                        Forgot your password?
                        </Link>
                    </div>
                    <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
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
                    <Link href="/signup" className="underline">
                    Sign up
                    </Link>
                </div>
                </CardContent>
            </Card>
        </div>
    </div>
  )
}
