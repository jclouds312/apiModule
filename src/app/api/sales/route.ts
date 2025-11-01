// /api/sales
import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

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
