'use server';
/**
 * @fileOverview An AI agent that provides a detailed review of code.
 *
 * - codeReviewAnalysis - A function that handles the code review process.
 * - CodeReviewAnalysisInput - The input type for the codeReviewAnalysis function.
 * - CodeReviewAnalysisOutput - The return type for the codeReviewAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CodeReviewAnalysisInputSchema = z.object({
  code: z.string().describe('The code to be reviewed.'),
});
export type CodeReviewAnalysisInput = z.infer<typeof CodeReviewAnalysisInputSchema>;

const CodeReviewAnalysisOutputSchema = z.object({
  review: z.object({
    pros: z
      .array(z.string())
      .describe('An array of positive aspects or strengths of the code.'),
    cons: z
      .array(z.string())
      .describe('An array of negative aspects, flaws, or weaknesses of the code.'),
    improvements: z
      .array(z.string())
      .describe(
        'An array of specific suggestions for improving readability, structure, performance, or best practices.'
      ),
    overallSummary:
      z.string().describe('A comprehensive summary of the code quality and overall assessment.'),
  }),
});
export type CodeReviewAnalysisOutput = z.infer<typeof CodeReviewAnalysisOutputSchema>;

export async function codeReviewAnalysis(
  input: CodeReviewAnalysisInput
): Promise<CodeReviewAnalysisOutput> {
  return codeReviewAnalysisFlow(input);
}

const codeReviewPrompt = ai.definePrompt({
  name: 'codeReviewPrompt',
  input: {schema: CodeReviewAnalysisInputSchema},
  output: {schema: CodeReviewAnalysisOutputSchema},
  prompt: `You are an expert software engineer and code reviewer.
Your task is to provide a detailed and constructive review of the provided code.
Identify its pros, cons, and suggest specific improvements for readability, structure, adherence to best practices, and potential performance optimizations.

Code to review:
\`\`\`
{{{code}}}
\`\`\`

Please provide your review in a structured JSON format, including arrays for 'pros', 'cons', and 'improvements', and a string for 'overallSummary'.`,
});

const codeReviewAnalysisFlow = ai.defineFlow(
  {
    name: 'codeReviewAnalysisFlow',
    inputSchema: CodeReviewAnalysisInputSchema,
    outputSchema: CodeReviewAnalysisOutputSchema,
  },
  async input => {
    const {output} = await codeReviewPrompt(input);
    return output!;
  }
);
