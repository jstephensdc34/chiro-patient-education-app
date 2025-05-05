
import { PatientInfo, ReportItem } from '@/types';
import { ReportSetting } from '@/services/reportSettingsService';
import { generateReportHtml } from './generateReportHtml';
import { renderPdfFromHtml } from './renderPdf';

interface GeneratePDFParams {
  patient: PatientInfo;
  selectedItems: ReportItem[];
  notes: string;
  settings: ReportSetting[];
  subcategories: any[];
}

export const generatePDF = async (params: GeneratePDFParams): Promise<void> => {
  const { patient, selectedItems, notes, settings, subcategories } = params;
  
  // Generate the HTML content
  const htmlContent = generateReportHtml({
    patient,
    selectedItems,
    notes,
    settings,
    subcategories
  });
  
  // Render the PDF from the HTML content
  await renderPdfFromHtml(htmlContent, patient.name);
};
