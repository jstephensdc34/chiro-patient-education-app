
export const getReportStyles = (): string => {
  return `
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.5; color: #333; margin: 0; padding: 0; }
      
      /* Header styles */
      .header { margin-bottom: 20px; }
      .header-container { display: flex; align-items: center; gap: 20px; }
      .logo-container { width: 128px; height: 128px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
      .logo { max-width: 128px; max-height: 128px; object-fit: contain; }
      .logo-placeholder { width: 100%; height: 100%; background-color: #f0f0f0; display: flex; align-items: center; justify-content: center; border-radius: 4px; }
      .logo-placeholder span { font-size: 16px; color: #888; }
      .header-content { flex-grow: 1; }
      .clinic-name { font-size: 24px; margin: 0 0 8px 0; color: #00528c; font-weight: bold; }
      .clinic-website { font-size: 16px; margin: 0; color: #666; }

      /* Patient info styles */
      .patient-info-container { margin-bottom: 1.5rem; padding-bottom: 0.5rem; border-bottom: 1px solid #eee; }
      .patient-name { font-size: 18px; margin: 0 0 0.5rem 0; font-weight: bold; }
      .patient-details { font-size: 14px; margin: 0; color: #666; }
      .patient-details span { margin-right: 1rem; display: inline-block; }
      
      /* Report content styles */
      .category-section { margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid #eee; }
      .category-title { font-size: 18px; color: #00528c; margin: 0 0 0.75rem 0; font-weight: 500; }
      .subcategory { margin-bottom: 1rem; margin-left: 0.5rem; }
      .subcategory-title { font-size: 16px; margin: 0 0 0.5rem 0; color: #096dd9; font-weight: 500; }
      
      ul { margin: 0; padding-left: 1rem; list-style-type: none; }
      li.report-item { margin-bottom: 0.75rem; }
      .item-name { font-weight: 500; }
      .info-link { font-size: 0.75rem; color: #1890ff; text-decoration: none; margin-left: 0.25rem; cursor: pointer; }
      .item-description { font-size: 0.875rem; color: #666; margin: 0.25rem 0 0.25rem 1rem; }
      .item-link { font-size: 0.75rem; color: #1890ff; margin-left: 1rem; font-style: italic; }
      .item-link a { color: #1890ff; text-decoration: none; }
      
      /* Notes section */
      .notes-section { margin-top: 2rem; }
      .notes-title { font-size: 18px; color: #00528c; margin-bottom: 0.75rem; font-weight: 500; }
      .notes-content { white-space: pre-wrap; font-size: 0.875rem; }
      
      /* Footer */
      .footer {
        border-top: 1px solid #eee;
        padding-top: 0.5rem;
        margin-top: 2rem;
      }
      .footer-content {
        font-size: 0.75rem;
        color: #666;
        text-align: center;
      }
      .footer-item { margin: 0 0.5rem; }
      
      /* Container */
      .container { margin: 2rem auto; max-width: 800px; }
      .section { margin-bottom: 2rem; }
    </style>
  `;
};
