
import { ReportItem, CategoryType } from '@/types';
import { ReportContext } from './types';
import { renderCategorySection } from './sections/categorySection';

export const renderCategorySections = (
  categories: CategoryType[], 
  selectedItems: ReportItem[], 
  context: ReportContext
): string => {
  let sectionsHtml = '';
  
  // Process categories in the correct order
  categories.forEach(categoryId => {
    // Get items for this category
    const categoryItems = selectedItems.filter(item => item.categoryId === categoryId);
    
    if (categoryItems.length > 0) {
      // Wrap each category in a section div for pagination
      sectionsHtml += `
        <div class="section category-${categoryId}">
          ${renderCategorySection(
            categoryId, 
            categoryItems, 
            context.categoryNames, 
            context.subcategories, 
            context.getSubcategoryName
          )}
        </div>
      `;
    }
  });
  
  return sectionsHtml;
};
