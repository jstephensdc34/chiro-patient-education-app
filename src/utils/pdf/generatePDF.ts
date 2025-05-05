
import { PatientInfo, ReportItem } from '@/types';
import { ReportSetting } from '@/services/reportSettingsService';
import { generateReportHtml } from './generateReportHtml';
import { renderPdfFromHtml, RenderPdfProgress } from './renderPdf';

interface GeneratePDFParams {
  patient: PatientInfo;
  selectedItems: ReportItem[];
  notes: string;
  settings: ReportSetting[];
  subcategories: any[];
  onProgress?: (progress: RenderPdfProgress) => void;
}

export const generatePDF = async (params: GeneratePDFParams): Promise<void> => {
  const { patient, selectedItems, notes, settings, subcategories, onProgress } = params;
  
  try {
    // Generate the HTML content
    const htmlContent = generateReportHtml({
      patient,
      selectedItems,
      notes,
      settings,
      subcategories
    });
    
    // Render the PDF from the HTML content
    await renderPdfFromHtml(htmlContent, patient.name, onProgress);
  } catch (error) {
    console.error("Error in PDF generation:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to generate report");
  }
};
