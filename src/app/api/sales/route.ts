// /api/sales
import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/actions';

// This API route can be used by external services to get product data.
// The primary logic is now in the server action.
export async function GET() {
  try {
    const productList = await getProducts();
    return NextResponse.json(productList);
  } catch (error: any) {
    console.error("Error fetching products via API route: ", error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to fetch products.' }, { status: 500 });
  }
}

// The POST logic for creating products via API can remain if needed for external use.
import { initializeFirebase } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';

export async function POST(request: Request) {
  const { firestore } = initializeFirebase();
  try {
    const { name, price, category, stock } = await request.json();
    if (!name || !price || !category || !stock) {
      return NextResponse.json({ success: false, message: 'Missing required fields for product.' }, { status: 400 });
    }
    const docRef = await addDoc(collection(firestore, "products"), { name, price, category, stock });
    return NextResponse.json({ success: true, message: "Product created", id: docRef.id });
  } catch (error: any) {
    console.error("Error creating product: ", error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to create product.' }, { status: 500 });
  }
}
