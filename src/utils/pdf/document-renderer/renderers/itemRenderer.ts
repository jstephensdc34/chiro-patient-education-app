
import { jsPDF } from 'jspdf';
import { renderText, getTextWidth, createLinkAnnotation } from './textRenderer';

/**
 * Processes a list of report items with proper formatting
 */
export function renderItemsList(
  doc: jsPDF,
  itemsList: HTMLElement,
  x: number,
  width: number,
  startY: number
): number {
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
          const textWidth = getTextWidth(doc, '• ' + cleanNameText);
          
          doc.setTextColor(24, 144, 255); // #1890ff
          doc.setFontSize(9);
          doc.text('[info]', x + 10 + textWidth + 5, currentY);
          
          // Add clickable link
          createLinkAnnotation(doc, href, x + 10 + textWidth + 5, currentY - 3, 15);
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
      
      const descText = descriptionElement.textContent || '';
      currentY = renderText(doc, descText, x, currentY, width, {
        fontSize: 10,
        fontStyle: 'normal',
        color: [102, 102, 102],
        indent: 15
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
            const beforeTextWidth = getTextWidth(doc, beforeText);
            const urlWidth = getTextWidth(doc, href);
            
            createLinkAnnotation(doc, href, x + 15 + beforeTextWidth, currentY - 3, urlWidth);
          }
        }
      }
      
      currentY += 8; // Increase spacing after link
    }
    
    currentY += 5; // Space between items
  });
  
  return currentY;
}
