
import { jsPDF } from 'jspdf';
import { renderItemsList } from './itemRenderer';
import { renderText } from './textRenderer';

/**
 * Render a heading with proper styling
 */
export function renderHeading(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  level: 'h3' | 'h4' = 'h3'
): number {
  // Check if we need a new page
  if (y > 250) {
    doc.addPage();
    y = 40; // Reset Y position on new page
  }
  
  if (level === 'h3') {
    doc.setFontSize(16);
    doc.setTextColor(0, 82, 156); // #00528c medical-700
    doc.text(text, x, y);
    return y + 12; // Increased spacing after heading
  } else {
    doc.setFontSize(14);
    doc.setTextColor(9, 109, 217); // #096dd9 medical-600
    doc.text(text, x + 5, y);
    return y + 10; // Increased spacing after subcategory
  }
}

/**
 * Render a paragraph with proper styling and pagination
 */
export function renderParagraph(
  doc: jsPDF, 
  text: string,
  x: number,
  y: number,
  width: number
): number {
  return renderText(doc, text, x, y, width, {
    fontSize: 11,
    fontStyle: 'normal',
    color: [0, 0, 0],
    indent: 5
  });
}
