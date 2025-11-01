// /api/status
import { NextResponse } from 'next/server';
import { getApiStatus } from '@/lib/actions';

export async function GET() {
  const status = await getApiStatus();
  return NextResponse.json(status);
}
