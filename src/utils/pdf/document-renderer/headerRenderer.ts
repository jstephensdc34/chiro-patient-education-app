
import { jsPDF } from 'jspdf';
import { DocumentContent, PdfRenderingOptions } from './types';

/**
 * Adds header to the page
 */
export function renderHeader(
  doc: jsPDF, 
  clinicInfo: DocumentContent['clinicInfo'],
  margins: PdfRenderingOptions['margins'],
  contentWidth: number
): void {
  const { name, website, logoUrl } = clinicInfo;
  
  // Position parameters
  const headerY = margins.top;
  const headerX = margins.left;
  
  // Create header container
  const headerHeight = 32; // Doubled height to match ReportPreview appearance
  const logoSize = 32; // Doubled logo size (in mm)
  
  // Add logo or placeholder
  if (logoUrl) {
    try {
      // If we have a logo URL, add the image
      doc.addImage(logoUrl, 'JPEG', headerX, headerY, logoSize, logoSize);
    } catch (error) {
      console.warn('Failed to add logo image:', error);
      // Add a placeholder rectangle if image fails
      doc.setFillColor(240, 240, 240); // Light gray
      doc.rect(headerX, headerY, logoSize, logoSize, 'F');
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text('Logo', headerX + logoSize/2, headerY + logoSize/2, { align: 'center' });
    }
  } else {
    // Create a placeholder for the logo
    doc.setFillColor(240, 240, 240); // Light gray
    doc.rect(headerX, headerY, logoSize, logoSize, 'F');
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('Logo', headerX + logoSize/2, headerY + logoSize/2, { align: 'center' });
  }
  
  // Add clinic name with styling that matches the ReportPreview - increased font size
  doc.setFontSize(18);
  doc.setTextColor(0, 82, 156); // Medical blue color
  doc.text(name, headerX + logoSize + 5, headerY + 12);
  
  // Add website if available - increased font size
  if (website) {
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(website, headerX + logoSize + 5, headerY + 20);
  }
  
  // Add a separator line
  doc.setDrawColor(220, 220, 220);
  doc.line(headerX, headerY + headerHeight + 3, headerX + contentWidth, headerY + headerHeight + 3);
}
