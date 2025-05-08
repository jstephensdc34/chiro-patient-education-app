
import { PatientInfo, ReportItem, MAIN_CATEGORIES } from '@/types';
import { ReportSetting } from '@/services/reportSettingsService';
import { getReportStyles } from './reportStyles';
import { renderCategorySection } from './reportCategoryRenderer';

interface GenerateReportHtmlParams {
  patient: PatientInfo;
  selectedItems: ReportItem[];
  notes: string;
  settings: ReportSetting[];
  subcategories: any[];
}

export const generateReportHtml = ({
  patient,
  selectedItems,
  notes,
  settings,
  subcategories
}: GenerateReportHtmlParams): string => {
  // Get clinic info from settings
  const clinicName = settings.find(s => s.name === "clinic_name")?.value || "Chiropractic Clinic";
  const clinicAddress = settings.find(s => s.name === "clinic_address")?.value || "";
  const clinicPhone = settings.find(s => s.name === "clinic_phone")?.value || "";
  const clinicEmail = settings.find(s => s.name === "clinic_email")?.value || "";
  const clinicWebsite = settings.find(s => s.name === "clinic_website")?.value || "";
  const logoUrl = settings.find(s => s.name === "logo_url")?.value || "";
  
  // Category name mapping
  const categoryNames: Record<string, string> = {
    diagnosis: "Spinal Diagnosis",
    extremity: "Extremity Diagnosis",
    treatment: "Treatment Plan",
    homecare: "Home Care",
    exercises: "Therapeutic Exercises"
  };

  const getSubcategoryName = (subcategoryId: string) => {
    const subcategory = subcategories.find(s => s.id === subcategoryId);
    return subcategory ? subcategory.name : "";
  };

  // Get styles
  const styles = getReportStyles();

  // Build report HTML content
  let reportHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      ${styles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          ${logoUrl ? `<img src="${logoUrl}" alt="Clinic Logo" class="logo" />` : ''}
          <div class="header-content">
            <h1 class="clinic-name">${clinicName}</h1>
            <p class="clinic-info">
              ${clinicAddress}<br/>
              ${clinicPhone} | ${clinicEmail} | ${clinicWebsite}
            </p>
          </div>
        </div>
        
        <h2 class="patient-name">${patient.name}</h2>
        <p class="patient-info">
          ${patient.age ? `Age: ${patient.age} | ` : ''}
          ${patient.gender ? `Gender: ${patient.gender} | ` : ''}
          Date: ${new Date(patient.date).toLocaleDateString()}
        </p>
  `;
  
  // Process categories in the correct order from MAIN_CATEGORIES
  MAIN_CATEGORIES.forEach(categoryId => {
    // Get items for this category
    const categoryItems = selectedItems.filter(item => item.categoryId === categoryId);
    
    if (categoryItems.length > 0) {
      reportHTML += renderCategorySection(categoryId, categoryItems, categoryNames, subcategories, getSubcategoryName);
    }
  });
  
  // Add additional notes
  if (notes) {
    reportHTML += `
      <div class="notes-section">
        <h3 class="notes-title">Additional Notes</h3>
        <p class="notes-content">${notes}</p>
      </div>
    `;
  }
  
  // Close the main div and HTML tags
  reportHTML += `
      </div>
    </body>
    </html>
  `;
  
  return reportHTML;
};
