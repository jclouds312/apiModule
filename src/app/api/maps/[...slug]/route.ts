// /api/maps/[...slug]
import { NextResponse } from 'next/server';

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api';

export async function GET(request: Request, { params }: { params: { slug: string[] } }) {
  const [action] = params.slug;
  const { searchParams } = new URL(request.url);

  if (!GOOGLE_MAPS_API_KEY) {
      return NextResponse.json({ success: false, message: 'Google Maps API key is not configured.' }, { status: 500 });
  }

  try {
    switch (action) {
      case 'geocode': {
        const address = searchParams.get('address');
        if (!address) {
          return NextResponse.json({ success: false, message: 'Address parameter is required.' }, { status: 400 });
        }
        const url = `${GOOGLE_MAPS_API_URL}/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`;
        const resp = await fetch(url);
        const data = await resp.json();
        return NextResponse.json(data);
      }
      
      case 'places': {
        const lat = searchParams.get('lat');
        const lng = searchParams.get('lng');
        const type = searchParams.get('type');
        if (!lat || !lng || !type) {
            return NextResponse.json({ success: false, message: 'lat, lng, and type parameters are required.' }, { status: 400 });
        }
        const url = `${GOOGLE_MAPS_API_URL}/place/nearbysearch/json?location=${lat},${lng}&radius=2000&type=${type}&key=${GOOGLE_MAPS_API_KEY}`;
        const resp = await fetch(url);
        const data = await resp.json();
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
