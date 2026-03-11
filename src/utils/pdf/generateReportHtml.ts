
import { PatientInfo, ReportItem, MAIN_CATEGORIES } from '@/types';
import { ReportSetting } from '@/services/reportSettingsService';
import { getReportStyles } from './reportStyles';
import { renderCategorySection } from './reportCategoryRenderer';

interface GenerateReportHtmlParams {
  patient: PatientInfo;
  selectedItems: ReportItem[];
  notes: string;
  customTreatmentGoals?: string;
  settings: ReportSetting[];
  subcategories: any[];
}

export const generateReportHtml = ({
  patient,
  selectedItems,
  notes,
  customTreatmentGoals,
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
  
  // Start building report content sections
  let headerContent = `
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

  // Generate category content sections
  let categorySections = '';
  
  MAIN_CATEGORIES.forEach(categoryId => {
    const categoryItems = selectedItems.filter(item => item.categoryId === categoryId);
    
    if (categoryItems.length > 0 || (categoryId === "treatment" && customTreatmentGoals)) {
      categorySections += renderCategorySection(categoryId, categoryItems, categoryNames, subcategories, getSubcategoryName);
      
      // Append custom treatment goals inline within the treatment section
      if (categoryId === "treatment" && customTreatmentGoals) {
        // Insert before the closing </div> of the category section
        categorySections = categorySections.replace(
          /(<\/div>\s*)$/,
          `<div class="custom-goals"><p class="notes-content">${customTreatmentGoals}</p></div>$1`
        );
      }
    }
  });

  // Add additional notes section
  let notesContent = '';
  if (notes) {
    notesContent = `
      <div class="notes-section">
        <h3 class="notes-title">Additional Notes</h3>
        <p class="notes-content">${notes}</p>
      </div>
    `;
  }

  let pageContents = [`${headerContent}`];
  const categoryContentParts = categorySections.split('<div class="category-section">');
  
  // First part is empty due to split
  categoryContentParts.shift();
  
  // Process each category part and distribute across pages
  let currentPageContent = pageContents[0];
  const ESTIMATED_CHARS_PER_PAGE = 3000; // Rough estimate - can be adjusted
  
  categoryContentParts.forEach(part => {
    const categoryContent = `<div class="category-section">${part}`;
    
    // If adding this category would likely exceed a page, start a new page
    if (currentPageContent.length + categoryContent.length > ESTIMATED_CHARS_PER_PAGE) {
      pageContents.push(''); // Start a new page
      currentPageContent = ''; // Reset current page content
    }
    
    // Append this category to the current page
    pageContents[pageContents.length - 1] += categoryContent;
    currentPageContent += categoryContent;
  });
  
  if (notesContent) {
    pageContents[pageContents.length - 1] += notesContent;
  }
  
  // Build final HTML with pages
  let reportHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      ${styles}
    </head>
    <body>
  `;
  
  // Add all pages with page numbers
  pageContents.forEach((content, index) => {
    reportHTML += `
      <div class="page-container">
        ${content}
        <div class="page-number">Page ${index + 1} of ${pageContents.length}</div>
      </div>
    `;
  });
  
  // Close HTML tags
  reportHTML += `
    </body>
    </html>
  `;
  
  return reportHTML;
};
