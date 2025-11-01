// /api/reservations
import { NextResponse } from 'next/server';
import { getReservations, createReservation } from '@/lib/actions';

export async function GET() {
  try {
    const reservationList = await getReservations();
    return NextResponse.json(reservationList);
  } catch (error: any) {
    console.error("Error fetching reservations via API route: ", error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to fetch reservations.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { service, date, time, userId } = body;
    
    if (!service || !date || !time || !userId) {
      return NextResponse.json({ success: false, message: 'Missing required fields.' }, { status: 400 });
    }

    const result = await createReservation(body);

    if (result.success) {
      return NextResponse.json({ success: true, message: "Reserva creada", id: result.id });
    } else {
      throw new Error(result.message);
    }
  } catch (error: any) {
    console.error("Error creating reservation: ", error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to create reservation.' }, { status: 500 });
  }
}
