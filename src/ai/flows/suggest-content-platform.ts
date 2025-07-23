// This file is machine-generated - edit at your own risk.

'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting the most appropriate content platform.
 *
 * - suggestContentPlatform - A function that takes content text as input and suggests a platform.
 * - SuggestContentPlatformInput - The input type for the suggestContentPlatform function.
 * - SuggestContentPlatformOutput - The return type for the suggestContentPlatform function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestContentPlatformInputSchema = z.object({
  content: z.string().describe('The content to be posted on a platform.'),
  userProfile: z.string().optional().describe('The user profile details including resume and other details.'),
});
export type SuggestContentPlatformInput = z.infer<typeof SuggestContentPlatformInputSchema>;

const SuggestContentPlatformOutputSchema = z.object({
  platformSuggestion: z.string().describe('The suggested platform for the content.'),
  reasoning: z.string().describe('The reasoning behind the platform suggestion.'),
});
export type SuggestContentPlatformOutput = z.infer<typeof SuggestContentPlatformOutputSchema>;

export async function suggestContentPlatform(input: SuggestContentPlatformInput): Promise<SuggestContentPlatformOutput> {
  return suggestContentPlatformFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestContentPlatformPrompt',
  input: {schema: SuggestContentPlatformInputSchema},
  output: {schema: SuggestContentPlatformOutputSchema},
  prompt: `Given the following content and user profile, suggest the most appropriate platform for posting the content.

Content: {{{content}}}

User Profile: {{{userProfile}}}

Consider platforms like Twitter, LinkedIn, Facebook, Instagram, TikTok, and personal blogs.

Your response should include the suggested platform and a brief explanation of why that platform is suitable.

{{#if userProfile}}
Take into account the user profile information when suggesting a platform. They might have a professional focus, or a creative one, or something else. Pick a platform that amplifies their brand.
{{/if}}
`,
});

const suggestContentPlatformFlow = ai.defineFlow(
  {
    name: 'suggestContentPlatformFlow',
    inputSchema: SuggestContentPlatformInputSchema,
    outputSchema: SuggestContentPlatformOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
