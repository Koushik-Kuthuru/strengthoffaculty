
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { updateUserProfile, getUserProfile, auth } from '@/lib/firebase';
import { Trash2, PlusCircle, Building, MapPin, Info, FileText, Link as LinkIcon, User as UserIcon, Loader2, Edit, WifiOff } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Skeleton } from '@/components/ui/skeleton';
import { Logo } from '@/components/logo';

const branchSchema = z.object({
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pinCode: z.string().length(6, "Pin code must be 6 digits"),
});

const institutionProfileSchema = z.object({
  institutionName: z.string().min(1, 'Institution name is required'),
  logo: z.any().optional(),
  institutionType: z.string().min(1, 'Please select a type'),
  establishmentYear: z.string().min(4, 'Enter a valid year'),
  contactNumber: z.string().min(10, 'Enter a valid contact number'),
  email: z.string().email('Invalid email address'),
  location: z.object({
    fullAddress: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    pinCode: z.string().length(6, 'Pin code must be 6 digits'),
  }),
  branches: z.array(branchSchema).optional(),
  institutionDetails: z.object({
    affiliation: z.string().min(1, 'Affiliation is required'),
    studentCount: z.string().optional(),
    teacherCount: z.string().optional(),
    about: z.string().min(1, 'About section is required'),
    websiteUrl: z.string().url().or(z.literal('')),
  }),
  documents: z.object({
    registrationCertificate: z.any().optional(),
    affiliationProof: z.any().optional(),
    representativeId: z.any().optional(),
  }),
  jobSettings: z.object({
    hrContactName: z.string().min(1, 'HR contact name is required'),
    hrContactNumber: z.string().min(10, 'Enter a valid contact number'),
    postingGuidelines: z.string().optional(),
  }),
});

type InstitutionProfileForm = z.infer<typeof institutionProfileSchema>;

const getTotalFields = (data: any): [number, number] => {
    const fields = [
      'institutionName', 'institutionType', 'establishmentYear', 'contactNumber', 'email',
      'location.fullAddress', 'location.city', 'location.state', 'location.pinCode',
      'institutionDetails.affiliation', 'institutionDetails.about', 'institutionDetails.websiteUrl',
      'jobSettings.hrContactName', 'jobSettings.hrContactNumber'
    ];
    let filledFields = 0;
    const totalFields = fields.length;

    fields.forEach(field => {
        const keys = field.split('.');
        let value = data;
        try {
          for (const key of keys) {
              value = value[key];
          }
          if (value && value.toString().trim() !== '') {
              filledFields++;
          }
        } catch (e) {
          // Field does not exist
        }
    });

    return [totalFields, filledFields];
};

const InfoField = ({ label, value }: { label: string; value?: string | null }) => (
  <div className="grid grid-cols-2">
    <p className="font-semibold text-muted-foreground">{label}</p>
    <p>{value || 'Not provided'}</p>
  </div>
);


export default function InstitutionProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [profileData, setProfileData] = useState<InstitutionProfileForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);


  const { register, handleSubmit, control, formState: { errors, isSubmitting }, getValues, reset, watch } = useForm<InstitutionProfileForm>({
    resolver: zodResolver(institutionProfileSchema),
    defaultValues: {
        institutionName: '',
        institutionType: '',
        establishmentYear: '',
        contactNumber: '',
        email: '',
        location: { fullAddress: '', city: '', state: '', pinCode: '' },
        branches: [],
        institutionDetails: {
            affiliation: '',
            studentCount: '',
            teacherCount: '',
            about: '',
            websiteUrl: ''
        },
        jobSettings: {
            hrContactName: '',
            hrContactNumber: '',
            postingGuidelines: ''
        }
    }
  });
  
  const formValues = watch();

  const fetchProfile = async (currentUser: User) => {
    try {
      setError(null);
      setLoading(true);
      setUser(currentUser);
      const existingProfile = await getUserProfile(currentUser.uid);
      if (existingProfile) {
        const typedProfile = existingProfile as InstitutionProfileForm;
        if (typedProfile.profileCompleted) {
            setProfileData(typedProfile);
            reset(typedProfile);
        } else {
            setIsEditing(true);
        }
      } else {
          setIsEditing(true);
      }
    } catch(e: any) {
         if (e.code === 'unavailable') {
            setError("You are offline. Please check your connection and try again.");
        } else {
            setError("An unexpected error occurred while fetching your profile.");
        }
    } finally {
        setLoading(false);
    }
  };


  useEffect(() => {
    const [total, filled] = getTotalFields(formValues);
    const newProgress = total > 0 ? (filled / total) * 100 : 0;
    setProgress(newProgress);
  }, [formValues]);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await fetchProfile(currentUser);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router, reset]);


  const { fields, append, remove } = useFieldArray({
    control,
    name: "branches",
  });

  const onSubmit = async (data: InstitutionProfileForm) => {
    if (!user) return;
    try {
      const profileToSave = {
        ...data,
        role: 'institution',
        profileCompleted: true,
      };
      
      await updateUserProfile(user.uid, profileToSave);
      setProfileData(profileToSave);
      reset(profileToSave);
      setIsEditing(false);
      toast({ title: 'Profile updated successfully!' });
      router.push('/dashboard');
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem saving your profile. Please try again.',
      });
    }
  };
  
  if (loading) {
    return (
        <div className="flex h-screen w-screen items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <Logo />
                <Skeleton className="h-4 w-48" />
            </div>
        </div>
    )
  }
  
   if (error) {
     return (
       <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-center">
            <WifiOff className="h-16 w-16 text-destructive" />
            <h1 className="text-xl font-semibold">Connection Error</h1>
            <p className="text-muted-foreground max-w-xs">{error}</p>
            <Button onClick={() => auth.currentUser && fetchProfile(auth.currentUser)}>Retry</Button>
        </div>
      </div>
     )
  }


  return (
    <div className="min-h-screen bg-muted/20 py-12">
      <div className="container mx-auto max-w-4xl">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl font-headline">
                   {isEditing ? 'Edit Institution Profile' : profileData?.institutionName || 'Institution Profile'}
                </CardTitle>
                <CardDescription>
                  {isEditing ? 'Fill out the details below to post jobs and attract talent.' : 'View or edit your institution profile.'}
                </CardDescription>
              </div>
              <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? 'ghost' : 'default'} size="sm">
                {isEditing ? 'Cancel' : <><Edit className="mr-2 h-4 w-4" /> Edit Profile</>}
              </Button>
            </div>
            {isEditing && (
              <div className="space-y-2 mt-4">
                <div className="flex justify-between">
                  <Label>Profile Completion</Label>
                  <span className="text-sm font-medium">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold font-headline flex items-center"><Building className="mr-2" /> A. Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="institutionName">Institution Name</Label>
                      <Input id="institutionName" {...register('institutionName')} />
                      {errors.institutionName && <p className="text-destructive text-sm">{errors.institutionName.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="logo">Logo / Banner Image</Label>
                      <Input id="logo" type="file" {...register('logo')} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="institutionType">Type of Institution</Label>
                      <Select onValueChange={(value) => reset({ ...getValues(), institutionType: value })} defaultValue={profileData?.institutionType}>
                        <SelectTrigger id="institutionType"><SelectValue placeholder="Select type" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="School">School</SelectItem>
                          <SelectItem value="College">College</SelectItem>
                          <SelectItem value="Coaching Centre">Coaching Centre</SelectItem>
                          <SelectItem value="University">University</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.institutionType && <p className="text-destructive text-sm">{errors.institutionType.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="establishmentYear">Year of Establishment</Label>
                      <Input id="establishmentYear" type="number" {...register('establishmentYear')} />
                      {errors.establishmentYear && <p className="text-destructive text-sm">{errors.establishmentYear.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactNumber">Contact Number</Label>
                      <Input id="contactNumber" {...register('contactNumber')} />
                      {errors.contactNumber && <p className="text-destructive text-sm">{errors.contactNumber.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Official Email ID</Label>
                      <Input id="email" type="email" {...register('email')} />
                      {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Location */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold font-headline flex items-center"><MapPin className="mr-2" /> B. Location</h3>
                  <div className="space-y-2">
                    <Label htmlFor="fullAddress">Full Address (Main Branch)</Label>
                    <Textarea id="fullAddress" {...register('location.fullAddress')} />
                    {errors.location?.fullAddress && <p className="text-destructive text-sm">{errors.location.fullAddress.message}</p>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="city" className="text-xs">City</Label>
                      <Input id="city" {...register('location.city')} />
                      {errors.location?.city && <p className="text-destructive text-sm">{errors.location.city.message}</p>}
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="state" className="text-xs">State</Label>
                      <Input id="state" {...register('location.state')} />
                      {errors.location?.state && <p className="text-destructive text-sm">{errors.location.state.message}</p>}
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="pinCode" className="text-xs">Pin Code</Label>
                      <Input id="pinCode" {...register('location.pinCode')} />
                      {errors.location?.pinCode && <p className="text-destructive text-sm">{errors.location.pinCode.message}</p>}
                    </div>
                  </div>
                  <div>
                    <Label>Multiple Branches (if applicable)</Label>
                    {fields.map((field, index) => (
                      <div key={field.id} className="p-4 border rounded-lg mt-2 space-y-2 relative">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="space-y-1 md:col-span-2">
                                <Label htmlFor={`branches.${index}.address`}>Full Address</Label>
                                <Textarea id={`branches.${index}.address`} {...register(`branches.${index}.address`)} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor={`branches.${index}.city`}>City</Label>
                                <Input id={`branches.${index}.city`} {...register(`branches.${index}.city`)} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor={`branches.${index}.state`}>State</Label>
                                <Input id={`branches.${index}.state`} {...register(`branches.${index}.state`)} />
                            </div>
                             <div className="space-y-1">
                                <Label htmlFor={`branches.${index}.pinCode`}>Pin Code</Label>
                                <Input id={`branches.${index}.pinCode`} {...register(`branches.${index}.pinCode`)} />
                            </div>
                        </div>
                        <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => remove(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => append({ address: '', city: '', state: '', pinCode: '' })}>
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Branch
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                {/* Institution Details */}
                <div className="space-y-4">
                   <h3 className="text-xl font-semibold font-headline flex items-center"><Info className="mr-2"/>C. Institution Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="affiliation">Affiliation / Board</Label>
                            <Input id="affiliation" placeholder="e.g., CBSE, ICSE" {...register('institutionDetails.affiliation')} />
                             {errors.institutionDetails?.affiliation && <p className="text-destructive text-sm">{errors.institutionDetails.affiliation.message}</p>}
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="websiteUrl">Website URL</Label>
                            <Input id="websiteUrl" {...register('institutionDetails.websiteUrl')} />
                             {errors.institutionDetails?.websiteUrl && <p className="text-destructive text-sm">{errors.institutionDetails.websiteUrl.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="studentCount">Number of Students (optional)</Label>
                            <Input id="studentCount" type="number" {...register('institutionDetails.studentCount')} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="teacherCount">Number of Teachers (optional)</Label>
                            <Input id="teacherCount" type="number" {...register('institutionDetails.teacherCount')} />
                        </div>
                         <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="about">About Us</Label>
                            <Textarea id="about" {...register('institutionDetails.about')} />
                             {errors.institutionDetails?.about && <p className="text-destructive text-sm">{errors.institutionDetails.about.message}</p>}
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Verification Documents */}
                 <div className="space-y-4">
                    <h3 className="text-xl font-semibold font-headline flex items-center"><FileText className="mr-2"/>D. Verification Documents</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="registrationCertificate">School/College Registration Certificate</Label>
                        <Input id="registrationCertificate" type="file" {...register('documents.registrationCertificate')} />
                      </div>
                       <div className="space-y-2">
                        <Label htmlFor="affiliationProof">Affiliation Proof</Label>
                        <Input id="affiliationProof" type="file" {...register('documents.affiliationProof')} />
                      </div>
                       <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="representativeId">Authorized Representative ID Proof</Label>
                        <Input id="representativeId" type="file" {...register('documents.representativeId')} />
                      </div>
                    </div>
                </div>
                
                 <Separator />

                {/* Job Posting Settings */}
                 <div className="space-y-4">
                    <h3 className="text-xl font-semibold font-headline flex items-center"><UserIcon className="mr-2"/>E. Job Posting Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="hrContactName">HR Contact Person Name</Label>
                        <Input id="hrContactName" {...register('jobSettings.hrContactName')} />
                        {errors.jobSettings?.hrContactName && <p className="text-destructive text-sm">{errors.jobSettings.hrContactName.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hrContactNumber">HR Contact Number</Label>
                        <Input id="hrContactNumber" {...register('jobSettings.hrContactNumber')} />
                         {errors.jobSettings?.hrContactNumber && <p className="text-destructive text-sm">{errors.jobSettings.hrContactNumber.message}</p>}
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="postingGuidelines">Job Posting Guidelines (optional)</Label>
                        <Textarea id="postingGuidelines" placeholder="e.g., Mention specific requirements for full-time, part-time, etc." {...register('jobSettings.postingGuidelines')} />
                      </div>
                    </div>
                 </div>


                <CardFooter className="px-0">
                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Saving...</> : 'Save and Continue'}
                  </Button>
                </CardFooter>
              </form>
            ) : (
                <div className="space-y-8">
                  {/* View Mode */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold font-headline flex items-center"><Building className="mr-2"/>A. Basic Information</h3>
                    <div className="space-y-2 pl-6">
                      <InfoField label="Institution Name" value={profileData?.institutionName} />
                      <InfoField label="Type" value={profileData?.institutionType} />
                      <InfoField label="Established" value={profileData?.establishmentYear} />
                      <InfoField label="Contact" value={profileData?.contactNumber} />
                      <InfoField label="Email" value={profileData?.email} />
                    </div>
                  </div>
                   <Separator/>
                   <div className="space-y-4">
                    <h3 className="text-xl font-semibold font-headline flex items-center"><MapPin className="mr-2"/>B. Location</h3>
                    <div className="pl-6">
                       <InfoField label="Main Address" value={`${profileData?.location?.fullAddress}, ${profileData?.location?.city}, ${profileData?.location?.state} - ${profileData?.location?.pinCode}`} />
                        <p className="font-semibold text-muted-foreground mt-4">Branches</p>
                        <ul className="list-disc pl-5 mt-2">
                            {profileData?.branches?.map((branch, index) => (
                            <li key={index}>{`${branch.address}, ${branch.city}, ${branch.state} - ${branch.pinCode}`}</li>
                            ))}
                            {(!profileData?.branches || profileData.branches.length === 0) && <p>No other branches listed</p>}
                        </ul>
                    </div>
                  </div>
                   <Separator/>
                   <div className="space-y-4">
                    <h3 className="text-xl font-semibold font-headline flex items-center"><Info className="mr-2"/>C. Institution Details</h3>
                    <div className="space-y-2 pl-6">
                      <InfoField label="Affiliation" value={profileData?.institutionDetails?.affiliation} />
                       <InfoField label="Website" value={profileData?.institutionDetails?.websiteUrl} />
                      <InfoField label="Students" value={profileData?.institutionDetails?.studentCount} />
                      <InfoField label="Teachers" value={profileData?.institutionDetails?.teacherCount} />
                       <div>
                         <p className="font-semibold text-muted-foreground">About</p>
                         <p>{profileData?.institutionDetails?.about || 'Not provided'}</p>
                       </div>
                    </div>
                  </div>
                   <Separator/>
                   <div className="space-y-4">
                    <h3 className="text-xl font-semibold font-headline flex items-center"><UserIcon className="mr-2"/>E. Job Posting Settings</h3>
                    <div className="space-y-2 pl-6">
                      <InfoField label="HR Contact" value={profileData?.jobSettings?.hrContactName} />
                      <InfoField label="HR Number" value={profileData?.jobSettings?.hrContactNumber} />
                      <div>
                        <p className="font-semibold text-muted-foreground">Guidelines</p>
                        <p>{profileData?.jobSettings?.postingGuidelines || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    