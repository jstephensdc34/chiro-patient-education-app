
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
  
  // Track which elements have been processed to prevent duplicates
  const processedLists = new Set<string>();
  
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
        // Generate a unique ID for this list
        const listId = `list-${nextElement.textContent?.trim()}-${Math.random().toString(36).slice(2, 10)}`;
        
        // Only process if not already processed
        if (!processedLists.has(listId)) {
          processedLists.add(listId);
          currentY = renderItemsList(doc, nextElement as HTMLElement, x, width, currentY);
        }
      }
    });
    
    // Handle direct item lists (not under subcategories) - skip any that have already been processed
    const directItemLists = contentDoc.querySelectorAll('ul.items-list:not([data-processed="true"])');
    directItemLists.forEach(itemsList => {
      // Only process lists that aren't already processed as part of subcategories
      if (!itemsList.previousElementSibling || !itemsList.previousElementSibling.classList.contains('subcategory-title')) {
        // Generate a unique ID for this list
        const listId = `direct-list-${itemsList.textContent?.trim()}-${Math.random().toString(36).slice(2, 10)}`;
        
        // Only process if not already processed
        if (!processedLists.has(listId)) {
          processedLists.add(listId);
          currentY = renderItemsList(doc, itemsList as HTMLElement, x, width, currentY);
        }
        
        // Mark as processed in the DOM
        itemsList.setAttribute('data-processed', 'true');
      }
    });
    
    // Handle notes and other paragraphs - explicitly exclude ALL item-related elements
    const paragraphs = contentDoc.querySelectorAll('p:not([class*="item"]):not([data-pdf-content])');
    
    paragraphs.forEach(p => {
      const text = p.textContent || '';
      currentY = renderParagraph(doc, text, x, currentY, width);
    });
    
    // Add spacing between sections
    currentY += 5; // Reduced spacing between sections
  });
}
