// PDF Generation Utilities
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateProviderReport = (reportType, data) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  // Header
  doc.setFontSize(20);
  doc.text('Glamease Provider Report', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`Report Type: ${reportType}`, 20, 35);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 45);
  
  let yPosition = 60;

  switch (reportType) {
    case 'earnings':
      doc.setFontSize(16);
      doc.text('Monthly Earnings Breakdown', 20, yPosition);
      yPosition += 15;
      
      const earningsData = data.monthlyEarnings || [];
      autoTable(doc, {
        startY: yPosition,
        head: [['Month', 'Bookings', 'Revenue', 'Commission', 'Net Earnings']],
        body: earningsData.map(month => [
          month.month,
          month.bookings.toString(),
          `KES ${month.revenue.toLocaleString()}`,
          `KES ${month.commission.toLocaleString()}`,
          `KES ${month.netEarnings.toLocaleString()}`
        ])
      });
      break;

    case 'services':
      doc.setFontSize(16);
      doc.text('Service Performance Report', 20, yPosition);
      yPosition += 15;
      
      const servicesData = data.services || [];
      autoTable(doc, {
        startY: yPosition,
        head: [['Service', 'Bookings', 'Revenue', 'Avg Rating']],
        body: servicesData.map(service => [
          service.name,
          service.bookings?.toString() || '0',
          `KES ${service.revenue?.toLocaleString() || '0'}`,
          service.rating?.toString() || '0'
        ])
      });
      break;

    case 'clients':
      doc.setFontSize(16);
      doc.text('Client Analysis Report', 20, yPosition);
      yPosition += 15;
      
      const clientsData = data.topClients || [];
      autoTable(doc, {
        startY: yPosition,
        head: [['Client', 'Bookings', 'Total Spent', 'Last Visit']],
        body: clientsData.map(client => [
          client.name,
          client.bookings.toString(),
          `KES ${client.totalSpent.toLocaleString()}`,
          client.lastVisit
        ])
      });
      break;

    default:
      doc.text('Report data not available', 20, yPosition);
  }
  
  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 30, doc.internal.pageSize.height - 10);
  }
  
  doc.save(`provider-${reportType}-report.pdf`);
};

export const generateClientReport = (reportType, data) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  // Header
  doc.setFontSize(20);
  doc.text('Glamease Client Report', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`Report Type: ${reportType}`, 20, 35);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 45);
  
  let yPosition = 60;

  switch (reportType) {
    case 'spending':
      doc.setFontSize(16);
      doc.text('Spending Analysis', 20, yPosition);
      yPosition += 15;
      
      const spendingData = data.monthlySpending || [];
      autoTable(doc, {
        startY: yPosition,
        head: [['Month', 'Bookings', 'Amount Spent', 'Points Earned']],
        body: spendingData.map(month => [
          month.month,
          month.bookings.toString(),
          `KES ${month.amount.toLocaleString()}`,
          month.points.toString()
        ])
      });
      break;

    case 'services':
      doc.setFontSize(16);
      doc.text('Service History', 20, yPosition);
      yPosition += 15;
      
      const servicesData = data.serviceBreakdown || [];
      autoTable(doc, {
        startY: yPosition,
        head: [['Service', 'Count', 'Total Spent', 'Percentage']],
        body: servicesData.map(service => [
          service.service,
          service.count.toString(),
          `KES ${service.amount.toLocaleString()}`,
          `${service.percentage}%`
        ])
      });
      break;

    case 'points':
      doc.setFontSize(16);
      doc.text('Points Summary', 20, yPosition);
      yPosition += 15;
      
      autoTable(doc, {
        startY: yPosition,
        head: [['Metric', 'Value']],
        body: [
          ['Total Points Earned', data.totalPointsEarned?.toString() || '0'],
          ['Points Redeemed', data.pointsRedeemed?.toString() || '0'],
          ['Current Balance', data.currentPoints?.toString() || '0'],
          ['Current Tier', data.tier || 'Bronze']
        ]
      });
      break;

    default:
      doc.text('Report data not available', 20, yPosition);
  }
  
  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 30, doc.internal.pageSize.height - 10);
  }
  
  doc.save(`client-${reportType}-report.pdf`);
};

export const generateAdminReport = (reportType, data) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  // Header
  doc.setFontSize(20);
  doc.text('Glamease Admin Report', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`Report Type: ${reportType}`, 20, 35);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 45);
  
  let yPosition = 60;

  switch (reportType) {
    case 'overview':
      doc.setFontSize(16);
      doc.text('Platform Overview', 20, yPosition);
      yPosition += 15;
      
      autoTable(doc, {
        startY: yPosition,
        head: [['Metric', 'Value']],
        body: [
          ['Total Users', data.totalUsers?.toString() || '0'],
          ['Total Providers', data.totalProviders?.toString() || '0'],
          ['Total Clients', data.totalClients?.toString() || '0'],
          ['Total Revenue', `KES ${data.totalRevenue?.toLocaleString() || '0'}`],
          ['Platform Commission', `KES ${data.totalCommission?.toLocaleString() || '0'}`],
          ['Active Bookings', data.activeBookings?.toString() || '0']
        ]
      });
      break;

    case 'financial':
      doc.setFontSize(16);
      doc.text('Financial Summary', 20, yPosition);
      yPosition += 15;
      
      const monthlyData = data.monthlyMetrics || [];
      autoTable(doc, {
        startY: yPosition,
        head: [['Month', 'Revenue', 'Bookings', 'Commission', 'New Users']],
        body: monthlyData.map(month => [
          month.month,
          `KES ${month.revenue.toLocaleString()}`,
          month.bookings.toString(),
          `KES ${Math.round(month.revenue * 0.15).toLocaleString()}`,
          month.users.toString()
        ])
      });
      break;

    case 'providers':
      doc.setFontSize(16);
      doc.text('Provider Performance', 20, yPosition);
      yPosition += 15;
      
      const providersData = data.topProviders || [];
      autoTable(doc, {
        startY: yPosition,
        head: [['Provider', 'Rating', 'Bookings', 'Revenue', 'Commission']],
        body: providersData.map(provider => [
          provider.name,
          provider.rating.toString(),
          provider.bookings.toString(),
          `KES ${provider.revenue.toLocaleString()}`,
          `KES ${provider.commission.toLocaleString()}`
        ])
      });
      break;

    default:
      doc.text('Report data not available', 20, yPosition);
  }
  
  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 30, doc.internal.pageSize.height - 10);
  }
  
  doc.save(`admin-${reportType}-report.pdf`);
};