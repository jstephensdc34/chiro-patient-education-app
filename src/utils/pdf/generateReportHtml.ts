
import { PatientInfo, ReportItem, MAIN_CATEGORIES } from '@/types';
import { ReportSetting } from '@/services/reportSettingsService';
import { sanitizeHtml } from '@/components/ui/rich-text-editor';
import { getOrderedSubcategories } from '@/utils/categoryUtils';

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

  // Build report HTML content
  let reportHTML = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">
        ${logoUrl ? `<img src="${logoUrl}" alt="Clinic Logo" style="max-height: 80px; max-width: 200px;" />` : ''}
        <div style="flex-grow: 1; margin-left: 20px;">
          <h1 style="font-size: 20px; margin: 0; color: #333;">${clinicName}</h1>
          <p style="font-size: 14px; margin: 5px 0; color: #666;">
            ${clinicAddress}<br/>
            ${clinicPhone} | ${clinicEmail} | ${clinicWebsite}
          </p>
        </div>
      </div>
      
      <h2 style="font-size: 18px; margin-bottom: 10px;">${patient.name}</h2>
      <p style="font-size: 14px; margin-bottom: 20px; color: #666;">
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
      <div style="margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px;">
        <h3 style="font-size: 16px; color: #223344; margin-bottom: 10px;">Additional Notes</h3>
        <p style="white-space: pre-wrap; font-size: 14px;">${notes}</p>
      </div>
    `;
  }
  
  // Close the main div
  reportHTML += `</div>`;
  
  return reportHTML;
};

function renderCategorySection(
  categoryId: string, 
  categoryItems: ReportItem[], 
  categoryNames: Record<string, string>, 
  subcategories: any[],
  getSubcategoryName: (subcategoryId: string) => string
): string {
  let html = `
    <div style="margin-bottom: 20px;">
      <h3 style="font-size: 16px; color: #223344; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 10px;">
        ${categoryNames[categoryId] || categoryId}
      </h3>
  `;
  
  if (categoryId === "diagnosis" || categoryId === "extremity") {
    // Get ordered subcategories for this category
    const orderedSubcategories = getOrderedSubcategories(categoryId, subcategories);
    
    // Render items by subcategory in the correct order
    orderedSubcategories.forEach(subcategory => {
      const subcategoryItems = categoryItems.filter(item => item.subcategoryId === subcategory.id);
      
      if (subcategoryItems.length > 0) {
        html += `
          <div style="margin-bottom: 10px;">
            <h4 style="font-size: 15px; margin-bottom: 5px; color: #445566;">
              ${getSubcategoryName(subcategory.id)}
            </h4>
            <ul style="margin: 0; padding-left: 20px;">
        `;
        
        subcategoryItems.forEach(item => {
          html += renderReportItem(item);
        });
        
        html += `
            </ul>
          </div>
        `;
      }
    });
    
    // Handle items without a subcategory
    const uncategorizedItems = categoryItems.filter(item => !item.subcategoryId);
    if (uncategorizedItems.length > 0) {
      html += `
        <div style="margin-bottom: 10px;">
          <h4 style="font-size: 15px; margin-bottom: 5px; color: #445566;">
            Other
          </h4>
          <ul style="margin: 0; padding-left: 20px;">
      `;
      
      uncategorizedItems.forEach(item => {
        html += renderReportItem(item);
      });
      
      html += `
          </ul>
        </div>
      `;
    }
  } else {
    // For categories like treatment, homecare, exercises that have subcategories but don't need special ordering
    if (["treatment", "homecare", "exercises"].includes(categoryId)) {
      // Get ordered subcategories for this category
      const orderedSubcategories = getOrderedSubcategories(categoryId, subcategories);
      
      // Render items by subcategory in the correct order
      orderedSubcategories.forEach(subcategory => {
        const subcategoryItems = categoryItems.filter(item => item.subcategoryId === subcategory.id);
        
        if (subcategoryItems.length > 0) {
          html += `
            <div style="margin-bottom: 10px;">
              <h4 style="font-size: 15px; margin-bottom: 5px; color: #445566;">
                ${getSubcategoryName(subcategory.id)}
              </h4>
              <ul style="margin: 0; padding-left: 20px;">
          `;
          
          subcategoryItems.forEach(item => {
            html += renderReportItem(item);
          });
          
          html += `
              </ul>
            </div>
          `;
        }
      });
      
      // Handle items without a subcategory
      const uncategorizedItems = categoryItems.filter(item => !item.subcategoryId);
      if (uncategorizedItems.length > 0) {
        html += `
          <div style="margin-bottom: 10px;">
            <h4 style="font-size: 15px; margin-bottom: 5px; color: #445566;">
              Other
            </h4>
            <ul style="margin: 0; padding-left: 20px;">
        `;
        
        uncategorizedItems.forEach(item => {
          html += renderReportItem(item);
        });
        
        html += `
            </ul>
          </div>
        `;
      }
    } else {
      // For other categories, just list all items
      html += `<ul style="margin: 0; padding-left: 20px;">`;
      
      categoryItems.forEach(item => {
        html += renderReportItem(item);
      });
      
      html += `</ul>`;
    }
  }
  
  html += `</div>`;
  
  return html;
}

function renderReportItem(item: ReportItem): string {
  return `
    <li style="margin-bottom: 5px;">
      <div style="font-weight: bold;">${item.name}</div>
      ${item.description ? `<div style="font-size: 13px; color: #666; margin-left: 10px;">${sanitizeHtml(item.description)}</div>` : ''}
    </li>
  `;
}
