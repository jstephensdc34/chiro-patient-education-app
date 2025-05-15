
import { jsPDF } from 'jspdf';
import { renderHeading, renderParagraph } from './renderers/categoryRenderer';
import { renderItemsList } from './renderers/itemRenderer';

/**
 * Adds content to the page with improved HTML rendering
 */
export function renderPageContent(
  doc: jsPDF,
  contentItems: string[],
  x: number,
  startY: number,
  width: number
): void {
  let currentY = startY + 5; // Reduced spacing after header to prevent overlap
  
  // Process each content block
  contentItems.forEach(html => {
    // Parse HTML content
    const parser = new DOMParser();
    const contentDoc = parser.parseFromString(html, 'text/html');
    
    // Get heading
    const heading = contentDoc.querySelector('h3');
    if (heading) {
      currentY = renderHeading(doc, heading.textContent || '', x, currentY);
    }
    
    // Handle subcategory titles
    const subcategoryTitles = contentDoc.querySelectorAll('h4.subcategory-title');
    subcategoryTitles.forEach(subcategoryTitle => {
      currentY = renderHeading(
        doc,
        subcategoryTitle.textContent || '',
        x, 
        currentY,
        'h4'
      );
      
      // Find the following list for this subcategory
      let nextElement = subcategoryTitle.nextElementSibling;
      if (nextElement && nextElement.classList.contains('items-list')) {
        currentY = renderItemsList(doc, nextElement as HTMLElement, x, width, currentY);
      }
    });
    
    // Handle direct item lists (not under subcategories)
    const directItemLists = contentDoc.querySelectorAll('ul.items-list:not([data-processed="true"])');
    directItemLists.forEach(itemsList => {
      // Only process lists that aren't already processed as part of subcategories
      if (!itemsList.previousElementSibling || !itemsList.previousElementSibling.classList.contains('subcategory-title')) {
        currentY = renderItemsList(doc, itemsList as HTMLElement, x, width, currentY);
        // Mark as processed
        itemsList.setAttribute('data-processed', 'true');
      }
    });
    
    // Handle notes and other paragraphs - explicitly exclude ALL item-related elements
    const paragraphs = contentDoc.querySelectorAll('p:not(.item-description):not([data-pdf-content="true"]):not(.item-link):not([class*="item"])');
    
    paragraphs.forEach(p => {
      const text = p.textContent || '';
      currentY = renderParagraph(doc, text, x, currentY, width);
    });
    
    // Add spacing between sections
    currentY += 5; // Reduced spacing between sections
  });
}
