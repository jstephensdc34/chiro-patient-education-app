
import { jsPDF } from 'jspdf';

/**
 * Adds content to the page
 */
export function renderPageContent(
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
