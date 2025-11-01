'use server';

/**
 * @fileOverview Converts voice commands to a JSON quote and saves it to the database.
 *
 * - voiceCommandToQuote - A function that handles the voice command transcription and quote generation.
 * - VoiceCommandToQuoteInput - The input type for the voiceCommandTo... function.
 * - VoiceCommandToQuoteOutput - The return type for the voiceCommandTo... function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { initializeFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const VoiceCommandToQuoteInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      'Voice command as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
  userId: z.string().describe("The ID of the user creating the quote."),
});
export type VoiceCommandToQuoteInput = z.infer<typeof VoiceCommandToQuoteInputSchema>;

const VoiceCommandToQuoteOutputSchema = z.object({
  quote: z.record(z.any()).describe('The generated JSON quote from the voice command.'),
  transcription: z.string().describe('The transcription of the voice command.'),
  quoteId: z.string().describe('The ID of the saved quote document in Firestore.')
});
export type VoiceCommandToQuoteOutput = z.infer<typeof VoiceCommandToQuoteOutputSchema>;

export async function voiceCommandToQuote(input: VoiceCommandToQuoteInput): Promise<VoiceCommandToQuoteOutput> {
  return voiceCommandToQuoteFlow(input);
}

const voiceCommandToQuotePrompt = ai.definePrompt({
  name: 'voiceCommandToQuotePrompt',
  input: {schema: z.object({ audioDataUri: VoiceCommandToQuoteInputSchema.shape.audioDataUri })},
  output: {schema: z.object({
    quote: VoiceCommandToQuoteOutputSchema.shape.quote,
    transcription: VoiceCommandToQuoteOutputSchema.shape.transcription,
  })},
  prompt: `Transcribe the following voice command and generate a JSON quote based on the transcription.

Voice Command: {{media url=audioDataUri}}

Transcription:  Based on the voice command, generate an accurate transcription.

JSON Quote: Create a structured JSON quote object based on the transcribed voice command. The quote should include fields like 'service', 'details', and 'estimatedPrice'. Ensure the JSON is well-formed. If the voice command does not contain enough information to create a quote, return an empty JSON object: {}.`,
});

const voiceCommandToQuoteFlow = ai.defineFlow(
  {
    name: 'voiceCommandToQuoteFlow',
    inputSchema: VoiceCommandToQuoteInputSchema,
    outputSchema: VoiceCommandToQuoteOutputSchema,
  },
  async (input) => {
    const {firestore} = initializeFirebase();

    // 1. Generate transcription and quote from audio
    const {output} = await voiceCommandToQuotePrompt({ audioDataUri: input.audioDataUri });
    if (!output) {
      throw new Error("Failed to get a response from the AI model.");
    }
    const { quote, transcription } = output;

    // 2. Save the quote to Firestore
    // Using 'quotes' collection as defined in backend.json
    const quotesCollection = collection(firestore, 'quotes');
    const newQuoteRef = await addDoc(quotesCollection, {
      userId: input.userId,
      transcription: transcription,
      quoteDetails: quote,
      createdAt: serverTimestamp(),
      status: 'generated', // You can use this field to track quote status
    });

    // 3. Return the result including the new document ID
    return {
      quote,
      transcription,
      quoteId: newQuoteRef.id
    };
  }
);
