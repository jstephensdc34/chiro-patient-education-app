import { jsPDF } from 'jspdf';
import { toast } from '@/hooks/use-toast';
import { PatientInfo, ReportItem } from '@/types';
import { ReportSetting } from '@/services/reportSettingsService';
import { reportProgress } from './pdf-utils';

export interface RenderPdfProgress {
  status: 'preparing' | 'rendering' | 'generating' | 'finalizing' | 'complete';
  percentage: number;
}

interface PdfRenderingOptions {
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

// Default options for PDF rendering
const defaultOptions: PdfRenderingOptions = {
  margins: {
    top: 25, // 25mm top margin
    bottom: 25, // 25mm bottom margin
    left: 20, // 20mm left margin
    right: 20, // 20mm right margin
  },
  pageSize: {
    width: 210, // A4 width in mm
    height: 297, // A4 height in mm
  }
};

export const renderPdfFromHtml = async (
  htmlContent: string,
  patientName: string,
  onProgress?: (progress: RenderPdfProgress) => void
): Promise<void> => {
  try {
    // Update progress
    reportProgress('preparing', 10, onProgress);
    
    // Create new PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Parse the HTML content to extract header, content sections, and footer
    const { headerContent, bodyContent, footerContent, clinicInfo } = parseHtmlContent(htmlContent);
    
    // Setup document with content
    reportProgress('rendering', 40, onProgress);
    
    // Process and render all content to the PDF
    renderDocumentContent(doc, {
      header: headerContent,
      body: bodyContent,
      footer: footerContent,
      clinicInfo: clinicInfo,
      patientName: patientName,
      options: defaultOptions
    });
    
    reportProgress('finalizing', 90, onProgress);
    
    // Create filename
    const filename = createPdfFilename(patientName);
    
    try {
      // Save the PDF
      doc.save(filename);
      reportProgress('complete', 100, onProgress);
    } catch (error) {
      console.error('PDF save failed:', error);
      throw new Error('Failed to download the PDF. Please try again.');
    }
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  }
};

interface ParsedHtmlContent {
  headerContent: string;
  bodyContent: string[];
  footerContent: string;
  clinicInfo: {
    name: string;
    website: string;
    phone: string;
    email: string;
    logoUrl: string;
  };
}

function parseHtmlContent(htmlContent: string): ParsedHtmlContent {
  // Create a DOM parser
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  
  // Extract header, content sections, and footer
  const headerNode = doc.querySelector('.header');
  const contentNodes = Array.from(doc.querySelectorAll('.section'));
  const footerNode = doc.querySelector('.footer');
  
  // Extract clinic info
  const clinicName = doc.querySelector('.clinic-name')?.textContent || 'Chiropractic Clinic';
  const clinicWebsite = doc.querySelector('.clinic-website')?.textContent || '';
  const clinicPhone = doc.querySelector('.clinic-phone')?.textContent || '';
  const clinicEmail = doc.querySelector('.clinic-email')?.textContent || '';
  const logoUrl = doc.querySelector('.logo')?.getAttribute('src') || '';
  
  return {
    headerContent: headerNode?.outerHTML || '',
    bodyContent: contentNodes.map(node => node.outerHTML),
    footerContent: footerNode?.outerHTML || '',
    clinicInfo: {
      name: clinicName,
      website: clinicWebsite,
      phone: clinicPhone,
      email: clinicEmail,
      logoUrl: logoUrl,
    }
  };
}

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

/**
 * Renders the content into the PDF document with proper pagination
 */
function renderDocumentContent(doc: jsPDF, content: DocumentContent): void {
  const { options, clinicInfo } = content;
  const { margins, pageSize } = options;
  
  // Calculate available content area dimensions
  const contentWidth = pageSize.width - margins.left - margins.right;
  const headerHeight = 40; // Increased header height to accommodate larger logo (in mm)
  const footerHeight = 15; // Estimate footer height in mm
  const contentHeight = pageSize.height - margins.top - margins.bottom - headerHeight - footerHeight;
  
  // Split content into pages
  const contentPages = paginateContent(content.body, contentHeight);
  
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
 * Splits content into pages based on estimated content height
 */
function paginateContent(bodyContent: string[], contentHeight: number): string[][] {
  // This is a simplified pagination - in a real implementation, 
  // you would need to calculate actual content heights
  const contentPerPage = Math.max(1, Math.floor(contentHeight / 40)); // Rough estimate of content elements per page
  
  const pages: string[][] = [];
  for (let i = 0; i < bodyContent.length; i += contentPerPage) {
    pages.push(bodyContent.slice(i, i + contentPerPage));
  }
  
  // Ensure we have at least one page
  if (pages.length === 0) {
    pages.push([]);
  }
  
  return pages;
}

/**
 * Adds header to the page
 */
function addHeader(
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
function addPageContent(
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
function addFooter(
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

/**
 * Creates a clean filename for the PDF
 */
function createPdfFilename(patientName: string): string {
  const cleanPatientName = patientName.replace(/[^a-zA-Z0-9]/g, '_');
  return `${cleanPatientName}_Report_${new Date().toISOString().split('T')[0]}.pdf`;
}
