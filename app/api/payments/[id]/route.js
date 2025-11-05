import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const { transactionId, phoneNumber } = await request.json();

    const payment = await prisma.payment.update({
      where: { id },
      data: {
        transactionId,
        phoneNumber,
        status: 'COMPLETED'
      }
    });

    return NextResponse.json(payment);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
