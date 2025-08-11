'use server';

/**
 * @fileOverview Job requirement analysis flow for institutions to identify suitable teacher profiles.
 *
 * - analyzeJobRequirements - Analyzes job requirements and provides a match score.
 * - JobRequirementsInput - The input type for the analyzeJobRequirements function.
 * - JobRequirementsOutput - The return type for the analyzeJobRequirements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const JobRequirementsInputSchema = z.object({
  jobTitle: z.string().describe('The title of the job posting.'),
  subject: z.string().describe('The subject area for the job.'),
  location: z.string().describe('The location of the job.'),
  requirements: z.string().describe('Detailed requirements for the job, including qualifications and experience.'),
  teacherProfile: z.string().describe('Teacher profile including qualifications and experience.'),
});
export type JobRequirementsInput = z.infer<typeof JobRequirementsInputSchema>;

const JobRequirementsOutputSchema = z.object({
  matchScore: z.number().describe('A score indicating how well the teacher profile matches the job requirements (0-100).'),
  reasons: z.string().describe('Reasons for the match score, highlighting strengths and weaknesses of the candidate.'),
});
export type JobRequirementsOutput = z.infer<typeof JobRequirementsOutputSchema>;

export async function analyzeJobRequirements(input: JobRequirementsInput): Promise<JobRequirementsOutput> {
  return analyzeJobRequirementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'jobRequirementsPrompt',
  input: {schema: JobRequirementsInputSchema},
  output: {schema: JobRequirementsOutputSchema},
  prompt: `You are an AI assistant specializing in matching teacher profiles to job requirements.

  Given the following job requirements and a teacher profile, analyze how well the teacher matches the requirements.
  Provide a match score between 0 and 100, and explain the reasons for the score.

  Job Title: {{{jobTitle}}}
  Subject: {{{subject}}}
  Location: {{{location}}}
  Job Requirements: {{{requirements}}}

  Teacher Profile: {{{teacherProfile}}}

  Consider factors such as qualifications, experience, subject expertise, and location preferences.
  The match score should reflect the overall suitability of the teacher for the job.
  Reasons must contain a section mentioning the strengths of the candidate, and another section about the weaknesses of the candidate.
  Reasons must contain a bullet point list in markdown format.
  `,
});

const analyzeJobRequirementsFlow = ai.defineFlow(
  {
    name: 'analyzeJobRequirementsFlow',
    inputSchema: JobRequirementsInputSchema,
    outputSchema: JobRequirementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
