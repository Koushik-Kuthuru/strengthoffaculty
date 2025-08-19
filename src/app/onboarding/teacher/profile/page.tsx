
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, onAuthStateChanged } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth, getUserProfile, updateUserProfile } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/logo";
import { Loader2, AlertTriangle } from "lucide-react";

export default function TeacherProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    headline: "",
    bio: "",
    skills: "",
    location: "",
  });

  const loadProfile = async (currentUser: User) => {
    setLoading(true);
    setError(null);
    try {
      const profile = await getUserProfile(currentUser.uid);
      if (profile) {
        setFormData({
          headline: profile.headline || "",
          bio: profile.bio || "",
          skills: profile.skills ? profile.skills.join(", ") : "",
          location: profile.location || "",
        });
      }
    } catch (err) {
      console.error("Failed to load profile", err);
       if (err instanceof FirebaseError && err.code === 'unavailable') {
        setError("You are offline. Cannot load your profile. Please check your connection and retry.");
      } else {
        setError("An error occurred while loading your profile.");
      }
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        loadProfile(currentUser);
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError(null);

    try {
      const profileData = {
        ...formData,
        skills: formData.skills.split(",").map((skill) => skill.trim()).filter(Boolean),
        profileCompleted: true,
      };
      await updateUserProfile(user.uid, profileData);
      toast({
        title: "Profile Saved!",
        description: "Your information has been successfully updated.",
      });
      router.push("/feed");
    } catch (err) {
       console.error("Failed to save profile", err);
        if (err instanceof FirebaseError && err.code === 'unavailable') {
            setError("You are offline. Cannot save your profile. Please check your connection and retry.");
        } else {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem saving your profile. Please try again.",
            });
        }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
        <div className="flex h-screen w-screen items-center justify-center">
            <Loader2 className="animate-spin h-8 w-8 text-primary" />
        </div>
    );
  }
  
   if (error && !loading && !saving) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="flex justify-center">
                <AlertTriangle className="h-10 w-10 text-destructive" />
            </CardTitle>
            <CardDescription className="text-lg font-semibold">
              Connection Error
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => user && loadProfile(user)} disabled={loading}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-6">
          <Logo />
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Complete Your Profile</CardTitle>
            <CardDescription>
              Tell us more about yourself to get the most out of TeacherConnect.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-6" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="headline">Headline</Label>
                <Input id="headline" placeholder="E.g., 'Experienced Mathematics Teacher' or 'Physics Professor'" value={formData.headline} onChange={handleInputChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bio">Biography</Label>
                <Textarea id="bio" placeholder="Share a bit about your teaching philosophy, experience, and interests." className="min-h-[120px]" value={formData.bio} onChange={handleInputChange}/>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="skills">Skills</Label>
                <Input id="skills" placeholder="Enter skills separated by commas, e.g., 'Curriculum Design, Python, Public Speaking'" value={formData.skills} onChange={handleInputChange}/>
                 <p className="text-xs text-muted-foreground">Separate skills with a comma.</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="E.g., 'Hyderabad, India'" value={formData.location} onChange={handleInputChange}/>
              </div>
               {error && saving && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}
              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? <><Loader2 className="animate-spin mr-2" /> Saving...</> : 'Save and Continue'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
