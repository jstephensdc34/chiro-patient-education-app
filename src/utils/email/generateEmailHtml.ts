
import { PatientInfo, ReportItem, MAIN_CATEGORIES } from '@/types';
import { ReportSetting } from '@/services/reportSettingsService';
import { getEmailStyles } from './emailStyles';
import { renderEmailCategorySection } from './emailCategoryRenderer';

interface GenerateEmailHtmlParams {
  patient: PatientInfo;
  selectedItems: ReportItem[];
  notes: string;
  customTreatmentGoals?: string;
  settings: ReportSetting[];
  subcategories: any[];
}

export const generateEmailHtml = ({
  patient,
  selectedItems,
  notes,
  customTreatmentGoals,
  settings,
  subcategories
}: GenerateEmailHtmlParams): string => {
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

  // Get email-optimized styles (inline CSS)
  const styles = getEmailStyles();
  
  // Build header content
  let headerContent = `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
      <tr>
        <td style="text-align: center; padding: 20px; background-color: #f8f9fa; border-bottom: 3px solid #2563eb;">
          ${logoUrl ? `<img src="${logoUrl}" alt="Clinic Logo" style="max-height: 80px; margin-bottom: 15px;" />` : ''}
          <h1 style="margin: 0; color: #1f2937; font-size: 28px; font-weight: bold;">${clinicName}</h1>
          <p style="margin: 10px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.4;">
            ${clinicAddress}<br/>
            ${clinicPhone} | ${clinicEmail} | ${clinicWebsite}
          </p>
        </td>
      </tr>
    </table>
    
    <h2 style="color: #1f2937; font-size: 24px; margin: 0 0 10px 0; text-align: center;">Patient ID: ${patient.name}</h2>
    <p style="color: #6b7280; text-align: center; margin: 0 0 30px 0; font-size: 16px;">
      Date: ${new Date(patient.date).toLocaleDateString()}
    </p>
  `;

  // Generate category content sections
  let categorySections = '';
  
  MAIN_CATEGORIES.forEach(categoryId => {
    const categoryItems = selectedItems.filter(item => item.categoryId === categoryId);
    
    if (categoryItems.length > 0 || (categoryId === "treatment" && customTreatmentGoals)) {
      categorySections += renderEmailCategorySection(categoryId, categoryItems, categoryNames, subcategories, getSubcategoryName);
      
      // Append custom treatment goals inline within the treatment section
      if (categoryId === "treatment" && customTreatmentGoals) {
        categorySections = categorySections.replace(
          /(<\/td>\s*<\/tr>\s*<\/table>\s*)$/,
          `<p style="margin: 10px 0 0 20px; color: #374151; line-height: 1.6; font-size: 14px; white-space: pre-wrap;">${customTreatmentGoals}</p>$1`
        );
      }
    }
  });

  // Add additional notes section
  let notesContent = '';
  if (notes) {
    notesContent = `
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px;">
        <tr>
          <td style="background-color: #f8f9fa; padding: 20px; border-left: 4px solid #3b82f6;">
            <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px;">Additional Notes</h3>
            <p style="margin: 0; color: #374151; line-height: 1.6; font-size: 14px;">${notes}</p>
          </td>
        </tr>
      </table>
    `;
  }

  // Build final HTML optimized for email clients
  const emailHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Medical Report - ${patient.name}</title>
      ${styles}
    </head>
    <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #ffffff; color: #374151;">
      <table width="100%" max-width="600px" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
        <tr>
          <td>
            ${headerContent}
            ${categorySections}
            ${notesContent}
            
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <tr>
                <td style="text-align: center; color: #9ca3af; font-size: 12px;">
                  <p style="margin: 0;">This is a confidential medical report. Please handle accordingly.</p>
                  <p style="margin: 10px 0 0 0;">Generated by ${clinicName} on ${new Date().toLocaleDateString()}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
  
  return emailHTML;
};
