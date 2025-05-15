
import { jsPDF } from 'jspdf';

/**
 * Handles rendering of text with proper pagination and styling
 */
export function renderText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  width: number,
  options: {
    fontSize?: number;
    fontStyle?: 'normal' | 'bold' | 'italic';
    color?: [number, number, number];
    indent?: number;
  } = {}
): number {
  // Set text styling
  const { fontSize = 11, fontStyle = 'normal', color = [0, 0, 0], indent = 0 } = options;
  
  doc.setFontSize(fontSize);
  doc.setFont(undefined, fontStyle);
  doc.setTextColor(color[0], color[1], color[2]);
  
  // Split text to fit width
  const effectiveX = x + indent;
  const effectiveWidth = width - indent;
  const textLines = doc.splitTextToSize(text, effectiveWidth);
  
  let currentY = y;
  
  // Render each line with pagination
  for (const line of textLines) {
    // Check if we need a new page
    if (currentY > 250) {
      doc.addPage();
      currentY = 40; // Reset to top of new page
    }
    
    doc.text(line, effectiveX, currentY);
    currentY += fontSize * 0.35 + 2; // Scale line height based on font size
  }
  
  // Return the new Y position after text rendering
  return currentY;
}

/**
 * Gets text width in document units
 */
export function getTextWidth(doc: jsPDF, text: string): number {
  return doc.getStringUnitWidth(text) * doc.getFontSize() / doc.internal.scaleFactor;
}

/**
 * Creates a clickable link annotation
 */
export function createLinkAnnotation(
  doc: jsPDF,
  url: string,
  x: number,
  y: number,
  width: number,
  height: number = 5
): void {
  doc.link(x, y - 3, width, height, { url });
}
