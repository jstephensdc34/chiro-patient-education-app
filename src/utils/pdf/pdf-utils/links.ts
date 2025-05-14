
import { jsPDF } from 'jspdf';

/**
 * Processes links in the document and adds them to the PDF
 * @param container The HTML container with links
 * @param pdf The jsPDF instance
 * @param pdfWidth Width of the PDF content area
 * @param pdfHeight Height of the PDF content
 */
export const processLinksForPdf = (
  container: HTMLElement, 
  pdf: jsPDF, 
  pdfWidth: number, 
  pdfHeight: number
): void => {
  // Get all links in the container
  const links = container.querySelectorAll('a');
  
  // Calculate the scale factor between HTML and PDF dimensions
  const rect = container.getBoundingClientRect();
  const scaleX = pdfWidth / rect.width;
  const scaleY = pdfHeight / rect.height;
  
  // Process each link
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    
    // Special handling for info links that appear inline with text
    const isInfoLink = link.classList.contains('info-link');
    
    // Get link position relative to the container
    const linkRect = link.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    // Calculate position in PDF coordinates
    let x = (linkRect.left - containerRect.left) * scaleX;
    let y = (linkRect.top - containerRect.top) * scaleY;
    let width = linkRect.width * scaleX;
    let height = linkRect.height * scaleY;
    
    // Additional adjustments for info links
    if (isInfoLink) {
      // Make info links more clickable by slightly expanding the area
      width = Math.max(width, 15);
      height = Math.max(height, 10);
      
      // Ensure info links are positioned correctly relative to text
      const parentText = link.parentElement?.textContent?.replace(link.textContent || '', '');
      if (parentText) {
        // Calculate text width (approximate)
        const textWidth = pdf.getStringUnitWidth(parentText) * 10 / pdf.internal.scaleFactor;
        
        // Adjust link position to be right after the text
        if (textWidth > 0) {
          x = Math.max(x, textWidth + 2);
        }
      }
    }
    
    // Add link annotation to the PDF (jsPDF)
    pdf.link(x, y, width, height, { url: href });
  });
};
