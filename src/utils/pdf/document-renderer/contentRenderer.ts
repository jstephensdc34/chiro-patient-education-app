
import { jsPDF } from 'jspdf';
import { paginateContent } from './pagination';
import { processLinksForPdf } from '../pdf-utils/links';
import { renderHeader } from './headerRenderer';
import { renderFooter } from './footerRenderer';
import { renderPageContent } from './pageContentRenderer';
import { DocumentContent, PdfRenderingOptions } from './types';

export type { PdfRenderingOptions };

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
    renderHeader(doc, clinicInfo, margins, contentWidth);
    
    // Add content for this page
    const startY = margins.top + headerHeight;
    renderPageContent(doc, pageContent, margins.left, startY, contentWidth);
    
    // Add footer to each page - positioning at bottom of page
    const footerY = pageSize.height - margins.bottom - footerHeight;
    renderFooter(doc, pageIndex + 1, contentPages.length, clinicInfo, margins, footerY, contentWidth);
  });
}
