// /api/notifications
import { NextResponse } from 'next/server';
import { sendTestNotification } from '@/lib/actions';

export async function POST(request: Request) {
  try {
    const { destino, mensaje } = await request.json();

    if (!destino || !mensaje) {
        return NextResponse.json({ success: false, message: 'Missing "destino" or "mensaje" in request body.' }, { status: 400 });
    }
    
    // The core logic is in the server action, but we can still use this route
    // for external triggers. We'll just log here.
    console.log(`API Route: Sending notification to ${destino}: "${mensaje}"`);
    
    // You could call the action directly, or just return a success message
    // if the main purpose of the action is for UI interaction.
    const result = await sendTestNotification(); // This is just an example call

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    console.error("Error in notifications API: ", error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to process notification request.' }, { status: 500 });
  }
}
