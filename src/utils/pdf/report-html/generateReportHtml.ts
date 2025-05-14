
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

  // Build report HTML content with header, structured for our PDF renderer
  let reportHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      ${styles}
    </head>
    <body>
      <div class="container">
        <!-- Header Section with clinic info -->
        ${createReportHeader(clinicName, clinicWebsite, logoUrl)}
        
        <!-- Hidden spans with clinic info for PDF parser -->
        <span class="clinic-name" style="display: none;">${clinicName}</span>
        <span class="clinic-website" style="display: none;">${clinicWebsite}</span>
        <span class="clinic-phone" style="display: none;">${clinicPhone}</span>
        <span class="clinic-email" style="display: none;">${clinicEmail}</span>
        
        <!-- Patient info section -->
        <div class="section patient-info">
          ${createPatientInfo(patient)}
        </div>
  `;
  
  // Process categories - each as a separate section for pagination
  const categorySections = renderCategorySections(MAIN_CATEGORIES, selectedItems, reportContext);
  reportHTML += categorySections;
  
  // Add additional notes as a section if present
  if (notes) {
    reportHTML += `
      <div class="section notes">
        ${createAdditionalNotes(notes)}
      </div>
    `;
  }
  
  // Add footer at the bottom of the page
  reportHTML += `
        <!-- Footer Section -->
        <div class="footer">
          ${createReportFooter(clinicPhone, clinicEmail, clinicWebsite)}
        </div>
      </div>
    </body>
    </html>
  `;
  
  return reportHTML;
};
