// /api/voice/quote - Placeholder
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // TODO: Implement logic for voice to quote
  // The primary logic is handled by the Genkit flow: 'voiceCommandToQuote'
  // This endpoint can be used for webhooks or other non-interactive triggers.
  // const formData = await request.formData();
  // const audio = formData.get('audio');
  return NextResponse.json({ message: 'Voice API - Quote endpoint. Logic is handled by Genkit flow.' });
}
