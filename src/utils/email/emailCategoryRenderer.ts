
export const renderEmailCategorySection = (
  categoryId: string,
  categoryItems: any[],
  categoryNames: Record<string, string>,
  subcategories: any[],
  getSubcategoryName: (subcategoryId: string) => string
): string => {
  const categoryName = categoryNames[categoryId] || categoryId;
  
  // Group items by subcategory
  const itemsBySubcategory: Record<string, any[]> = {};
  const itemsWithoutSubcategory: any[] = [];
  
  categoryItems.forEach(item => {
    if (item.subcategoryId) {
      if (!itemsBySubcategory[item.subcategoryId]) {
        itemsBySubcategory[item.subcategoryId] = [];
      }
      itemsBySubcategory[item.subcategoryId].push(item);
    } else {
      itemsWithoutSubcategory.push(item);
    }
  });
  
  let sectionHTML = `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 25px; border: 1px solid #e5e7eb;">
      <tr>
        <td style="background-color: #3b82f6; color: #ffffff; padding: 12px 20px; font-size: 18px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">
          ${categoryName}
        </td>
      </tr>
  `;
  
  // Render items without subcategory first
  if (itemsWithoutSubcategory.length > 0) {
    itemsWithoutSubcategory.forEach(item => {
      sectionHTML += renderEmailItem(item);
    });
  }
  
  // Render items grouped by subcategory
  Object.keys(itemsBySubcategory).forEach(subcategoryId => {
    const subcategoryName = getSubcategoryName(subcategoryId);
    const items = itemsBySubcategory[subcategoryId];
    
    if (subcategoryName) {
      sectionHTML += `
        <tr>
          <td style="background-color: #e5e7eb; color: #374151; padding: 10px 20px; font-size: 16px; font-weight: 600; border-left: 4px solid #3b82f6;">
            ${subcategoryName}
          </td>
        </tr>
      `;
    }
    
    items.forEach(item => {
      sectionHTML += renderEmailItem(item);
    });
  });
  
  sectionHTML += `</table>`;
  
  return sectionHTML;
};

const renderEmailItem = (item: any): string => {
  return `
    <tr>
      <td style="padding: 15px 20px; border-bottom: 1px solid #f3f4f6;">
        <h4 style="color: #1f2937; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">${item.name}</h4>
        <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 0 0 10px 0;">${item.description}</p>
        ${item.infoLink ? `
          <a href="${item.infoLink}" target="_blank" style="display: inline-block; color: #3b82f6; text-decoration: none; font-size: 13px; padding: 6px 12px; background-color: #eff6ff; border-radius: 4px; border: 1px solid #dbeafe;">
            More Information
          </a>
        ` : ''}
      </td>
    </tr>
  `;
};
