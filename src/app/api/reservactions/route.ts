// /api/reservations - Placeholder
import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';

export async function GET() {
  // TODO: Implement logic to get reservations
  return NextResponse.json({ message: 'Reservations API - GET endpoint' });
}

export async function POST(request: Request) {
  const { firestore } = initializeFirebase();
  try {
    const { servicio, fecha, hora, usuario } = await request.json();
    
    // Basic validation
    if (!servicio || !fecha || !hora || !usuario) {
      return NextResponse.json({ success: false, message: 'Missing required fields.' }, { status: 400 });
    }

    const docRef = await addDoc(collection(firestore, "reservations"), {
      servicio,
      fecha,
      hora,
      usuario,
      estado: "pendiente"
    });

    return NextResponse.json({ success: true, message: "Reserva creada", id: docRef.id });
  } catch (error: any) {
    console.error("Error creating reservation: ", error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to create reservation.' }, { status: 500 });
  }
}
