// /api/reports - Implemented
import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';

export async function GET() {
  const { firestore } = initializeFirebase();
  try {
    const salesCollection = collection(firestore, "sales");
    const salesSnapshot = await getDocs(salesCollection);
    
    const salesData = salesSnapshot.docs.map(doc => doc.data());
    const totalSales = salesData.reduce((sum, sale) => sum + (sale.total || 0), 0);
    const numSales = salesSnapshot.size;

    return NextResponse.json({ 
        totalSales, 
        numSales 
    });
  } catch (error: any) {
    console.error("Error fetching sales report: ", error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to generate report.' }, { status: 500 });
  }
}
