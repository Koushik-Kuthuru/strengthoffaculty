
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
import { Trash2, PlusCircle, Edit, Building, MapPin, FileText, Settings, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Skeleton } from '@/components/ui/skeleton';

const branchSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pinCode: z.string().length(6, 'Pin code must be 6 digits'),
});

const institutionProfileSchema = z.object({
  institutionName: z.string().min(1, 'Institution name is required'),
  logo: z.any().optional(),
  banner: z.any().optional(),
  institutionType: z.string().min(1, 'Institution type is required'),
  establishmentYear: z.string().length(4, 'Enter a valid year'),
  contactNumber: z.string().min(10, 'Enter a valid contact number'),
  officialEmail: z.string().email('Invalid email address'),
  fullAddress: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pinCode: z.string().length(6, 'Pin code must be 6 digits'),
  branches: z.array(branchSchema).optional(),
  affiliation: z.string().min(1, 'Affiliation is required'),
  studentCount: z.string().optional(),
  teacherCount: z.string().optional(),
  aboutUs: z.string().min(20, 'Please provide a brief description (min 20 characters)'),
  websiteUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  registrationCertificate: z.any().optional(),
  affiliationProof: z.any().optional(),
  representativeIdProof: z.any().optional(),
  hrContactPerson: z.string().min(1, 'HR contact name is required'),
  hrContactNumber: z.string().min(10, 'Enter a valid contact number'),
  jobPostingGuidelines: z.string().min(1, 'Guidelines are required'),
});

type InstitutionProfileForm = z.infer<typeof institutionProfileSchema>;

const InfoField = ({ label, value }: { label: string; value?: string | number | null }) => (
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

  const { register, handleSubmit, control, formState: { errors, isSubmitting }, reset, getValues } = useForm<InstitutionProfileForm>({
    resolver: zodResolver(institutionProfileSchema),
    defaultValues: {
        branches: [],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "branches",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const existingProfile = await getUserProfile(currentUser.uid);
        if (existingProfile && existingProfile.profileCompleted) {
          const typedProfile = existingProfile as InstitutionProfileForm;
          setProfileData(typedProfile);
          reset(typedProfile);
        } else {
          // If profile is not complete, start in edit mode.
          setIsEditing(true);
        }
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, reset]);

  const onSubmit = async (data: InstitutionProfileForm) => {
    if (!user) return;
    try {
      const profileToSave = {
        ...data,
        profileCompleted: true,
        role: 'institution'
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
        <div className="min-h-screen bg-muted/20 py-12">
            <div className="container mx-auto max-w-4xl">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                       <Skeleton className="h-8 w-1/2" />
                       <Skeleton className="h-10 w-24" />
                    </CardHeader>
                    <CardContent className="space-y-8">
                       <Skeleton className="h-96 w-full" />
                    </CardContent>
                 </Card>
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
                       {isEditing ? 'Update the details below. All fields are required.' : 'View or edit your institution details.'}
                    </CardDescription>
                </div>
                 <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? 'ghost' : 'default'} size="sm">
                    {isEditing ? 'Cancel' : <><Edit className="mr-2 h-4 w-4" /> Edit Profile</>}
                </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* All form fields go here, same as before */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold font-headline flex items-center"><Building className="mr-2"/>A. Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                          <Label htmlFor="institutionName">Institution Name</Label>
                          <Input id="institutionName" {...register('institutionName')} />
                          {errors.institutionName && <p className="text-destructive text-sm">{errors.institutionName.message}</p>}
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
                          <Input id="establishmentYear" placeholder="YYYY" {...register('establishmentYear')} />
                          {errors.establishmentYear && <p className="text-destructive text-sm">{errors.establishmentYear.message}</p>}
                      </div>
                       <div className="space-y-2">
                          <Label htmlFor="contactNumber">Contact Number</Label>
                          <Input id="contactNumber" {...register('contactNumber')} />
                          {errors.contactNumber && <p className="text-destructive text-sm">{errors.contactNumber.message}</p>}
                      </div>
                      <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="officialEmail">Official Email ID</Label>
                          <Input id="officialEmail" type="email" {...register('officialEmail')} />
                          {errors.officialEmail && <p className="text-destructive text-sm">{errors.officialEmail.message}</p>}
                      </div>
                  </div>
                </div>

                <Separator />
                
                <div className="space-y-4">
                   <h3 className="text-xl font-semibold font-headline flex items-center"><MapPin className="mr-2"/>B. Location</h3>
                   <div className="space-y-2">
                      <Label htmlFor="fullAddress">Full Address (Main Branch)</Label>
                      <Textarea id="fullAddress" {...register('fullAddress')} />
                      {errors.fullAddress && <p className="text-destructive text-sm">{errors.fullAddress.message}</p>}
                  </div>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input id="city" {...register('city')} />
                          {errors.city && <p className="text-destructive text-sm">{errors.city.message}</p>}
                      </div>
                       <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input id="state" {...register('state')} />
                          {errors.state && <p className="text-destructive text-sm">{errors.state.message}</p>}
                      </div>
                       <div className="space-y-2">
                          <Label htmlFor="pinCode">Pin Code</Label>
                          <Input id="pinCode" {...register('pinCode')} />
                          {errors.pinCode && <p className="text-destructive text-sm">{errors.pinCode.message}</p>}
                      </div>
                  </div>
                  <div>
                    <Label>Multiple Branches</Label>
                    {fields.map((field, index) => (
                      <div key={field.id} className="p-4 border rounded-lg mt-2 space-y-2 relative">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                  <Label htmlFor={`branches.${index}.address`}>Branch Address</Label>
                                  <Input id={`branches.${index}.address`} {...register(`branches.${index}.address`)} />
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

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold font-headline flex items-center"><Building className="mr-2"/>C. Institution Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                          <Label htmlFor="affiliation">Affiliation / Board</Label>
                          <Input id="affiliation" placeholder="e.g., CBSE, ICSE, State Board" {...register('affiliation')} />
                          {errors.affiliation && <p className="text-destructive text-sm">{errors.affiliation.message}</p>}
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="websiteUrl">Website URL</Label>
                          <Input id="websiteUrl" placeholder="https://..." {...register('websiteUrl')} />
                          {errors.websiteUrl && <p className="text-destructive text-sm">{errors.websiteUrl.message}</p>}
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="studentCount">Number of Students (optional)</Label>
                          <Input id="studentCount" {...register('studentCount')} />
                      </div>
                       <div className="space-y-2">
                          <Label htmlFor="teacherCount">Number of Teachers (optional)</Label>
                          <Input id="teacherCount" {...register('teacherCount')} />
                      </div>
                       <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="aboutUs">About Us</Label>
                          <Textarea id="aboutUs" {...register('aboutUs')} />
                          {errors.aboutUs && <p className="text-destructive text-sm">{errors.aboutUs.message}</p>}
                      </div>
                  </div>
                </div>

                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold font-headline flex items-center"><FileText className="mr-2"/>D. Verification Documents</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="registrationCertificate">School/College Registration Certificate</Label>
                      <Input id="registrationCertificate" type="file" {...register('registrationCertificate')} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="affiliationProof">Affiliation Proof</Label>
                      <Input id="affiliationProof" type="file" {...register('affiliationProof')} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="representativeIdProof">Authorized Representative ID Proof</Label>
                      <Input id="representativeIdProof" type="file" {...register('representativeIdProof')} />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold font-headline flex items-center"><Settings className="mr-2"/>E. Job Posting Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                          <Label htmlFor="hrContactPerson">HR Contact Person Name</Label>
                          <Input id="hrContactPerson" {...register('hrContactPerson')} />
                          {errors.hrContactPerson && <p className="text-destructive text-sm">{errors.hrContactPerson.message}</p>}
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="hrContactNumber">HR Contact Number</Label>
                          <Input id="hrContactNumber" {...register('hrContactNumber')} />
                          {errors.hrContactNumber && <p className="text-destructive text-sm">{errors.hrContactNumber.message}</p>}
                      </div>
                      <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="jobPostingGuidelines">Job Posting Guidelines</Label>
                          <Textarea id="jobPostingGuidelines" placeholder="e.g., full-time, part-time, guest faculty, etc." {...register('jobPostingGuidelines')} />
                          {errors.jobPostingGuidelines && <p className="text-destructive text-sm">{errors.jobPostingGuidelines.message}</p>}
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
                     <div className="space-y-4">
                        <h3 className="text-xl font-semibold font-headline flex items-center"><Building className="mr-2"/>A. Basic Information</h3>
                        <div className="space-y-2 pl-6">
                            <InfoField label="Institution Name" value={profileData?.institutionName} />
                            <InfoField label="Institution Type" value={profileData?.institutionType} />
                            <InfoField label="Year of Establishment" value={profileData?.establishmentYear} />
                            <InfoField label="Contact Number" value={profileData?.contactNumber} />
                            <InfoField label="Official Email" value={profileData?.officialEmail} />
                        </div>
                    </div>
                    <Separator />
                    <div className="space-y-4">
                         <h3 className="text-xl font-semibold font-headline flex items-center"><MapPin className="mr-2"/>B. Location</h3>
                         <div className="space-y-2 pl-6">
                            <InfoField label="Main Address" value={`${profileData?.fullAddress}, ${profileData?.city}, ${profileData?.state} - ${profileData?.pinCode}`} />
                            {profileData?.branches && profileData.branches.length > 0 && (
                                <div>
                                    <p className="font-semibold text-muted-foreground mt-4">Branches:</p>
                                    <ul className="list-disc pl-5 mt-2">
                                    {profileData.branches.map((branch, index) => (
                                        <li key={index}>{`${branch.address}, ${branch.city}, ${branch.state} - ${branch.pinCode}`}</li>
                                    ))}
                                    </ul>
                                </div>
                            )}
                         </div>
                    </div>
                    <Separator />
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold font-headline flex items-center"><Building className="mr-2"/>C. Institution Details</h3>
                        <div className="space-y-2 pl-6">
                           <InfoField label="Affiliation" value={profileData?.affiliation} />
                           <InfoField label="Website" value={profileData?.websiteUrl} />
                           <InfoField label="Student Count" value={profileData?.studentCount} />
                           <InfoField label="Teacher Count" value={profileData?.teacherCount} />
                           <InfoField label="About Us" value={profileData?.aboutUs} />
                        </div>
                    </div>
                    <Separator />
                    <div className="space-y-4">
                         <h3 className="text-xl font-semibold font-headline flex items-center"><Settings className="mr-2"/>E. Job Posting Settings</h3>
                         <div className="space-y-2 pl-6">
                            <InfoField label="HR Contact Person" value={profileData?.hrContactPerson} />
                            <InfoField label="HR Contact Number" value={profileData?.hrContactNumber} />
                            <InfoField label="Job Posting Guidelines" value={profileData?.jobPostingGuidelines} />
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
