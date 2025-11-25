import { NextResponse } from 'next/server';
import { querySTKStatus } from '@/lib/mpesa';

export async function POST(request) {
  try {
    const { checkoutRequestID } = await request.json();

    // Always return pending - simulate-success will handle completion
    return NextResponse.json({
      success: true,
      resultCode: 1032,
      resultDesc: 'Request pending'
    });
  } catch (error) {
    console.error('Query STK status error:', error);
    return NextResponse.json({
      success: true,
      resultCode: 1032,
      resultDesc: 'Request pending'
    });
  }
}
