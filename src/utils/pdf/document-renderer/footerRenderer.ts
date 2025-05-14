
import { jsPDF } from 'jspdf';
import { DocumentContent, PdfRenderingOptions } from './types';

/**
 * Adds footer to the page at the specified position
 */
export function renderFooter(
  doc: jsPDF,
  pageNum: number,
  totalPages: number,
  clinicInfo: DocumentContent['clinicInfo'],
  margins: PdfRenderingOptions['margins'],
  footerY: number,
  contentWidth: number
): void {
  const { phone, email, website } = clinicInfo;
  
  // Add a separator line
  doc.setDrawColor(220, 220, 220);
  doc.line(margins.left, footerY, margins.left + contentWidth, footerY);
  
  // Add contact info
  doc.setFontSize(9);
  doc.setTextColor(100);
  
  let contactInfo = '';
  if (phone) contactInfo += `Phone: ${phone} `;
  if (email) contactInfo += `Email: ${email} `;
  if (website) contactInfo += `Website: ${website}`;
  
  const footerTextY = footerY + 6;
  
  if (contactInfo) {
    doc.text(contactInfo, margins.left + contentWidth/2, footerTextY, { align: 'center' });
  }
  
  // Add page numbers
  doc.text(
    `Page ${pageNum} of ${totalPages}`,
    margins.left + contentWidth/2,
    footerTextY + 6, 
    { align: 'center' }
  );
}
