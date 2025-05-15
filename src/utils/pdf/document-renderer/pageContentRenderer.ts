
import { jsPDF } from 'jspdf';

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
  let currentY = startY + 10; // Start position after header
  
  // Process each content block
  contentItems.forEach(html => {
    // Parse HTML content
    const parser = new DOMParser();
    const contentDoc = parser.parseFromString(html, 'text/html');
    
    // Get heading
    const heading = contentDoc.querySelector('h3');
    if (heading) {
      // Check if we need a new page
      if (currentY > 250) {
        doc.addPage();
        currentY = 40; // Reset Y position on new page
      }
      
      doc.setFontSize(16);
      doc.setTextColor(0, 82, 156); // #00528c medical-700
      doc.text(heading.textContent || '', x, currentY);
      currentY += 12; // Increased spacing after heading
    }
    
    // Handle subcategory titles
    const subcategoryTitles = contentDoc.querySelectorAll('h4.subcategory-title');
    subcategoryTitles.forEach(subcategoryTitle => {
      // Check if we need a new page
      if (currentY > 250) {
        doc.addPage();
        currentY = 40;
      }
      
      doc.setFontSize(14);
      doc.setTextColor(9, 109, 217); // #096dd9 medical-600
      doc.text(subcategoryTitle.textContent || '', x + 5, currentY);
      currentY += 10; // Increased spacing after subcategory
      
      // Find the following list for this subcategory
      let nextElement = subcategoryTitle.nextElementSibling;
      if (nextElement && nextElement.classList.contains('items-list')) {
        currentY = processItemsList(nextElement as HTMLElement, doc, x, width, currentY);
      }
    });
    
    // Handle direct item lists (not under subcategories)
    const directItemLists = contentDoc.querySelectorAll('ul.items-list');
    directItemLists.forEach(itemsList => {
      if (!itemsList.previousElementSibling || !itemsList.previousElementSibling.classList.contains('subcategory-title')) {
        currentY = processItemsList(itemsList as HTMLElement, doc, x, width, currentY);
      }
    });
    
    // Handle notes and other paragraphs
    const paragraphs = contentDoc.querySelectorAll('p:not(.item-description):not(.item-link)');
    
    paragraphs.forEach(p => {
      doc.setFontSize(11);
      doc.setTextColor(0);
      
      const text = p.textContent || '';
      const textLines = doc.splitTextToSize(text, width - 10);
      
      textLines.forEach(line => {
        // Check if we need a new page
        if (currentY > 250) {
          doc.addPage();
          currentY = 40;
        }
        
        doc.text(line, x + 5, currentY);
        currentY += 6;
      });
      
      currentY += 4;
    });
    
    // Add spacing between sections
    currentY += 10;
  });
}

/**
 * Process a list of report items with proper formatting
 */
function processItemsList(itemsList: HTMLElement, doc: jsPDF, x: number, width: number, startY: number): number {
  let currentY = startY;
  const items = itemsList.querySelectorAll('li.report-item');
  
  items.forEach(item => {
    // Check if we need a new page before starting a new item
    if (currentY > 250) {
      doc.addPage();
      currentY = 40; // Reset to top of new page with some margin
    }
    
    // Item name with bullet point
    const nameElement = item.querySelector('.item-name');
    if (nameElement) {
      doc.setFontSize(11);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(0);
      
      const nameText = nameElement.textContent || '';
      const cleanNameText = nameText.replace('[info]', '').trim(); // Remove info text for cleaner output
      doc.text('• ' + cleanNameText, x + 10, currentY);
      
      // Add link annotation for info link if present
      const infoLink = item.querySelector('.info-link');
      if (infoLink) {
        const href = infoLink.getAttribute('href');
        if (href) {
          // Position the link annotation right after the text
          const textWidth = doc.getStringUnitWidth(cleanNameText) * doc.getFontSize() / doc.internal.scaleFactor;
          doc.setTextColor(24, 144, 255); // #1890ff
          doc.setFontSize(9);
          doc.text('[info]', x + 10 + textWidth + 5, currentY);
          
          // Add clickable link
          doc.link(x + 10 + textWidth + 5, currentY - 3, 15, 5, { url: href });
        }
      }
      
      currentY += 8; // Increased spacing after item name
    }
    
    // Item description - only process once
    const descriptionElement = item.querySelector('.item-description');
    if (descriptionElement) {
      // Check space for description
      if (currentY > 240) {
        doc.addPage();
        currentY = 40;
      }
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(102, 102, 102); // #666666
      
      const descText = descriptionElement.textContent || '';
      const descLines = doc.splitTextToSize(descText, width - 30);
      
      descLines.forEach(line => {
        if (currentY > 250) {
          doc.addPage();
          currentY = 40;
        }
        
        doc.text(line, x + 15, currentY);
        currentY += 5;
      });
      
      currentY += 4; // Add more space after description
    }
    
    // Info link text
    const linkElement = item.querySelector('.item-link');
    if (linkElement) {
      // Check space for link
      if (currentY > 250) {
        doc.addPage();
        currentY = 40;
      }
      
      doc.setFontSize(9);
      doc.setFont(undefined, 'italic');
      doc.setTextColor(24, 144, 255); // #1890ff
      
      const linkText = linkElement.textContent || '';
      doc.text(linkText, x + 15, currentY);
      
      // Add clickable link for the URL
      const linkUrl = linkElement.querySelector('a');
      if (linkUrl) {
        const href = linkUrl.getAttribute('href');
        if (href) {
          // Add link annotation for the text
          const urlStartIndex = linkText.indexOf(href);
          if (urlStartIndex > -1) {
            const beforeText = linkText.substring(0, urlStartIndex);
            const beforeTextWidth = doc.getStringUnitWidth(beforeText) * doc.getFontSize() / doc.internal.scaleFactor;
            const urlWidth = doc.getStringUnitWidth(href) * doc.getFontSize() / doc.internal.scaleFactor;
            
            doc.link(x + 15 + beforeTextWidth, currentY - 3, urlWidth, 5, { url: href });
          }
        }
      }
      
      currentY += 8; // Increase spacing after link
    }
    
    currentY += 5; // Space between items
  });
  
  return currentY;
}
