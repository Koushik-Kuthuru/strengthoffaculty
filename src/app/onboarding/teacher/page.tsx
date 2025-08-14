
"use client";

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { updateUserProfile } from '@/lib/firebase';
import { Trash2, PlusCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

const workHistorySchema = z.object({
  school: z.string().min(1, "School/College name is required"),
  duration: z.string().min(1, "Duration is required"),
});

const teacherProfileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').optional(),
  profilePhoto: z.any().optional(),
  gender: z.string().min(1, 'Please select a gender').optional(),
  dob: z.string().min(1, 'Date of birth is required').optional(),
  contactNumber: z.string().min(10, 'Enter a valid contact number').optional(),
  email: z.string().email('Invalid email address').optional(),
  currentLocation: z.object({
    city: z.string().min(1, 'City is required').optional(),
    state: z.string().min(1, 'State is required').optional(),
    pinCode: z.string().length(6, 'Pin code must be 6 digits').optional(),
  }),
  professionalDetails: z.object({
    jobTitle: z.string().min(1, 'Job title is required').optional(),
    totalExperience: z.string().min(1, 'Experience is required').optional(),
    subjects: z.string().min(1, 'Subjects are required').optional(),
    qualifications: z.string().min(1, 'Qualifications are required').optional(),
    gradesTaught: z.string().min(1, 'Grades taught is required').optional(),
    curriculumExpertise: z.string().min(1, 'Curriculum expertise is required').optional(),
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

const getTotalFields = (data: any): [number, number] => {
    let totalFields = 0;
    let filledFields = 0;

    const checkField = (value: any) => {
        totalFields++;
        if (value !== undefined && value !== null && value !== '' && (!Array.isArray(value) || value.length > 0)) {
            if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
                if (Object.keys(value).length > 0) {
                     const [subTotal, subFilled] = getTotalFields(value);
                     totalFields += subTotal -1;
                     filledFields += subFilled;
                }
            } else {
                filledFields++;
            }
        }
    };
    
    Object.values(data).forEach(checkField);

    // a little hacky, but need to adjust for the nested objects
    return [totalFields - 6, filledFields];
};


export default function CompleteTeacherProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { register, handleSubmit, control, formState: { errors, isSubmitting }, getValues } = useForm<TeacherProfileForm>({
    resolver: zodResolver(teacherProfileSchema),
    defaultValues: {
      workHistory: [],
    }
  });
  
  const [progress, setProgress] = useState(0);
  const formValues = useWatch({ control });

  useEffect(() => {
    const [total, filled] = getTotalFields(getValues());
    const newProgress = total > 0 ? (filled / total) * 100 : 0;
    setProgress(newProgress);
  }, [formValues, getValues]);


  const { fields, append, remove } = useFieldArray({
    control,
    name: "workHistory",
  });

  const onSubmit = async (data: TeacherProfileForm) => {
    try {
      // Here you would handle file uploads and get their URLs
      const profileData = {
        ...data,
        profilePhotoUrl: '', // Replace with actual URL after upload
        govIdUrl: '',
        educationCertificatesUrl: '',
        experienceLettersUrl: '',
        profileCompleted: true,
      };

      await updateUserProfile(profileData);
      toast({ title: 'Profile completed successfully!' });
      router.push('/dashboard');
    } catch (error) {
      console.error('Profile completion error:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem saving your profile. Please try again.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 py-12">
      <div className="container mx-auto max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-headline">Complete Your Teacher Profile</CardTitle>
            <CardDescription>Provide the following details to get matched with the right opportunities.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-8">
              <div className="flex justify-between">
                <Label>Profile Completion</Label>
                <span className="text-sm font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} />
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold font-headline">A. Basic Information</h3>
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
                    <Select onValueChange={(value) => register('gender', { value })}>
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
                <h3 className="text-xl font-semibold font-headline">B. Professional Details</h3>
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
                <h3 className="text-xl font-semibold font-headline">C. Work History</h3>
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
                <h3 className="text-xl font-semibold font-headline">D. Skills</h3>
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
                <h3 className="text-xl font-semibold font-headline">E. Documents for Verification</h3>
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
                <h3 className="text-xl font-semibold font-headline">F. Social & Professional Links (optional)</h3>
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

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save and Complete Profile'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

