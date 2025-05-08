
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

  // Styles that match the preview
  const styles = `
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.5; color: #333; }
      .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
      .header-content { flex-grow: 1; margin-left: 20px; }
      .clinic-name { font-size: 20px; margin: 0; color: #333; font-weight: bold; }
      .clinic-info { font-size: 14px; margin: 5px 0; color: #666; }
      .patient-name { font-size: 18px; margin-bottom: 10px; font-weight: bold; }
      .patient-info { font-size: 14px; margin-bottom: 20px; color: #666; }
      .category-section { margin-bottom: 20px; }
      .category-title { font-size: 16px; color: #1890ff; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 10px; font-weight: bold; }
      .subcategory { margin-bottom: 10px; }
      .subcategory-title { font-size: 15px; margin-bottom: 5px; color: #096dd9; font-weight: bold; }
      ul { margin: 0; padding-left: 20px; }
      li { margin-bottom: 5px; }
      .item-name { font-weight: bold; }
      .item-description { font-size: 13px; color: #666; margin-left: 10px; }
      .notes-section { margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px; }
      .notes-title { font-size: 16px; color: #1890ff; margin-bottom: 10px; font-weight: bold; }
      .notes-content { white-space: pre-wrap; font-size: 14px; }
      .logo { max-height: 80px; max-width: 200px; }
    </style>
  `;

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

function renderCategorySection(
  categoryId: string, 
  categoryItems: ReportItem[], 
  categoryNames: Record<string, string>, 
  subcategories: any[],
  getSubcategoryName: (subcategoryId: string) => string
): string {
  let html = `
    <div class="category-section">
      <h3 class="category-title">
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
          <div class="subcategory">
            <h4 class="subcategory-title">
              ${getSubcategoryName(subcategory.id)}
            </h4>
            <ul>
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
        <div class="subcategory">
          <h4 class="subcategory-title">
            Other
          </h4>
          <ul>
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
            <div class="subcategory">
              <h4 class="subcategory-title">
                ${getSubcategoryName(subcategory.id)}
              </h4>
              <ul>
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
          <div class="subcategory">
            <h4 class="subcategory-title">
              Other
            </h4>
            <ul>
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
      html += `<ul>`;
      
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
    <li>
      <div class="item-name">${item.name}</div>
      ${item.description ? `<div class="item-description">${sanitizeHtml(item.description)}</div>` : ''}
    </li>
  `;
}

