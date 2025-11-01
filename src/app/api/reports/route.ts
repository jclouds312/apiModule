// /api/reports
import { NextResponse } from 'next/server';
import { getSalesReport } from '@/lib/actions';

export async function GET() {
  try {
    const reportData = await getSalesReport();
    return NextResponse.json(reportData);
  } catch (error: any) {
    console.error("Error fetching sales report via API: ", error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to generate report.' }, { status: 500 });
  }
}
