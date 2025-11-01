// /api/maps/[...slug]
import { NextResponse } from 'next/server';
import { findNearbyPlaces, geocodeAddress } from '@/lib/actions';

// This API route is now primarily for client-side use cases that do not expose sensitive keys.
// The main logic has been moved to Server Actions for security.

export async function GET(request: Request, { params }: { params: { slug: string[] } }) {
  const [action] = params.slug;
  const { searchParams } = new URL(request.url);

  try {
    switch (action) {
      case 'geocode': {
        const address = searchParams.get('address');
        if (!address) {
          return NextResponse.json({ success: false, message: 'Address parameter is required.' }, { status: 400 });
        }
        // Calls the secure server action
        const data = await geocodeAddress(address);
        return NextResponse.json(data);
      }
      
      case 'places': {
        const lat = searchParams.get('lat');
        const lng = searchParams.get('lng');
        const type = searchParams.get('type');
        if (!lat || !lng || !type) {
            return NextResponse.json({ success: false, message: 'lat, lng, and type parameters are required.' }, { status: 400 });
        }
        // Calls the secure server action
        const data = await findNearbyPlaces(parseFloat(lat), parseFloat(lng), type);
        return NextResponse.json(data);
      }

      default:
        return NextResponse.json({ success: false, message: 'Invalid Google Maps API action.' }, { status: 404 });
    }
  } catch (error: any) {
    console.error(`Error in /api/maps/${action}: `, error);
    return NextResponse.json({ success: false, message: error.message || `Failed to perform ${action}.` }, { status: 500 });
  }
}
