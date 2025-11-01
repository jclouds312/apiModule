// /api/retell/webhook
import { NextResponse } from 'next/server';

/**
 * Handles webhook events from Retell AI.
 * This endpoint receives notifications about call events, transcriptions, etc.
 */
export async function POST(request: Request) {
  try {
    // It's crucial to validate the webhook signature in a production environment
    // using the RETELL_WEBHOOK_SECRET.
    const body = await request.json();

    // For now, we'll just log the received event.
    // In a real application, you would process this event, e.g.,
    // - Save conversation transcripts to Firestore.
    // - Trigger other backend processes based on call status.
    console.log('Retell AI webhook received:', JSON.stringify(body, null, 2));

    // Retell AI expects a 200 OK response to acknowledge receipt of the webhook.
    return NextResponse.json({ status: 'ok' });
  } catch (error: any) {
    console.error('Error processing Retell AI webhook:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to process webhook.' }, { status: 500 });
  }
}

// You can also add a GET handler for verification purposes if Retell requires one.
export async function GET() {
    return NextResponse.json({ message: 'Retell AI webhook endpoint is active.' });
}
