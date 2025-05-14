
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { processLinksForPdf } from './links';
import { addPageNumbers } from './paging';

export interface CanvasToPdfOptions {
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  pageWidth: number;
  pageHeight: number;
}

/**
 * Renders HTML canvas to a PDF with proper margins
 * @param canvas The HTML canvas to render
 * @param container The original HTML container (for link processing)
 * @param options Margins and page dimensions
 * @returns The generated jsPDF document
 */
export const renderCanvasToPdf = (
  canvas: HTMLCanvasElement,
  container: HTMLElement,
  options: CanvasToPdfOptions
): jsPDF => {
  const { marginTop, marginBottom, marginLeft, pageWidth, pageHeight } = options;
  
  // Calculate available content area dimensions
  const contentWidth = pageWidth - (marginLeft * 2);
  const contentHeight = pageHeight - marginTop - marginBottom;
  
  // Create PDF
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Get image data from canvas
  const imgData = canvas.toDataURL('image/png');
  
  // Calculate image dimensions to fit within content area
  const imgWidth = contentWidth;
  const imgHeight = (canvas.height * contentWidth) / canvas.width;
  
  // Calculate how many pages we need
  const pageCount = Math.ceil(imgHeight / contentHeight);
  
  // For each page
  for (let i = 0; i < pageCount; i++) {
    // Add a page (but not for the first one as jsPDF automatically creates the first page)
    if (i > 0) {
      pdf.addPage();
    }
    
    // Calculate which portion of the image to show on this page
    const sourceY = i * (canvas.height / imgHeight) * contentHeight;
    const sourceHeight = Math.min(
      (canvas.height / imgHeight) * contentHeight,
      canvas.height - sourceY
    );
    
    // Calculate destination position
    const destY = marginTop; // Start from top margin
    
    // Add the image
    pdf.addImage(
      imgData,
      'PNG',
      marginLeft,
      destY,
      imgWidth,
      imgHeight,
      undefined,
      'FAST',
      0
    );
    
    // For all pages except the last one, apply clipping to show only the relevant portion
    if (i < pageCount - 1) {
      pdf.setPage(i + 1);
    }
  }
  
  // Process links in the document and add them to the PDF
  processLinksForPdf(container, pdf, contentWidth, imgHeight);
  
  // Add page numbers
  addPageNumbers(pdf, pageWidth, pageHeight, marginBottom);
  
  return pdf;
};

/**
 * Converts HTML to canvas for PDF generation
 * @param container The HTML container to convert to canvas
 * @returns Promise resolving to the HTML canvas
 */
export const htmlToCanvas = async (container: HTMLElement): Promise<HTMLCanvasElement> => {
  return html2canvas(container, {
    scale: 2, // Higher resolution
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff', // Ensure white background
    onclone: (doc) => {
      // Additional handling for cloned document if needed
      return Promise.resolve();
    }
  }).catch(error => {
    console.error('HTML to canvas conversion failed:', error);
    throw new Error('Failed to render the report. Please try again.');
  });
};
