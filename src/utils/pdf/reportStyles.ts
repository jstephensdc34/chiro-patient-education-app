export const getReportStyles = (): string => {
  return `
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.5; color: #333; }
      
      /* Header styles updated to match ReportPreview */
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
      .patient-name { font-size: 18px; margin-bottom: 10px; font-weight: bold; }
      .patient-info { font-size: 14px; margin-bottom: 20px; color: #666; }
      
      /* Report content styles */
      .category-section { margin-bottom: 20px; }
      .category-title { font-size: 16px; color: #00528c; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 10px; font-weight: bold; }
      .subcategory { margin-bottom: 10px; }
      .subcategory-title { font-size: 15px; margin-bottom: 5px; color: #096dd9; font-weight: bold; }
      ul { margin: 0; padding-left: 20px; }
      li { margin-bottom: 5px; }
      .item-name { font-weight: bold; }
      .info-link { font-size: 11px; color: #1890ff; text-decoration: none; margin-left: 5px; cursor: pointer; background-color: transparent; }
      .info-link:hover { text-decoration: underline; }
      .item-description { font-size: 13px; color: #666; margin-left: 10px; }
      .item-link { font-size: 11px; color: #1890ff; margin-left: 10px; font-style: italic; }
      .item-link a { color: #1890ff; text-decoration: none; background-color: transparent; }
      .item-link a:hover { text-decoration: underline; }
      
      /* Notes section */
      .notes-section { margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px; }
      .notes-title { font-size: 16px; color: #00528c; margin-bottom: 10px; font-weight: bold; }
      .notes-content { white-space: pre-wrap; font-size: 14px; }
      
      /* Links */
      a { color: #1890ff; text-decoration: none; background-color: rgba(24, 144, 255, 0.1); padding: 0 3px; }
      a[target="_blank"]::after { content: ""; margin-left: 3px; }
      
      /* Footer */
      .footer {
        border-top: 1px solid #eee;
        padding-top: 8px;
        margin-top: 20px;
      }
      .footer-content {
        font-size: 12px;
        color: #666;
        text-align: center;
      }
      .footer-item {
        margin: 0 10px;
      }
      
      /* Container */
      .container {
        margin: 2rem auto;
        max-width: 800px;
      }
      
      /* Section */
      .section {
        margin-bottom: 2rem;
      }
    </style>
  `;
};
