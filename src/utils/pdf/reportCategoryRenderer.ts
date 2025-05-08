
import { ReportItem } from '@/types';
import { renderReportItem } from './reportItemRenderer';
import { getOrderedSubcategories } from '@/utils/categoryUtils';

export const renderCategorySection = (
  categoryId: string, 
  categoryItems: ReportItem[], 
  categoryNames: Record<string, string>, 
  subcategories: any[],
  getSubcategoryName: (subcategoryId: string) => string
): string => {
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
        html += renderSubcategoryItems(subcategory.id, subcategoryItems, getSubcategoryName);
      }
    });
    
    // Handle items without a subcategory
    const uncategorizedItems = categoryItems.filter(item => !item.subcategoryId);
    if (uncategorizedItems.length > 0) {
      html += renderUncategorizedItems(uncategorizedItems);
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
          html += renderSubcategoryItems(subcategory.id, subcategoryItems, getSubcategoryName);
        }
      });
      
      // Handle items without a subcategory
      const uncategorizedItems = categoryItems.filter(item => !item.subcategoryId);
      if (uncategorizedItems.length > 0) {
        html += renderUncategorizedItems(uncategorizedItems);
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
};

const renderSubcategoryItems = (
  subcategoryId: string,
  items: ReportItem[],
  getSubcategoryName: (subcategoryId: string) => string
): string => {
  return `
    <div class="subcategory">
      <h4 class="subcategory-title">
        ${getSubcategoryName(subcategoryId)}
      </h4>
      <ul>
        ${items.map(item => renderReportItem(item)).join('')}
      </ul>
    </div>
  `;
};

const renderUncategorizedItems = (items: ReportItem[]): string => {
  return `
    <div class="subcategory">
      <h4 class="subcategory-title">
        Other
      </h4>
      <ul>
        ${items.map(item => renderReportItem(item)).join('')}
      </ul>
    </div>
  `;
};
