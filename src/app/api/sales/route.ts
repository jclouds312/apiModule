// /api/sales - Placeholder
import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';

export async function GET() {
  const { firestore } = initializeFirebase();
  try {
    const productsCollection = collection(firestore, "products");
    const productSnapshot = await getDocs(productsCollection);
    const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(productList);
  } catch (error: any) {
    console.error("Error fetching products: ", error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to fetch products.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  // TODO: Implement logic to create a sale
  const body = await request.json();
  return NextResponse.json({ message: 'Sales API - POST endpoint', data: body });
}
