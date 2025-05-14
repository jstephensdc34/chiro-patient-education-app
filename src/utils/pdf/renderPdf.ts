
import { jsPDF } from 'jspdf';
import { toast } from '@/hooks/use-toast';
import {
  RenderPdfProgress,
  createTemporaryContainer,
  removeTemporaryContainer,
  loadContainerImages,
  htmlToCanvas,
  renderCanvasToPdf,
  createPdfFilename,
  reportProgress
} from './pdf-utils';

export type { RenderPdfProgress } from './pdf-utils';

export const renderPdfFromHtml = async (
  htmlContent: string,
  patientName: string,
  onProgress?: (progress: RenderPdfProgress) => void
): Promise<void> => {
  // Create a temporary div to render the report
  const reportContainer = createTemporaryContainer();
  
  try {
    // Update progress
    reportProgress('preparing', 10, onProgress);
    
    // Set the HTML content
    reportContainer.innerHTML = htmlContent;
    
    // Wait for images to load and report progress
    reportProgress('rendering', 30, onProgress);
    await loadContainerImages(reportContainer);
    
    // Final preparation before canvas rendering
    await new Promise((resolve) => setTimeout(resolve, 500));
    reportProgress('rendering', 50, onProgress);
    
    // Convert HTML to canvas
    const canvas = await htmlToCanvas(reportContainer);
    
    reportProgress('generating', 70, onProgress);
    
    // A4 dimensions and margins (in mm)
    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const marginTop = 25.4; // 1 inch top margin
    const marginBottom = 25.4; // 1 inch bottom margin
    const marginLeft = 0; // No left margin
    
    // Render canvas to PDF
    const pdf = renderCanvasToPdf(canvas, reportContainer, {
      marginTop,
      marginBottom,
      marginLeft,
      pageWidth,
      pageHeight
    });
    
    reportProgress('finalizing', 90, onProgress);
    
    // Download the PDF with a clean filename
    const filename = createPdfFilename(patientName);
    
    try {
      pdf.save(filename);
      reportProgress('complete', 100, onProgress);
    } catch (error) {
      console.error('PDF save failed:', error);
      throw new Error('Failed to download the PDF. Please try again.');
    }
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  } finally {
    // Clean up - remove the temporary div
    removeTemporaryContainer(reportContainer);
  }
};
