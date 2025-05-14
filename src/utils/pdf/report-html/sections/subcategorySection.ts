
import { ReportItem } from '@/types';
import { renderReportItem } from './reportItem';

export const renderSubcategories = (
  categoryItems: ReportItem[],
  orderedSubcategories: any[],
  getSubcategoryName: (subcategoryId: string) => string
): string => {
  let html = '';
  
  orderedSubcategories.forEach(subcategory => {
    const subcategoryItems = categoryItems.filter(item => item.subcategoryId === subcategory.id);
    
    if (subcategoryItems.length > 0) {
      html += renderSubcategoryItems(subcategory.id, subcategoryItems, getSubcategoryName);
    }
  });
  
  return html;
};

export const renderSubcategoryItems = (
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
