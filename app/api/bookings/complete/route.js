// This endpoint is deprecated - use PUT /api/bookings/[id] with status: 'COMPLETED' instead
// Points awarding is handled in the main booking update endpoint
import { NextResponse } from 'next/server';

export async function POST(request) {
  return NextResponse.json({ 
    error: 'This endpoint is deprecated. Use PUT /api/bookings/[id] instead' 
  }, { status: 410 });
}
