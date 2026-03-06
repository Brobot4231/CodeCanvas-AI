'use server';
/**
 * @fileOverview An AI agent that provides optimized versions of code based on a code review.
 *
 * - codeOptimizationSuggestion - A function that handles the code optimization process.
 * - CodeOptimizationSuggestionInput - The input type for the codeOptimizationSuggestion function.
 * - CodeOptimizationSuggestionOutput - The return type for the codeOptimizationSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CodeOptimizationSuggestionInputSchema = z.object({
  originalCode: z.string().describe('The original code to be optimized.'),
  codeReview: z
    .string()
    .describe(
      'A detailed review of the code, highlighting pros, cons, and areas for improvement.'
    ),
});
export type CodeOptimizationSuggestionInput = z.infer<
  typeof CodeOptimizationSuggestionInputSchema
>;

const CodeOptimizationSuggestionOutputSchema = z.object({
  optimizedCode: z.string().describe('The AI-generated optimized version of the code.'),
});
export type CodeOptimizationSuggestionOutput = z.infer<
  typeof CodeOptimizationSuggestionOutputSchema
>;

export async function codeOptimizationSuggestion(
  input: CodeOptimizationSuggestionInput
): Promise<CodeOptimizationSuggestionOutput> {
  return codeOptimizationSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'codeOptimizationSuggestionPrompt',
  input: {schema: CodeOptimizationSuggestionInputSchema},
  output: {schema: CodeOptimizationSuggestionOutputSchema},
  prompt: `You are an expert software engineer specializing in code optimization. Your task is to refactor the provided original code based on the code review to improve its time and space complexity, and address any flaws mentioned.

Original Code:
{{originalCode}}

Code Review:
{{codeReview}}

Optimized Code (only provide the code, no explanations or additional text):`,
});

const codeOptimizationSuggestionFlow = ai.defineFlow(
  {
    name: 'codeOptimizationSuggestionFlow',
    inputSchema: CodeOptimizationSuggestionInputSchema,
    outputSchema: CodeOptimizationSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
