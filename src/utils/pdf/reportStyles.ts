
export const getReportStyles = (): string => {
  return `
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.5; color: #333; margin: 0; padding: 0; }
      
      /* Page container for better page break control */
      .page-container {
        width: 210mm;
        min-height: 297mm;
        padding: 15mm 15mm 20mm 15mm; /* Top, Right, Bottom, Left */
        margin: 0 auto 5mm auto;
        background-color: white;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        position: relative;
        box-sizing: border-box;
        overflow: hidden;
        page-break-after: always;
        break-after: page;
      }
      
      /* For preview only - not affecting PDF */
      @media screen {
        body {
          background: #f0f0f0;
          padding: 20px 0;
        }
        .page-container {
          border: 1px solid #ddd;
        }
      }
      
      /* Ensure page breaks properly for PDF */
      @media print {
        .page-container {
          box-shadow: none;
          margin: 0;
          page-break-after: always;
          break-after: page;
        }
      }
      
      /* Page number display */
      .page-number {
        position: absolute;
        bottom: 10mm;
        width: 100%;
        left: 0;
        text-align: center;
        font-size: 10px;
        color: #666;
      }
      
      /* Header styles */
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
      .info-link { font-size: 11px; color: #1890ff; text-decoration: none; margin-left: 5px; cursor: pointer; background-color: transparent; }
      .info-link:hover { text-decoration: underline; }
      .item-description { font-size: 13px; color: #666; margin-left: 10px; }
      .item-link { font-size: 11px; color: #1890ff; margin-left: 10px; font-style: italic; }
      .item-link a { color: #1890ff; text-decoration: none; background-color: transparent; }
      .item-link a:hover { text-decoration: underline; }
      .notes-section { margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px; }
      .notes-title { font-size: 16px; color: #1890ff; margin-bottom: 10px; font-weight: bold; }
      .notes-content { white-space: pre-wrap; font-size: 14px; }
      .logo { max-height: 80px; max-width: 200px; }
      
      /* Ensure links are clearly visible and interactive */
      a { color: #1890ff; text-decoration: none; background-color: rgba(24, 144, 255, 0.1); padding: 0 3px; }
      a[target="_blank"]::after { content: ""; margin-left: 3px; }
    </style>
  `;
};
