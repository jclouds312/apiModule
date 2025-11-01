// This file seems to be a typo of /api/reservations/route.ts and can be removed.
// To avoid breaking changes, I will leave it for now but the main logic is in /api/reservations/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'This endpoint is deprecated. Use /api/reservations instead.' });
}

export async function POST() {
    return NextResponse.json({ message: 'This endpoint is deprecated. Use /api/reservations instead.' });
}
