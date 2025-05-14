
import { jsPDF } from 'jspdf';
import { toast } from '@/hooks/use-toast';
import { PatientInfo, ReportItem } from '@/types';
import { ReportSetting } from '@/services/reportSettingsService';
import { reportProgress } from './pdf-utils';
import {
  renderDocumentContent,
  parseHtmlContent,
  createPdfFilename,
  PdfRenderingOptions
} from './document-renderer';

export interface RenderPdfProgress {
  status: 'preparing' | 'rendering' | 'generating' | 'finalizing' | 'complete';
  percentage: number;
}

// Default options for PDF rendering
const defaultOptions: PdfRenderingOptions = {
  margins: {
    top: 25, // 25mm top margin
    bottom: 25, // 25mm bottom margin
    left: 20, // 20mm left margin
    right: 20, // 20mm right margin
  },
  pageSize: {
    width: 210, // A4 width in mm
    height: 297, // A4 height in mm
  }
};

export const renderPdfFromHtml = async (
  htmlContent: string,
  patientName: string,
  onProgress?: (progress: RenderPdfProgress) => void
): Promise<void> => {
  try {
    // Update progress
    reportProgress('preparing', 10, onProgress);
    
    // Create new PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Parse the HTML content to extract header, content sections, and footer
    const { headerContent, bodyContent, footerContent, clinicInfo } = parseHtmlContent(htmlContent);
    
    // Setup document with content
    reportProgress('rendering', 40, onProgress);
    
    // Process and render all content to the PDF
    renderDocumentContent(doc, {
      header: headerContent,
      body: bodyContent,
      footer: footerContent,
      clinicInfo: clinicInfo,
      patientName: patientName,
      options: defaultOptions
    });
    
    reportProgress('finalizing', 90, onProgress);
    
    // Create filename
    const filename = createPdfFilename(patientName);
    
    try {
      // Save the PDF
      doc.save(filename);
      reportProgress('complete', 100, onProgress);
    } catch (error) {
      console.error('PDF save failed:', error);
      throw new Error('Failed to download the PDF. Please try again.');
    }
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  }
};
