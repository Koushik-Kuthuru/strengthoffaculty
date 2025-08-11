'use server';
/**
 * @fileOverview Implements AI-powered profile analysis for teachers, extracting key skills and experience to match with relevant job postings.
 *
 * - profileAnalysis - A function that handles the profile analysis process.
 * - ProfileAnalysisInput - The input type for the profileAnalysis function.
 * - ProfileAnalysisOutput - The return type for the profileAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProfileAnalysisInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "A resume document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>' for analysis."
    ),
  jobDescription: z.string().describe('The job description to match the resume against.'),
});
export type ProfileAnalysisInput = z.infer<typeof ProfileAnalysisInputSchema>;

const ProfileAnalysisOutputSchema = z.object({
  profileSummary: z.string().describe('A summary of the teacher profile, highlighting key skills and experience.'),
  matchScore: z.number().describe('A score indicating how well the teacher profile matches the job description.'),
  relevantSkills: z.array(z.string()).describe('A list of relevant skills extracted from the resume.'),
});
export type ProfileAnalysisOutput = z.infer<typeof ProfileAnalysisOutputSchema>;

export async function profileAnalysis(input: ProfileAnalysisInput): Promise<ProfileAnalysisOutput> {
  return profileAnalysisFlow(input);
}

const profileAnalysisPrompt = ai.definePrompt({
  name: 'profileAnalysisPrompt',
  input: {schema: ProfileAnalysisInputSchema},
  output: {schema: ProfileAnalysisOutputSchema},
  prompt: `You are an AI expert in matching teacher profiles to job descriptions.

  Analyze the following resume and job description to provide a profile summary, a match score (out of 100), and a list of relevant skills.

  Resume: {{media url=resumeDataUri}}
  Job Description: {{{jobDescription}}}

  Profile Summary:
  Match Score:
  Relevant Skills:`, // Ensure output is structured for easy parsing
});

const profileAnalysisFlow = ai.defineFlow(
  {
    name: 'profileAnalysisFlow',
    inputSchema: ProfileAnalysisInputSchema,
    outputSchema: ProfileAnalysisOutputSchema,
  },
  async input => {
    const {output} = await profileAnalysisPrompt(input);
    return output!;
  }
);
