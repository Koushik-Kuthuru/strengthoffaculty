
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
import { Trash2, PlusCircle, Edit, User as UserIcon, Briefcase, Award, Lightbulb, FileText, Link as LinkIcon, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Skeleton } from '@/components/ui/skeleton';

const workHistorySchema = z.object({
  school: z.string().min(1, "School/College name is required"),
  duration: z.string().min(1, "Duration is required"),
});

const teacherProfileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  profilePhoto: z.any().optional(),
  gender: z.string().min(1, 'Please select a gender'),
  dob: z.string().min(1, 'Date of birth is required'),
  contactNumber: z.string().min(10, 'Enter a valid contact number'),
  email: z.string().email('Invalid email address'),
  currentLocation: z.object({
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    pinCode: z.string().length(6, 'Pin code must be 6 digits'),
  }),
  professionalDetails: z.object({
    jobTitle: z.string().min(1, 'Job title is required'),
    totalExperience: z.string().min(1, 'Experience is required'),
    subjects: z.string().min(1, 'Subjects are required'),
    qualifications: z.string().min(1, 'Qualifications are required'),
    gradesTaught: z.string().min(1, 'Grades taught is required'),
    curriculumExpertise: z.string().min(1, 'Curriculum expertise is required'),
  }),
  workHistory: z.array(workHistorySchema).optional(),
  achievements: z.string().optional(),
  skills: z.object({
    teaching: z.string().optional(),
    soft: z.string().optional(),
  }),
  documents: z.object({
    govId: z.any().optional(),
    educationCertificates: z.any().optional(),
    experienceLetters: z.any().optional(),
  }),
  socialLinks: z.object({
    linkedin: z.string().url().optional().or(z.literal('')),
    portfolio: z.string().url().optional().or(z.literal('')),
    demoVideo: z.string().url().optional().or(z.literal('')),
  }),
});

type TeacherProfileForm = z.infer<typeof teacherProfileSchema>;

// Helper to calculate profile completion
const getTotalFields = (data: any): [number, number] => {
    const fields = [
        'fullName', 'gender', 'dob', 'contactNumber', 'email', 
        'currentLocation.city', 'currentLocation.state', 'currentLocation.pinCode',
        'professionalDetails.jobTitle', 'professionalDetails.totalExperience', 'professionalDetails.subjects',
        'professionalDetails.qualifications', 'professionalDetails.gradesTaught', 'professionalDetails.curriculumExpertise'
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
          // Field does not exist, so it's not filled
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


export default function TeacherProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [profileData, setProfileData] = useState<TeacherProfileForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [progress, setProgress] = useState(0);

  const { register, handleSubmit, control, formState: { errors, isSubmitting }, getValues, reset, watch } = useForm<TeacherProfileForm>({
    resolver: zodResolver(teacherProfileSchema),
    defaultValues: {
      fullName: '',
      gender: '',
      dob: '',
      contactNumber: '',
      email: '',
      currentLocation: { city: '', state: '', pinCode: '' },
      professionalDetails: {
        jobTitle: '',
        totalExperience: '',
        subjects: '',
        qualifications: '',
        gradesTaught: '',
        curriculumExpertise: ''
      },
      workHistory: [],
      skills: { teaching: '', soft: '' },
      socialLinks: { linkedin: '', portfolio: '', demoVideo: ''}
    }
  });

  const formValues = watch();

  useEffect(() => {
    const [total, filled] = getTotalFields(formValues);
    const newProgress = total > 0 ? (filled / total) * 100 : 0;
    setProgress(newProgress);
  }, [formValues]);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const existingProfile = await getUserProfile(currentUser.uid);
        if (existingProfile && existingProfile.profileCompleted) {
          const typedProfile = existingProfile as TeacherProfileForm;
          setProfileData(typedProfile);
          reset(typedProfile);
        } else {
          // Start in edit mode if profile is not complete
          setIsEditing(true);
        }
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, reset]);


  const { fields, append, remove } = useFieldArray({
    control,
    name: "workHistory",
  });

  const onSubmit = async (data: TeacherProfileForm) => {
    if (!user) return;
    try {
      const profileToSave = {
        ...data,
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
                      {isEditing ? 'Edit Teacher Profile' : profileData?.fullName || 'Teacher Profile'}
                    </CardTitle>
                    <CardDescription>
                       {isEditing ? 'Fill out the details below to get matched with the right opportunities.' : 'View or edit your professional profile.'}
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
                    <h3 className="text-xl font-semibold font-headline flex items-center"><UserIcon className="mr-2" /> A. Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" {...register('fullName')} />
                        {errors.fullName && <p className="text-destructive text-sm">{errors.fullName.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="profilePhoto">Profile Photo</Label>
                        <Input id="profilePhoto" type="file" {...register('profilePhoto')} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select onValueChange={(value) => reset({ ...getValues(), gender: value })} defaultValue={profileData?.gender}>
                            <SelectTrigger id="gender"><SelectValue placeholder="Select gender" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.gender && <p className="text-destructive text-sm">{errors.gender.message}</p>}
                      </div>
                       <div className="space-y-2">
                        <Label htmlFor="dob">Date of Birth</Label>
                        <Input id="dob" type="date" {...register('dob')} />
                        {errors.dob && <p className="text-destructive text-sm">{errors.dob.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactNumber">Contact Number</Label>
                        <Input id="contactNumber" {...register('contactNumber')} />
                        {errors.contactNumber && <p className="text-destructive text-sm">{errors.contactNumber.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email ID</Label>
                        <Input id="email" type="email" {...register('email')} />
                        {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
                      </div>
                    </div>
                     <div className="space-y-2 pt-4">
                        <Label>Current Location</Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="city" className="text-xs">City</Label>
                                <Input id="city" {...register('currentLocation.city')} />
                                 {errors.currentLocation?.city && <p className="text-destructive text-sm">{errors.currentLocation.city.message}</p>}
                            </div>
                             <div className="space-y-1">
                                <Label htmlFor="state" className="text-xs">State</Label>
                                <Input id="state" {...register('currentLocation.state')} />
                                {errors.currentLocation?.state && <p className="text-destructive text-sm">{errors.currentLocation.state.message}</p>}
                            </div>
                             <div className="space-y-1">
                                <Label htmlFor="pinCode" className="text-xs">Pin Code</Label>
                                <Input id="pinCode" {...register('currentLocation.pinCode')} />
                                {errors.currentLocation?.pinCode && <p className="text-destructive text-sm">{errors.currentLocation.pinCode.message}</p>}
                            </div>
                        </div>
                     </div>
                  </div>

                  <Separator />

                  {/* Professional Details */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold font-headline flex items-center"><Briefcase className="mr-2"/>B. Professional Details</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="jobTitle">Current Job Title / Role</Label>
                            <Input id="jobTitle" {...register('professionalDetails.jobTitle')} />
                            {errors.professionalDetails?.jobTitle && <p className="text-destructive text-sm">{errors.professionalDetails.jobTitle.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="totalExperience">Total Teaching Experience (in years)</Label>
                            <Input id="totalExperience" type="number" {...register('professionalDetails.totalExperience')} />
                            {errors.professionalDetails?.totalExperience && <p className="text-destructive text-sm">{errors.professionalDetails.totalExperience.message}</p>}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="subjects">Subjects / Specializations</Label>
                            <Input id="subjects" placeholder="e.g., Physics, Organic Chemistry" {...register('professionalDetails.subjects')} />
                            {errors.professionalDetails?.subjects && <p className="text-destructive text-sm">{errors.professionalDetails.subjects.message}</p>}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="qualifications">Educational Qualifications</Label>
                            <Textarea id="qualifications" placeholder="e.g., M.Sc. in Physics, Delhi University, 2010" {...register('professionalDetails.qualifications')} />
                            {errors.professionalDetails?.qualifications && <p className="text-destructive text-sm">{errors.professionalDetails.qualifications.message}</p>}
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="gradesTaught">Classes / Grades Taught</Label>
                            <Input id="gradesTaught" placeholder="e.g., Grade 6–8, College Level" {...register('professionalDetails.gradesTaught')} />
                            {errors.professionalDetails?.gradesTaught && <p className="text-destructive text-sm">{errors.professionalDetails.gradesTaught.message}</p>}
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="curriculumExpertise">Board/Curriculum Expertise</Label>
                            <Input id="curriculumExpertise" placeholder="e.g., CBSE, ICSE, IB" {...register('professionalDetails.curriculumExpertise')} />
                            {errors.professionalDetails?.curriculumExpertise && <p className="text-destructive text-sm">{errors.professionalDetails.curriculumExpertise.message}</p>}
                        </div>
                    </div>
                  </div>
                  
                   <Separator />

                  {/* Work History */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold font-headline flex items-center"><Award className="mr-2"/>C. Work History</h3>
                    <div>
                      <Label>Previous Schools / Colleges</Label>
                      {fields.map((field, index) => (
                        <div key={field.id} className="p-4 border rounded-lg mt-2 space-y-2 relative">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label htmlFor={`workHistory.${index}.school`}>School / College Name</Label>
                                    <Input id={`workHistory.${index}.school`} {...register(`workHistory.${index}.school`)} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor={`workHistory.${index}.duration`}>Duration</Label>
                                    <Input id={`workHistory.${index}.duration`} placeholder="e.g., 2015-2020" {...register(`workHistory.${index}.duration`)} />
                                </div>
                           </div>
                           <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => remove(index)}>
                                <Trash2 className="h-4 w-4" />
                           </Button>
                        </div>
                      ))}
                      <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => append({ school: '', duration: '' })}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Work History
                      </Button>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="achievements">Achievements / Awards (optional)</Label>
                        <Textarea id="achievements" {...register('achievements')} />
                     </div>
                  </div>
                  
                  <Separator />

                  {/* Skills */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold font-headline flex items-center"><Lightbulb className="mr-2"/>D. Skills</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="teachingSkills">Teaching Skills</Label>
                        <Input id="teachingSkills" placeholder="e.g., Lesson Planning, Digital Tools" {...register('skills.teaching')} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="softSkills">Soft Skills</Label>
                        <Input id="softSkills" placeholder="e.g., Communication, Classroom Management" {...register('skills.soft')} />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Documents */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold font-headline flex items-center"><FileText className="mr-2"/>E. Documents for Verification</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="govId">Government ID Proof (Aadhaar, PAN)</Label>
                        <Input id="govId" type="file" {...register('documents.govId')} />
                      </div>
                       <div className="space-y-2">
                        <Label htmlFor="educationCertificates">Educational Certificates</Label>
                        <Input id="educationCertificates" type="file" {...register('documents.educationCertificates')} multiple />
                      </div>
                       <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="experienceLetters">Experience Letters (optional but preferred)</Label>
                        <Input id="experienceLetters" type="file" {...register('documents.experienceLetters')} multiple />
                      </div>
                    </div>
                  </div>

                   <Separator />

                   {/* Social & Professional Links */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold font-headline flex items-center"><LinkIcon className="mr-2"/>F. Social & Professional Links (optional)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn Profile</Label>
                        <Input id="linkedin" {...register('socialLinks.linkedin')} />
                         {errors.socialLinks?.linkedin && <p className="text-destructive text-sm">{errors.socialLinks.linkedin.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="portfolio">Portfolio / Personal Website</Label>
                        <Input id="portfolio" {...register('socialLinks.portfolio')} />
                         {errors.socialLinks?.portfolio && <p className="text-destructive text-sm">{errors.socialLinks.portfolio.message}</p>}
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="demoVideo">Demo Teaching Video Link</Label>
                        <Input id="demoVideo" {...register('socialLinks.demoVideo')} />
                         {errors.socialLinks?.demoVideo && <p className="text-destructive text-sm">{errors.socialLinks.demoVideo.message}</p>}
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
                      <h3 className="text-xl font-semibold font-headline flex items-center"><UserIcon className="mr-2" /> A. Basic Information</h3>
                       <div className="space-y-2 pl-6">
                            <InfoField label="Full Name" value={profileData?.fullName} />
                            <InfoField label="Gender" value={profileData?.gender} />
                            <InfoField label="Date of Birth" value={profileData?.dob} />
                            <InfoField label="Contact" value={profileData?.contactNumber} />
                            <InfoField label="Email" value={profileData?.email} />
                            <InfoField label="Location" value={`${profileData?.currentLocation?.city}, ${profileData?.currentLocation?.state} - ${profileData?.currentLocation?.pinCode}`} />
                       </div>
                  </div>
                  <Separator/>
                   <div className="space-y-4">
                      <h3 className="text-xl font-semibold font-headline flex items-center"><Briefcase className="mr-2"/>B. Professional Details</h3>
                       <div className="space-y-2 pl-6">
                            <InfoField label="Role" value={profileData?.professionalDetails?.jobTitle} />
                            <InfoField label="Experience" value={`${profileData?.professionalDetails?.totalExperience} years`} />
                            <InfoField label="Subjects" value={profileData?.professionalDetails?.subjects} />
                            <InfoField label="Qualifications" value={profileData?.professionalDetails?.qualifications} />
                            <InfoField label="Grades Taught" value={profileData?.professionalDetails?.gradesTaught} />
                            <InfoField label="Curriculum" value={profileData?.professionalDetails?.curriculumExpertise} />
                       </div>
                  </div>
                  <Separator/>
                   <div className="space-y-4">
                      <h3 className="text-xl font-semibold font-headline flex items-center"><Award className="mr-2"/>C. Work History & Achievements</h3>
                       <div className="pl-6">
                          <p className="font-semibold text-muted-foreground">Previous Schools/Colleges</p>
                          <ul className="list-disc pl-5 mt-2">
                             {profileData?.workHistory?.map((job, index) => (
                               <li key={index}>{job.school} ({job.duration})</li>
                             ))}
                             {(!profileData?.workHistory || profileData.workHistory.length === 0) && <p>Not provided</p>}
                          </ul>
                          <div className="mt-4">
                            <InfoField label="Achievements" value={profileData?.achievements} />
                          </div>
                       </div>
                  </div>
                   <Separator/>
                   <div className="space-y-4">
                      <h3 className="text-xl font-semibold font-headline flex items-center"><Lightbulb className="mr-2"/>D. Skills</h3>
                       <div className="space-y-2 pl-6">
                           <InfoField label="Teaching Skills" value={profileData?.skills?.teaching} />
                           <InfoField label="Soft Skills" value={profileData?.skills?.soft} />
                       </div>
                  </div>
                   <Separator/>
                   <div className="space-y-4">
                      <h3 className="text-xl font-semibold font-headline flex items-center"><LinkIcon className="mr-2"/>F. Social & Professional Links</h3>
                       <div className="space-y-2 pl-6">
                          <InfoField label="LinkedIn" value={profileData?.socialLinks?.linkedin} />
                          <InfoField label="Portfolio" value={profileData?.socialLinks?.portfolio} />
                          <InfoField label="Demo Video" value={profileData?.socialLinks?.demoVideo} />
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
