// /api/reservations - Placeholder
import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export async function GET() {
  const { firestore } = initializeFirebase();
  try {
    const reservationsCollection = collection(firestore, "reservations");
    const snapshot = await getDocs(reservationsCollection);
    const reservationList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(reservationList);
  } catch (error: any) {
    console.error("Error fetching reservations: ", error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to fetch reservations.' }, { status: 500 });
  }
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
