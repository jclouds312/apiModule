'use server';

/**
 * @fileOverview Converts voice commands to a JSON quote and saves it to the database.
 *
 * - voiceCommandToQuote - A function that handles the voice command transcription and quote generation.
 * - VoiceCommandToQuoteInput - The input type for the voiceCommandToQuote function.
 * - VoiceCommandToQuoteOutput - The return type for the voiceCommandToQuote function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VoiceCommandToQuoteInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      'Voice command as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
});
export type VoiceCommandToQuoteInput = z.infer<typeof VoiceCommandToQuoteInputSchema>;

const VoiceCommandToQuoteOutputSchema = z.object({
  quote: z.record(z.any()).describe('The generated JSON quote from the voice command.'),
  transcription: z.string().describe('The transcription of the voice command.'),
});
export type VoiceCommandToQuoteOutput = z.infer<typeof VoiceCommandToQuoteOutputSchema>;

export async function voiceCommandToQuote(input: VoiceCommandToQuoteInput): Promise<VoiceCommandToQuoteOutput> {
  return voiceCommandToQuoteFlow(input);
}

const voiceCommandToQuotePrompt = ai.definePrompt({
  name: 'voiceCommandToQuotePrompt',
  input: {schema: VoiceCommandToQuoteInputSchema},
  output: {schema: VoiceCommandToQuoteOutputSchema},
  prompt: `Transcribe the following voice command and generate a JSON quote based on the transcription.

Voice Command: {{media url=audioDataUri}}

Transcription:  Based on the voice command, generate an accurate transcription.

JSON Quote: Create a structured JSON quote object based on the transcribed voice command. Ensure the JSON is well-formed.  If the voice command does not contain enough information to create a quote, return an empty JSON object: {}.`, // Changed prompt to fit output schema requirements
});

const voiceCommandToQuoteFlow = ai.defineFlow(
  {
    name: 'voiceCommandToQuoteFlow',
    inputSchema: VoiceCommandToQuoteInputSchema,
    outputSchema: VoiceCommandToQuoteOutputSchema,
  },
  async input => {
    const {output} = await voiceCommandToQuotePrompt(input);
    return output!;
  }
);
