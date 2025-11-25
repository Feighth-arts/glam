import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId, getUserRole } from '@/lib/auth-helper';

export async function GET(request) {
  try {
    const userId = getUserId(request);
    const userRole = getUserRole(request);
    
    if (!userId || userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tickets = await prisma.supportTicket.findMany({
      include: { user: { select: { name: true, role: true } } },
      orderBy: { createdAt: 'desc' }
    });

    const formattedTickets = tickets.map(t => ({
      id: t.id,
      subject: t.subject,
      description: t.description,
      user: t.user.name,
      userType: t.user.role.toLowerCase(),
      priority: t.priority.toLowerCase(),
      status: t.status.toLowerCase().replace('_', '-'),
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
      assignedTo: 'Admin Team'
    }));

    return NextResponse.json({ tickets: formattedTickets, disputes: [] });
  } catch (error) {
    console.error('Admin support GET error:', error);
    return NextResponse.json({ tickets: [], disputes: [] });
  }
}

export async function PATCH(request) {
  try {
    const userId = getUserId(request);
    const userRole = getUserRole(request);
    
    if (!userId || userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { ticketId, action } = await request.json();
    
    let status = 'OPEN';
    if (action === 'assign') status = 'IN_PROGRESS';
    if (action === 'resolve') status = 'RESOLVED';

    await prisma.supportTicket.update({
      where: { id: ticketId },
      data: { status }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin support PATCH error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
