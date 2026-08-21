import jsPDF from 'jspdf';

export const generateAndDownloadGuide = () => {
  const doc = new jsPDF();
  let yPos = 20;
  const margin = 20;
  const lineHeight = 7;
  const pageHeight = doc.internal.pageSize.height;

  const checkPageBreak = (neededSpace: number) => {
    if (yPos + neededSpace > pageHeight - margin) {
      doc.addPage();
      yPos = margin;
    }
  };

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('BrandFlow Pro', margin, yPos);
  
  yPos += 10;
  doc.setFontSize(16);
  doc.setTextColor(100, 100, 100);
  doc.text('ERP Workflow Management User Guide', margin, yPos);
  
  yPos += 15;
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, doc.internal.pageSize.width - margin, yPos);
  
  yPos += 15;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  
  const addSection = (title: string, content: string[]) => {
    checkPageBreak(15 + content.length * lineHeight);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(30, 64, 175); // Blue 800
    doc.text(title, margin, yPos);
    yPos += 8;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);
    
    content.forEach(line => {
      checkPageBreak(lineHeight);
      const splitLines = doc.splitTextToSize(line, doc.internal.pageSize.width - margin * 2);
      splitLines.forEach((splitLine: string) => {
        checkPageBreak(lineHeight);
        doc.text(splitLine, margin, yPos);
        yPos += lineHeight;
      });
    });
    
    yPos += 10;
  };

  addSection('1. Introduction', [
    'Welcome to BrandFlow Pro! This guide will help you navigate and utilize the core features of the ERP system designed specifically for printing and branding workflows.',
    'The system is divided into several modules covering the entire lifecycle of a print job, from quotation to final dispatch.'
  ]);

  addSection('2. System Layout', [
    'Sidebar Navigation: Located on the left, allows you to switch between different operational modules (Dashboard, Quotations, Design, Production, etc.).',
    'Toolbar Header: Located at the top, displays the active module, current active job, search bar, and action buttons (Edit, Print, Save, Download Guide).',
    'Role Selector: At the top right, you can switch your user role (Admin, Designer, Production Manager, etc.) to see how permissions affect the interface.'
  ]);

  addSection('3. Core Modules', [
    'Dashboard: Provides a real-time overview of jobs by status, system activity, and active press line status.',
    'Quotations: Manage client requests, generate quotes, and track pricing.',
    'Settings: Configure company branding, standard bleed margins, and integrate with accounting tools (Xero, Sage, QuickBooks).'
  ]);

  addSection('4. Managing Jobs', [
    'Each module focuses on a specific aspect of the job. You can select an "Active Job" from the dropdown in the top header to apply actions to a specific order.',
    'Use the Edit button to toggle editing mode. Note that some fields are restricted based on your current role.'
  ]);

  addSection('5. Printing & Exporting', [
    'You can use the Print button in the header to view a print-friendly version of the current module.',
    'Data can be managed and saved using the Save button, which will trigger a system notification.'
  ]);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  checkPageBreak(20);
  doc.text(`Generated on ${new Date().toLocaleDateString()} by BrandFlow Pro`, margin, yPos + 10);

  doc.save('BrandFlow-Pro-User-Guide.pdf');
};
