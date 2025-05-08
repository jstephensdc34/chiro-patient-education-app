
export const getReportStyles = (): string => {
  return `
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
      .item-link { font-size: 11px; color: #1890ff; margin-left: 10px; font-style: italic; }
      .notes-section { margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px; }
      .notes-title { font-size: 16px; color: #1890ff; margin-bottom: 10px; font-weight: bold; }
      .notes-content { white-space: pre-wrap; font-size: 14px; }
      .logo { max-height: 80px; max-width: 200px; }
    </style>
  `;
};
