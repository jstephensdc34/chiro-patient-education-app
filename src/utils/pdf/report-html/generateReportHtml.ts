
import { MAIN_CATEGORIES } from '@/types';
import { getReportStyles } from '../reportStyles';
import { renderCategorySections } from './renderCategorySections';
import { GenerateReportHtmlParams, ReportContext } from './types';
import { createReportHeader } from './sections/reportHeader';
import { createPatientInfo } from './sections/patientInfo';
import { createAdditionalNotes } from './sections/additionalNotes';
import { createReportFooter } from './sections/reportFooter';

export const generateReportHtml = ({
  patient,
  selectedItems,
  notes,
  settings,
  subcategories
}: GenerateReportHtmlParams): string => {
  // Get clinic info from settings
  const clinicName = settings.find(s => s.name === "clinic_name")?.value || "Chiropractic Clinic";
  const clinicWebsite = settings.find(s => s.name === "clinic_website")?.value || "";
  const logoUrl = settings.find(s => s.name === "logo_url")?.value || "";
  const clinicPhone = settings.find(s => s.name === "clinic_phone")?.value || "";
  const clinicEmail = settings.find(s => s.name === "clinic_email")?.value || "";
  
  // Category name mapping
  const categoryNames: Record<string, string> = {
    diagnosis: "Spinal Diagnosis",
    extremity: "Extremity Diagnosis",
    treatment: "Treatment Plan",
    homecare: "Home Care",
    exercises: "Therapeutic Exercises"
  };

  // Create report context to share across rendering functions
  const reportContext: ReportContext = {
    categoryNames,
    subcategories,
    getSubcategoryName: (subcategoryId: string) => {
      const subcategory = subcategories.find(s => s.id === subcategoryId);
      return subcategory ? subcategory.name : "";
    }
  };

  // Get styles
  const styles = getReportStyles();

  // Build report HTML content with header
  let reportHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      ${styles}
    </head>
    <body>
      <div class="container">
        ${createReportHeader(clinicName, clinicWebsite, logoUrl)}
        ${createReportFooter(clinicPhone, clinicEmail, clinicWebsite)}
        ${createPatientInfo(patient)}
  `;
  
  // Process categories
  reportHTML += renderCategorySections(MAIN_CATEGORIES, selectedItems, reportContext);
  
  // Add additional notes
  if (notes) {
    reportHTML += createAdditionalNotes(notes);
  }
  
  // Close the main div and HTML tags
  reportHTML += `
      </div>
    </body>
    </html>
  `;
  
  return reportHTML;
};
