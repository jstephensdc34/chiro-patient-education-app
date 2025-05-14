
import { jsPDF } from 'jspdf';

/**
 * Add page numbers to the PDF
 * @param pdf jsPDF instance
 * @param pageWidth Width of the page in mm
 * @param pageHeight Height of the page in mm
 * @param marginBottom Bottom margin in mm
 */
export const addPageNumbers = (
  pdf: jsPDF,
  pageWidth: number,
  pageHeight: number,
  marginBottom: number
): void => {
  // Add page numbers at the bottom of each page (respecting bottom margin)
  for (let i = 1; i <= pdf.getNumberOfPages(); i++) {
    pdf.setPage(i);
    pdf.setFontSize(10);
    pdf.setTextColor(100);
    
    // Position the page number in the center, above the bottom margin
    pdf.text(
      `Page ${i} of ${pdf.getNumberOfPages()}`,
      pageWidth / 2,
      pageHeight - (marginBottom / 2),
      { align: 'center' }
    );
  }
};

/**
 * Creates a clean filename for the PDF based on patient name and date
 * @param patientName Name of the patient
 * @returns A sanitized filename
 */
export const createPdfFilename = (patientName: string): string => {
  const cleanPatientName = patientName.replace(/[^a-zA-Z0-9]/g, '_');
  return `${cleanPatientName}_Report_${new Date().toISOString().split('T')[0]}.pdf`;
};
