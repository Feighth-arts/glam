import { NextResponse } from 'next/server';
import { querySTKStatus } from '@/lib/mpesa';

export async function POST(request) {
  try {
    const { checkoutRequestID } = await request.json();

    const statusResponse = await querySTKStatus(checkoutRequestID);

    return NextResponse.json({
      success: true,
      resultCode: statusResponse.ResultCode,
      resultDesc: statusResponse.ResultDesc
    });
  } catch (error) {
    console.error('Query STK status error:', error);
    // Return pending status for demo mode when API fails
    return NextResponse.json({
      success: true,
      resultCode: 1032, // Request pending
      resultDesc: 'Request pending'
    });
  }
}
