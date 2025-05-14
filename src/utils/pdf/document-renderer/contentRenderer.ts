
import { jsPDF } from 'jspdf';
import { paginateContent } from './pagination';
import { processLinksForPdf } from '../pdf-utils/links';

interface DocumentContent {
  header: string;
  body: string[];
  footer: string;
  clinicInfo: {
    name: string;
    website: string;
    phone: string;
    email: string;
    logoUrl: string;
  };
  patientName: string;
  options: PdfRenderingOptions;
}

export interface PdfRenderingOptions {
  margins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  pageSize: {
    width: number;
    height: number;
  };
}

/**
 * Renders the content into the PDF document with proper pagination
 */
export function renderDocumentContent(doc: jsPDF, content: DocumentContent): void {
  const { options, clinicInfo } = content;
  const { margins, pageSize } = options;
  
  // Calculate available content area dimensions
  const contentWidth = pageSize.width - margins.left - margins.right;
  const headerHeight = 40; // Increased header height to accommodate larger logo (in mm)
  const footerHeight = 15; // Estimate footer height in mm
  const contentHeight = pageSize.height - margins.top - margins.bottom - headerHeight - footerHeight;
  
  // Create a temporary HTML container to render content for proper link processing
  const container = document.createElement('div');
  container.innerHTML = content.header + content.body.join('') + content.footer;
  document.body.appendChild(container);
  
  // Split content into pages
  const contentPages = paginateContent(content.body, contentHeight);
  
  // Process links for proper PDF hyperlinks
  try {
    processLinksForPdf(container, doc, contentWidth, contentHeight);
  } catch (error) {
    console.error('Error processing links:', error);
  }
  
  // Clean up temporary container
  document.body.removeChild(container);
  
  // Render each page
  contentPages.forEach((pageContent, pageIndex) => {
    // Add a new page for all pages after the first
    if (pageIndex > 0) {
      doc.addPage();
    }
    
    // Add header to each page
    addHeader(doc, clinicInfo, margins, contentWidth);
    
    // Add content for this page
    const startY = margins.top + headerHeight;
    addPageContent(doc, pageContent, margins.left, startY, contentWidth);
    
    // Add footer to each page - positioning at bottom of page
    const footerY = pageSize.height - margins.bottom - footerHeight;
    addFooter(doc, pageIndex + 1, contentPages.length, clinicInfo, margins, footerY, contentWidth);
  });
}

/**
 * Adds header to the page
 */
export function addHeader(
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

/**
 * Adds content to the page
 */
export function addPageContent(
  doc: jsPDF,
  contentItems: string[],
  x: number,
  startY: number,
  width: number
): void {
  let currentY = startY + 10; // Start position after header
  
  // Process each content block
  contentItems.forEach(html => {
    // Parse HTML content to extract text
    const parser = new DOMParser();
    const contentDoc = parser.parseFromString(html, 'text/html');
    
    // Get heading
    const heading = contentDoc.querySelector('h3')?.textContent;
    if (heading) {
      doc.setFontSize(14);
      doc.setTextColor(0, 82, 156);
      doc.text(heading, x, currentY);
      currentY += 8;
    }
    
    // Get content paragraphs
    const paragraphs = contentDoc.querySelectorAll('p, li');
    
    doc.setFontSize(11);
    doc.setTextColor(0);
    
    paragraphs.forEach(p => {
      // Get text content and split into lines to fit page width
      const text = p.textContent || '';
      const textLines = doc.splitTextToSize(text, width - 10); // Leave some margin
      
      // Add each line to the document
      textLines.forEach(line => {
        // Check if we need to add a new page
        if (currentY > 270) { // Near bottom of page
          doc.addPage();
          currentY = startY;
        }
        
        doc.text(line, x + 5, currentY); // Indent text slightly
        currentY += 6; // Move to next line
      });
      
      currentY += 4; // Extra space after paragraph
    });
    
    // Add spacing between sections
    currentY += 10;
  });
}

/**
 * Adds footer to the page at the specified position
 */
export function addFooter(
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
