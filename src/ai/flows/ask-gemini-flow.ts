'use server';

/**
 * @fileOverview A simple flow to ask questions to the Gemini AI model.
 *
 * - askGemini - A function that takes a question and returns the AI's response.
 * - AskGeminiInput - The input type for the askGemini function.
 * - AskGeminiOutput - The return type for the askGemini function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AskGeminiInputSchema = z.object({
  question: z.string().describe('The question to ask the AI.'),
});
export type AskGeminiInput = z.infer<typeof AskYGeminiInputSchema>;

const AskGeminiOutputSchema = z.string().describe("The AI's answer.");
export type AskGeminiOutput = z.infer<typeof AskGeminiOutputSchema>;

export async function askGemini(input: AskGeminiInput): Promise<AskGeminiOutput> {
    return askGeminiFlow(input);
}

const askGeminiFlow = ai.defineFlow(
  {
    name: 'askGeminiFlow',
    inputSchema: AskGeminiInputSchema,
    outputSchema: AskGeminiOutputSchema,
  },
  async (input) => {
    const { text } = await ai.generate({
      prompt: input.question,
    });
    return text;
  }
);
