// /api/voice/quote - Placeholder
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // TODO: Implement logic for voice to quote
  // const formData = await request.formData();
  // const audio = formData.get('audio');
  return NextResponse.json({ message: 'Voice API - Quote endpoint' });
}
