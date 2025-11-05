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
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
