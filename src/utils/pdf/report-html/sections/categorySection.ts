
import { ReportItem } from '@/types';
import { renderSubcategories } from './subcategorySection';
import { renderUncategorizedItems } from './uncategorizedItems';
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
  
  if (["diagnosis", "extremity", "treatment", "homecare", "exercises"].includes(categoryId)) {
    // Get ordered subcategories for this category
    const orderedSubcategories = getOrderedSubcategories(categoryId, subcategories);
    
    // Render items by subcategory in the correct order
    html += renderSubcategories(categoryItems, orderedSubcategories, getSubcategoryName);
    
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
  
  html += `</div>`;
  
  return html;
};

// Import from separate file to avoid circular dependency
import { renderReportItem } from './reportItem';
